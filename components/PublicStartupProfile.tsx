
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProfileService } from '../services/supabase/profile';
import { StartupProfile, Founder } from '../types';
import Navbar from './Navbar';
import Footer from './Footer';
import { OverviewCard } from './startup-profile/OverviewCard';
import { BusinessCard } from './startup-profile/BusinessCard';
import { TeamCard } from './startup-profile/TeamCard';
import { SummaryCard } from './startup-profile/SummaryCard';
import { ArrowRight, Lock, Loader2 } from 'lucide-react';

const PublicStartupProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { profile: p, founders: f } = await ProfileService.getById(id);
        if (p) {
          setProfile(p);
          setFounders(f);
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const noOpSave = async () => {};

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium">Loading startup profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar type="public" />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="text-slate-400" size={24} />
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-2">Profile Unavailable</h1>
                <p className="text-slate-500 mb-6">This profile may be private or does not exist.</p>
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Back to Home
                </Link>
            </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar type="public" />
      
      <main className="flex-1 pb-20">
        {/* Banner */}
        <div className="h-48 md:h-64 bg-slate-900 relative overflow-hidden">
            {profile.coverImageUrl ? (
                <img src={profile.coverImageUrl} alt="Cover" className="w-full h-full object-cover opacity-50" />
            ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-900 to-slate-900"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 max-w-5xl -mt-32 relative z-10">
            {/* Header Content */}
            <div className="mb-8 flex flex-col md:flex-row items-end gap-6">
                <div className="bg-white p-2 rounded-2xl shadow-lg">
                    {profile.logoUrl ? (
                        <img src={profile.logoUrl} alt={profile.name} className="w-32 h-32 rounded-xl object-cover" />
                    ) : (
                        <div className="w-32 h-32 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-4xl border border-slate-200">
                            {profile.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex-1 pb-2">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">{profile.name}</h1>
                    <p className="text-xl text-slate-600 font-medium">{profile.tagline}</p>
                </div>
                <div className="hidden md:block pb-4">
                    <a href={profile.websiteUrl || '#'} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-transform hover:-translate-y-0.5 flex items-center gap-2">
                        Visit Website <ArrowRight size={18} />
                    </a>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">About</h2>
                        <OverviewCard 
                            viewMode="investor" 
                            profile={profile} 
                            onSave={noOpSave} 
                        />
                    </section>

                    <section>
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Market & Product</h2>
                        <BusinessCard 
                            viewMode="investor" 
                            profile={profile} 
                            onSave={noOpSave} 
                        />
                    </section>

                    <section>
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Team</h2>
                        <TeamCard 
                            viewMode="investor" 
                            founders={founders} 
                            onSave={() => {}} 
                        />
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <SummaryCard profile={profile} />
                    
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-slate-900 mb-2">Interested in {profile.name}?</h3>
                        <p className="text-sm text-slate-500 mb-6">Connect with the founders to learn more about their journey and vision.</p>
                        <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                            Request Intro
                        </button>
                    </div>
                </div>

            </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicStartupProfile;
