
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EventService } from '../services/supabase/events';
import { EventData, EventAsset } from '../types';
import Navbar from './Navbar';
import Footer from './Footer';
import { Calendar, MapPin, Clock, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Workaround for strict type checking
const MotionDiv = motion.div as any;

const PublicEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [assets, setAssets] = useState<EventAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  
  // Registration Form
  const [formData, setFormData] = useState({ name: '', email: '', ticketType: 'General' });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Assuming getById works for public access or handled by backend policies
        const data = await EventService.getById(id);
        if (data) {
            setEvent(data);
            const assetsData = await EventService.getAssets(id);
            setAssets(assetsData);
            document.title = `${data.name} | Event Registration`;
        }
      } catch (err) {
        console.error("Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
    return () => { document.title = "StartupAI"; };
  }, [id]);

  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!id || !formData.name || !formData.email) return;
      
      setRegistering(true);
      const result = await EventService.addAttendee({
          eventId: id,
          name: formData.name,
          email: formData.email,
          ticketType: formData.ticketType,
          status: 'Registered'
      });
      
      if (result) {
          setRegistered(true);
      }
      setRegistering(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // Private or Not Found State
  if (!event || (!event.isPublic && !localStorage.getItem('guest_events'))) { 
    // Allow guest mode preview if local storage present, else strict check
    const isOwner = localStorage.getItem('guest_events'); // Rough check for owner preview
    if (!event?.isPublic && !isOwner) {
        return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar type="public" />
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-slate-400" size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Event Unavailable</h1>
                    <p className="text-slate-500 mb-6">
                        This event is currently private or does not exist.
                    </p>
                    <Link to="/" className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
        );
    }
  }

  // Attempt to find a suitable cover image from assets
  const coverImage = assets.find(a => a.type === 'image' && (a.title.includes('Social') || a.title.includes('Poster')))?.content;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar type="public" />
      
      <main className="flex-1 pb-20">
        
        {/* Hero Section */}
        <div className="relative bg-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            {coverImage ? (
                <img src={coverImage} alt="Event Cover" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-80"></div>
            )}
            
            <div className="container mx-auto px-4 md:px-6 relative z-20 py-24 md:py-32 max-w-5xl text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide mb-4 border border-white/20">
                    {event.type}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{event.name}</h1>
                
                <div className="flex flex-col md:flex-row gap-6 text-lg text-slate-200">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Calendar size={20} className="text-indigo-400" />
                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Clock size={20} className="text-indigo-400" />
                        <span>{event.duration} Hours</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <MapPin size={20} className="text-indigo-400" />
                        <span>{event.city}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 max-w-5xl -mt-16 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Description */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">About the Event</h2>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>
                    </div>

                    {/* Schedule / Venue Info Placeholder (Can be expanded) */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Venue & Logistics</h2>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Location</h3>
                                <p className="text-slate-600">{event.city}</p>
                                <p className="text-sm text-slate-500 mt-1">Full address will be sent upon registration.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Registration Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sticky top-24">
                        {registered ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">You're In!</h3>
                                <p className="text-slate-500 mb-6">Check your email for your ticket and event details.</p>
                                <button 
                                    onClick={() => setRegistered(false)}
                                    className="text-sm text-indigo-600 font-bold hover:underline"
                                >
                                    Register another guest
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Secure Your Spot</h3>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Jane Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                                    <input 
                                        required
                                        type="email" 
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="jane@company.com"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Ticket Type</label>
                                    <select 
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        value={formData.ticketType}
                                        onChange={e => setFormData({...formData, ticketType: e.target.value})}
                                    >
                                        <option value="General">General Admission - Free</option>
                                        <option value="VIP">VIP Access</option>
                                        <option value="Press">Media / Press</option>
                                    </select>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={registering}
                                    className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {registering ? <Loader2 size={20} className="animate-spin" /> : "Complete Registration"}
                                </button>
                                
                                <p className="text-xs text-center text-slate-400 mt-4">
                                    By registering, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </form>
                        )}
                    </div>
                </div>

            </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicEventPage;
