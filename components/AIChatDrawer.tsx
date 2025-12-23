
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, User, Bot, Loader2, Brain, Cpu } from 'lucide-react';
import { ChatAI } from '../services/chatAI';
import { useData } from '../context/DataContext';
import { API_KEY } from '../lib/env';
import { ChatMessage, EventData, Deck, InvestorDoc } from '../types';
import { generateUUID } from '../lib/utils';
import { useParams, useLocation } from 'react-router-dom';

const MotionDiv = motion.div as any;
const CHAT_STORAGE_KEY = 'startup_ai_chat_history_v3';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose }) => {
  const { profile, metrics, deals, tasks, events, decks, docs } = useData();
  const { id, deckId, docId } = useParams();
  const location = useLocation();
  const [input, setInput] = useState('');
  
  const focusedEntity = useMemo(() => {
    if (location.pathname.startsWith('/events/')) {
        const data = events.find(e => e.id === id);
        return { type: 'event' as const, data, label: data?.name };
    }
    if (location.pathname.startsWith('/pitch-decks/')) {
        const data = decks.find(d => d.id === deckId);
        return { type: 'deck' as const, data, label: data?.title };
    }
    if (location.pathname.startsWith('/documents/')) {
        const data = docs.find(d => d.id === docId);
        return { type: 'doc' as const, data, label: data?.title };
    }
    return null;
  }, [events, decks, docs, id, deckId, docId, location.pathname]);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
          try { return JSON.parse(saved); } catch(e) {}
      }
      return [{ id: 'welcome', role: 'model', content: `Hi! I'm your Startup Copilot. I'm synced to your roadmap. How can I help you grow today?`, timestamp: new Date().toISOString() }];
  });

  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages)); }, [messages]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !API_KEY) return;
    const userMsg: ChatMessage = { id: generateUUID(), role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const apiHistory = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
      const responseText = await ChatAI.sendMessage(apiHistory, userMsg.content, { 
          profile, metrics, deals, tasks, 
          event: focusedEntity?.type === 'event' ? focusedEntity.data as EventData : null,
          deck: focusedEntity?.type === 'deck' ? focusedEntity.data as Deck : null,
          doc: focusedEntity?.type === 'doc' ? focusedEntity.data as InvestorDoc : null
      });
      setMessages(prev => [...prev, { id: generateUUID(), role: 'model', content: responseText || "Issue connecting...", timestamp: new Date().toISOString() }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: generateUUID(), role: 'model', content: "AI Connection Error.", timestamp: new Date().toISOString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" />
          <MotionDiv initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Sparkles size={20} /></div>
                <div>
                  <h2 className="font-bold text-slate-900">Startup Copilot</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Memory</p>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <div className="px-6 py-2 border-b border-slate-100 bg-slate-50 flex gap-2 overflow-x-auto hide-scrollbar">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-full shrink-0">
                    <Brain size={10} className="text-indigo-500" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Context: {profile?.name}</span>
                </div>
                {focusedEntity && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 border border-indigo-100 rounded-full shrink-0 animate-in zoom-in-50">
                        <Cpu size={10} className="text-indigo-600" />
                        <span className="text-[10px] font-bold text-indigo-700 uppercase truncate max-w-[120px]">{focusedEntity.label}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50" ref={scrollRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-white border-slate-200 text-slate-600' : 'bg-indigo-600 border-indigo-700 text-white'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-white border border-slate-200 text-slate-800 rounded-tr-none' : 'bg-indigo-600 text-white rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && <div className="animate-pulse flex gap-2 p-4 text-slate-400 text-xs italic"><Bot size={14}/> Copilot is thinking...</div>}
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <div className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask about your strategy..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2" />
                <button onClick={handleSend} disabled={!input.trim() || isTyping} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"><Send size={18} /></button>
              </div>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};
