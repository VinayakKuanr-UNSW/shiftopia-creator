
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/components/ui/sidebar";
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
import ProfilePage from "./pages/ProfilePage";
import MyRosterPage from "./pages/MyRosterPage";
import AvailabilitiesPage from "./pages/AvailabilitiesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { AppSidebar } from "./components/AppSidebar";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full flex flex-col">
        <Navbar />
        <div className="flex-1 flex">
          <AppSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <SearchProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Protected routes with layout */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DashboardPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProfilePage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* My Roster route */}
                <Route path="/myroster" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MyRosterPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Availabilities route */}
                <Route path="/availabilities" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AvailabilitiesPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Rostering routes */}
                <Route path="/rostering/templates" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TemplatesPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/rostering/rosters" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <RostersPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/rostering/timesheets" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TimesheetPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Management routes */}
                <Route path="/management/:type" element={
                  <ProtectedRoute requiredRole="manager">
                    <AppLayout>
                      <ManagementPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Employee bids route */}
                <Route path="/employee/bids" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <EmployeeBidsPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Insights route */}
                <Route path="/insights" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <InsightsPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
