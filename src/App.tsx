
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeBidsPage from './pages/EmployeeBidsPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

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
  
  return <Navigate to={user ? "/bids" : "/auth"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/bids" 
            element={
              <ProtectedRoute>
                <EmployeeBidsPage />
              </ProtectedRoute>
            } 
          />
          {/* Add more routes as needed */}
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
