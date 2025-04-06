
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from './components/ui/sidebar';

// Pages
import EmployeeBidsPage from './pages/EmployeeBidsPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MyRosterPage from './pages/MyRosterPage';
import AvailabilitiesPage from './pages/AvailabilitiesPage';
import RostersPage from './pages/RostersPage';
import BirdsViewPage from './pages/BirdsViewPage';
import TimesheetPage from './pages/TimesheetPage';
import BroadcastPage from './pages/BroadcastPage';
import InsightsPage from './pages/InsightsPage';
import ConfigurationsPage from './pages/ConfigurationsPage';
import ProfilePage from './pages/ProfilePage';
import ManagementPage from './pages/ManagementPage';
import NotFound from './pages/NotFound';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/AppLayout';
import { useAuth } from './hooks/useAuth';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// A component to handle the root path redirect based on auth status
const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return <Navigate to={user ? "/dashboard" : "/auth"} replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <Router>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected routes with AppLayout */}
              <Route element={<AppLayout />}>
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-roster" 
                  element={
                    <ProtectedRoute>
                      <MyRosterPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/availabilities" 
                  element={
                    <ProtectedRoute>
                      <AvailabilitiesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/bids" 
                  element={
                    <ProtectedRoute>
                      <EmployeeBidsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/templates" 
                  element={
                    <ProtectedRoute requiredFeature="templates">
                      <RostersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/rosters" 
                  element={
                    <ProtectedRoute requiredFeature="rosters">
                      <RostersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/birds-view" 
                  element={
                    <ProtectedRoute requiredFeature="birds-view">
                      <BirdsViewPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/timesheet" 
                  element={
                    <ProtectedRoute requiredFeature="timesheet-view">
                      <TimesheetPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/management/:tab" 
                  element={
                    <ProtectedRoute requiredFeature="management">
                      <ManagementPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/broadcast" 
                  element={
                    <ProtectedRoute requiredFeature="broadcast">
                      <BroadcastPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/insights" 
                  element={
                    <ProtectedRoute requiredFeature="insights">
                      <InsightsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/configurations" 
                  element={
                    <ProtectedRoute requiredFeature="configurations">
                      <ConfigurationsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
