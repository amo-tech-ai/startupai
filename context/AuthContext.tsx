
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
    // Check if Supabase is configured or if we have a mock session
    if (!supabase) {
        // Try to restore mock session from local storage for dev persistence
        const mockSession = localStorage.getItem('mock_session');
        if (mockSession) {
            try {
                const parsedSession = JSON.parse(mockSession);
                setSession(parsedSession);
                setUser(parsedSession.user);
            } catch (e) {
                console.error("Failed to parse mock session", e);
                localStorage.removeItem('mock_session');
            }
        }
        setLoading(false);
        return;
    }

    // Initial session check
    supabase.auth.getSession().then(({ data }: any) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      if (data && data.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
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
        user_metadata: { full_name: 'Demo Founder', avatar_url: 'https://picsum.photos/200' },
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
