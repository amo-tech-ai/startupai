
import React, { Suspense } from 'react';
import { createHashRouter, Outlet } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const Home = React.lazy(() => import('./components/Home'));
const FeaturesPage = React.lazy(() => import('./components/FeaturesPage'));
const HowItWorks = React.lazy(() => import('./components/HowItWorks'));
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
const PublicEventPage = React.lazy(() => import('./components/PublicEventPage'));
const EventWizard = React.lazy(() => import('./components/events/EventWizard'));
const EventDetailsPage = React.lazy(() => import('./components/events/EventDetailsPage'));
const BlueprintPage = React.lazy(() => import('./components/blueprint/BlueprintPage'));
const NotFound = React.lazy(() => import('./components/NotFound'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const Root = () => (
  <ErrorBoundary>
    <ToastProvider>
      <NotificationProvider>
        <AuthProvider>
          <DataProvider>
            <Outlet />
          </DataProvider>
        </AuthProvider>
      </NotificationProvider>
    </ToastProvider>
  </ErrorBoundary>
);

export const router = createHashRouter([
  {
    element: <Root />,
    children: [
      {
        path: '/',
        element: <PublicLayout />,
        children: [
          { index: true, element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
          { path: 'features', element: <Suspense fallback={<PageLoader />}><FeaturesPage /></Suspense> },
          { path: 'how-it-works', element: <Suspense fallback={<PageLoader />}><HowItWorks /></Suspense> },
          { path: 'pricing', element: <Suspense fallback={<PageLoader />}><Pricing /></Suspense> },
          { path: 'login', element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
          { path: 'signup', element: <Suspense fallback={<PageLoader />}><Signup /></Suspense> },
          { path: 'blueprint', element: <Suspense fallback={<PageLoader />}><BlueprintPage /></Suspense> },
          { path: 'blueprint/:view', element: <Suspense fallback={<PageLoader />}><BlueprintPage /></Suspense> },
        ]
      },
      {
        path: 's/:id',
        element: <Suspense fallback={<PageLoader />}><PublicStartupProfile /></Suspense>
      },
      {
        path: 'e/:id',
        element: <Suspense fallback={<PageLoader />}><PublicEventPage /></Suspense>
      },
      {
        path: 'onboarding',
        element: <Suspense fallback={<PageLoader />}><StartupWizard /></Suspense>
      },
      {
        path: '/',
        element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
        children: [
          { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><Dashboard /></Suspense> },
          { path: 'startup-profile', element: <Suspense fallback={<PageLoader />}><StartupProfilePage /></Suspense> },
          { path: 'events', element: <Suspense fallback={<PageLoader />}><Dashboard /></Suspense> }, // Placeholder mapping
          { path: 'events/:id', element: <Suspense fallback={<PageLoader />}><EventDetailsPage /></Suspense> },
          { path: 'events/new', element: <Suspense fallback={<PageLoader />}><EventWizard /></Suspense> },
          { path: 'pitch-decks', element: <Suspense fallback={<PageLoader />}><PitchDecks /></Suspense> },
          { path: 'pitch-decks/:deckId', element: <Suspense fallback={<PageLoader />}><PitchDecks /></Suspense> },
          { path: 'crm', element: <Suspense fallback={<PageLoader />}><CRM /></Suspense> },
          { path: 'documents', element: <Suspense fallback={<PageLoader />}><Documents /></Suspense> },
          { path: 'documents/:docId', element: <Suspense fallback={<PageLoader />}><Documents /></Suspense> },
          { path: 'tasks', element: <Suspense fallback={<PageLoader />}><Tasks /></Suspense> },
          { path: 'settings', element: <Suspense fallback={<PageLoader />}><Settings /></Suspense> },
          { path: 'settings/:tab', element: <Suspense fallback={<PageLoader />}><Settings /></Suspense> },
          { path: 'profile', element: <Suspense fallback={<PageLoader />}><Profile /></Suspense> },
        ]
      },
      {
        path: '*',
        element: <Suspense fallback={<PageLoader />}><NotFound /></Suspense>
      }
    ]
  }
]);
