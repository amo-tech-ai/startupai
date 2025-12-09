
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Define loose types to avoid strict dependency issues in this context
type Session = any;
type User = any;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  debugLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  debugLogin: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
        // 1. Try to recover mock session first (Dev Override)
        const mockSession = localStorage.getItem('mock_session');
        if (mockSession) {
            try {
                const parsedSession = JSON.parse(mockSession);
                setSession(parsedSession);
                setUser(parsedSession.user);
                setLoading(false);
                return; // Use mock session and stop
            } catch (e) {
                console.error("Failed to parse mock session", e);
                localStorage.removeItem('mock_session');
            }
        }

        // 2. If no mock session, try Supabase if configured
        if (supabase) {
            const { data } = await (supabase.auth as any).getSession();
            setSession(data.session);
            setUser(data.session?.user ?? null);
            
            // Listen for auth changes
            const { data: authListener } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
                // Only update if we aren't using a mock session
                if (!localStorage.getItem('mock_session')) {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
            });
            
            setLoading(false);
            
            return () => {
                if (authListener && authListener.subscription) {
                    authListener.subscription.unsubscribe();
                }
            };
        } else {
            setLoading(false);
        }
    };

    initAuth();
  }, []);

  const signOut = async () => {
    if (supabase) {
      await (supabase.auth as any).signOut();
    }
    // Clear mock session
    localStorage.removeItem('mock_session');
    setSession(null);
    setUser(null);
  };

  // Dev bypass function
  const debugLogin = () => {
    // Mock a user object that satisfies the basic requirements of the app
    const mockUser = { 
        id: 'debug-user', 
        email: 'demo@startupai.com', 
        user_metadata: { full_name: 'Demo Founder', avatar_url: 'https://ui-avatars.com/api/?name=Demo+Founder&background=6366f1&color=fff' },
        aud: 'authenticated',
        role: 'authenticated'
    };
    const mockSession = { user: mockUser, access_token: 'mock-token' };
    
    setUser(mockUser);
    setSession(mockSession);
    
    // Persist to local storage so refresh works in dev
    localStorage.setItem('mock_session', JSON.stringify(mockSession));
    
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, debugLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};