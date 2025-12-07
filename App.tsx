import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import HowItWorks from './components/HowItWorks';
import FeaturesPage from './components/FeaturesPage';
import Pricing from './components/Pricing';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PitchDecks from './components/PitchDecks';
import CRM from './components/CRM';
import Documents from './components/Documents';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import StartupWizard from './components/StartupWizard';
import Footer from './components/Footer';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';

export type PageType = 
  | 'home' 
  | 'how-it-works' 
  | 'features' 
  | 'pricing' 
  | 'login' 
  | 'signup' 
  | 'onboarding'
  | 'dashboard'
  | 'pitch-decks'
  | 'crm'
  | 'documents'
  | 'tasks'
  | 'settings';

const AppContent: React.FC = () => {
  const [page, setPage] = useState<PageType>('home');
  const { user, loading } = useAuth();

  // Define which pages are part of the "App" (require sidebar + auth layout)
  const appPages: PageType[] = [
    'dashboard', 
    'pitch-decks', 
    'crm', 
    'documents', 
    'tasks', 
    'settings',
    'onboarding'
  ];

  const isAppPage = appPages.includes(page);
  const isWizard = page === 'onboarding';

  // Auth Redirection Logic
  useEffect(() => {
    if (!loading) {
      if (user) {
        // If logged in and on public auth pages, go to dashboard
        if (page === 'login' || page === 'signup') {
          setPage('dashboard');
        }
      } else {
        // If not logged in and on protected page, go to login
        if (isAppPage && page !== 'home') { // Allow home, but protect others
           setPage('login');
        }
      }
    }
  }, [user, loading, page, isAppPage]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (page) {
      case 'home': return <Home />;
      case 'how-it-works': return <HowItWorks setPage={setPage} />;
      case 'features': return <FeaturesPage />;
      case 'pricing': return <Pricing />;
      case 'login': return <Login setPage={setPage} />;
      case 'signup': return <Signup setPage={setPage} />;
      case 'onboarding': return <StartupWizard setPage={setPage} />;
      case 'dashboard': return <Dashboard />;
      case 'pitch-decks': return <PitchDecks />;
      case 'crm': return <CRM />;
      case 'documents': return <Documents />;
      case 'tasks': return <Tasks />;
      case 'settings': return <Settings />;
      default: return <Home />;
    }
  };

  if (isWizard) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
         {renderContent()}
      </div>
    )
  }

  if (isAppPage && user) {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Sidebar currentPage={page} setPage={setPage} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Navbar currentPage={page} setPage={setPage} type="app" />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
             {renderContent()}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 overflow-x-hidden font-sans">
      <Navbar currentPage={page} setPage={setPage} type="public" />
      <main>
        {renderContent()}
      </main>
      <Footer setPage={setPage} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;