
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Zap, Sparkles, Volume2, User, Bot, Loader2, Waves, Monitor } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { API_KEY } from '../lib/env';
import { useData } from '../context/DataContext';

const MotionDiv = motion.div as any;

export const LiveSessionManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  
  const { profile } = useData();
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const frameIntervalRef = useRef<number | null>(null);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(blob);
    });
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startScreenShare = async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCasting(true);
        }
    } catch (e) {
        console.warn("Screen share cancelled");
    }
  };

  const startSession = async () => {
    if (!API_KEY) return;
    setIsActive(true);
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const inputContext = new AudioContext({ sampleRate: 16000 });
    
    const analyser = inputContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: `You are the StartupAI Strategic Partner for ${profile?.name}. You can see their screen if casted. Provide punchy, real-time advice.`
      },
      callbacks: {
        onopen: () => {
          // Audio Pipeline
          const source = inputContext.createMediaStreamSource(stream);
          source.connect(analyser);
          const processor = inputContext.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } });
            });
          };
          source.connect(processor);
          processor.connect(inputContext.destination);

          // Video Pipeline (Image Frames)
          frameIntervalRef.current = window.setInterval(() => {
              if (isCasting && videoRef.current && canvasRef.current) {
                  const canvas = canvasRef.current;
                  const video = videoRef.current;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;

                  canvas.width = video.videoWidth / 2; // Downscale for speed
                  canvas.height = video.videoHeight / 2;
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  
                  canvas.toBlob(async (blob) => {
                      if (blob) {
                          const base64Data = await blobToBase64(blob);
                          sessionPromise.then(session => {
                              session.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } });
                          });
                      }
                  }, 'image/jpeg', 0.6);
              }
          }, 1000); // 1 FPS for efficiency

          drawWave();
        },
        onmessage: async (message: LiveServerMessage) => {
          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData && audioContextRef.current) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
            const buffer = await decodeAudioData(decode(audioData), audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }
        },
        onerror: (e) => setIsActive(false),
        onclose: () => setIsActive(false)
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    setIsActive(false);
    setIsCasting(false);
    audioContextRef.current?.close();
  };

  const drawWave = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3; ctx.strokeStyle = '#6366f1'; ctx.beginPath();
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0; const y = (v * canvas.height) / 2;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();
    animationRef.current = requestAnimationFrame(drawWave);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-24 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-40">
        <Volume2 size={20} className={isActive ? "animate-pulse text-indigo-400" : ""} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isActive && setIsOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <MotionDiv initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <Waves size={20} className="text-indigo-500" />
                        <h3 className="font-bold text-white">Multimodal Partner</h3>
                    </div>
                    <button onClick={() => { stopSession(); setIsOpen(false); }} className="p-2 text-slate-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-10 flex flex-col items-center">
                    <div className="w-full aspect-video mb-6 bg-black/20 rounded-2xl border border-slate-800 overflow-hidden relative">
                        <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${isCasting ? 'opacity-100' : 'opacity-0'}`} />
                        <canvas ref={canvasRef} width={400} height={100} className={`absolute inset-0 w-full h-full pointer-events-none ${isCasting ? 'opacity-30' : 'opacity-100'}`} />
                        {!isActive && !isCasting && <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">Ready for Intake</div>}
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mb-4">
                        <button 
                            onClick={startScreenShare}
                            className={`py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${isCasting ? 'bg-indigo-900 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                            <Monitor size={20} /> {isCasting ? "Casting" : "Share Screen"}
                        </button>
                        <button 
                            onClick={isActive ? stopSession : startSession} 
                            className={`py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${isActive ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/20' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500'}`}
                        >
                            {isActive ? <MicOff size={20} /> : <Mic size={20} />} {isActive ? "End" : "Connect AI"}
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Gemini 2.5 Flash Native Audio/Video</p>
                </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
