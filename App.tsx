
import React, { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import NotFound from './components/NotFound';

// Lazy Load Pages
const Home = React.lazy(() => import('./components/Home'));
const HowItWorks = React.lazy(() => import('./components/HowItWorks'));
const FeaturesPage = React.lazy(() => import('./components/FeaturesPage'));
const Pricing = React.lazy(() => import('./components/Pricing'));
const Login = React.lazy(() => import('./components/Login'));
const Signup = React.lazy(() => import('./components/Signup'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const PitchDecks = React.lazy(() => import('./components/PitchDecks'));
const CRM = React.lazy(() => import('./components/CRM'));
const Documents = React.lazy(() => import('./components/Documents'));
const Tasks = React.lazy(() => import('./components/Tasks'));
const Settings = React.lazy(() => import('./components/Settings'));
const Profile = React.lazy(() => import('./components/Profile'));
const StartupProfilePage = React.lazy(() => import('./components/StartupProfilePage'));
const StartupWizard = React.lazy(() => import('./components/StartupWizard'));
const PublicStartupProfile = React.lazy(() => import('./components/PublicStartupProfile'));
const PublicEventPage = React.lazy(() => import('./components/PublicEventPage')); // New Public Event Page
const EventWizard = React.lazy(() => import('./components/events/EventWizard'));
const EventsDashboard = React.lazy(() => import('./components/events/EventsDashboard').then(module => ({ default: module.EventsDashboard })));
const EventDetailsPage = React.lazy(() => import('./components/events/EventDetailsPage'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

// Layouts
const PublicLayout = () => (
  <div className="min-h-screen text-slate-900 overflow-x-hidden font-sans flex flex-col">
    <Navbar type="public" />
    <main className="flex-1">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </div>
);

const AppLayout = () => (
  <div className="fixed inset-0 flex bg-slate-50 font-sans text-slate-900 overflow-hidden">
    <Sidebar />
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <Navbar type="app" />
      <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  </div>
);

// Auth Guard
const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: dataLoading } = useData();
  const location = useLocation();

  if (authLoading || (user && dataLoading)) {
    return <PageLoader />;
  }

  // Check guest mode
  const isGuestUser = !user && profile && (profile.userId === 'guest' || profile.userId === 'mock');

  if (!user && !isGuestUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in but has no profile, force onboarding (unless already there)
  if (user && !profile && location.pathname !== '/onboarding') {
     return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Public Shared Profile (No Auth Required) */}
        <Route path="/s/:id" element={
          <Suspense fallback={<PageLoader />}>
            <PublicStartupProfile />
          </Suspense>
        } />

        {/* Public Event Page (No Auth Required) */}
        <Route path="/e/:id" element={
          <Suspense fallback={<PageLoader />}>
            <PublicEventPage />
          </Suspense>
        } />

        {/* Standalone Route (Wizard) */}
        <Route path="/onboarding" element={
          <Suspense fallback={<PageLoader />}>
            <StartupWizard />
          </Suspense>
        } />
        
        {/* Standalone Route (Event Wizard - Needs full screen) */}
        <Route path="/events/new" element={
          <RequireAuth>
            <Suspense fallback={<PageLoader />}>
              <EventWizard />
            </Suspense>
          </RequireAuth>
        } />

        {/* Protected App Routes */}
        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Startup Profile Management */}
          <Route path="/startup-profile" element={<StartupProfilePage />} />

          {/* Events Dashboard */}
          <Route path="/events" element={<EventsDashboard />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />

          {/* Pitch Decks Deep Linking */}
          <Route path="/pitch-decks" element={<PitchDecks />} />
          <Route path="/pitch-decks/:deckId" element={<PitchDecks />} />
          
          <Route path="/crm" element={<CRM />} />
          
          {/* Documents Deep Linking */}
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/:docId" element={<Documents />} />
          
          <Route path="/tasks" element={<Tasks />} />
          
          {/* Settings Deep Linking */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/:tab" element={<Settings />} />
          
          {/* User Profile */}
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <NotificationProvider>
          <AuthProvider>
            <DataProvider>
              <AppContent />
            </DataProvider>
          </AuthProvider>
        </NotificationProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
