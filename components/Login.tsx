
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2, AlertCircle, ShieldOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { debugLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
        // Fallback for demo/mock mode if supabase isn't configured
        debugLogin();
        navigate('/dashboard');
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // AuthProvider listens to state changes and App.tsx redirects, but we can also push manually
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = () => {
      debugLogin();
      navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600">
            Or <button onClick={() => navigate('/signup')} className="font-medium text-primary-600 hover:text-primary-500">start your 14-day free trial</button>
          </p>
        </div>
        
        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                {error}
            </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
                <input 
                    type="email" 
                    required 
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
                    placeholder="Email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    required 
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed items-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </div>
        </form>
        
        {/* Development Bypass - ONLY VISIBLE IN DEV ENVIRONMENT */}
        {import.meta.env.DEV && (
            <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Development Mode</span>
                <button 
                    onClick={handleDevBypass}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-sm font-medium transition-all shadow-sm border border-slate-200 hover:border-slate-300"
                >
                    <ShieldOff size={16} className="text-slate-500" /> 
                    Bypass Authentication
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Login;
