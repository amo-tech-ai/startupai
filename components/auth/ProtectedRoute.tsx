import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: dataLoading } = useData();
  const location = useLocation();

  if (authLoading || (user && dataLoading)) {
    return <PageLoader />;
  }

  const isGuestUser = !user && profile && (profile.userId === 'guest' || profile.userId === 'mock');

  if (!user && !isGuestUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !profile && location.pathname !== '/onboarding') {
     return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;