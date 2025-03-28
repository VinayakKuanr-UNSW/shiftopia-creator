
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RostersPage from "./pages/RostersPage";
import TimesheetPage from "./pages/TimesheetPage";
import TemplatesPage from "./pages/TemplatesPage";
import ManagementPage from "./pages/ManagementPage";
import EmployeeBidsPage from "./pages/EmployeeBidsPage";
import InsightsPage from "./pages/InsightsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            {/* Rostering routes */}
            <Route path="/rostering/templates" element={
              <ProtectedRoute>
                <TemplatesPage />
              </ProtectedRoute>
            } />
            <Route path="/rostering/rosters" element={
              <ProtectedRoute>
                <RostersPage />
              </ProtectedRoute>
            } />
            <Route path="/rostering/timesheets" element={
              <ProtectedRoute>
                <TimesheetPage />
              </ProtectedRoute>
            } />
            
            {/* Management routes */}
            <Route path="/management/:type" element={
              <ProtectedRoute requiredRole="manager">
                <ManagementPage />
              </ProtectedRoute>
            } />
            
            {/* Employee bids route */}
            <Route path="/employee/bids" element={
              <ProtectedRoute>
                <EmployeeBidsPage />
              </ProtectedRoute>
            } />
            
            {/* Insights route */}
            <Route path="/insights" element={
              <ProtectedRoute>
                <InsightsPage />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
