
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./components/Navbar";
import AppSidebar from "./components/AppSidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RostersPage from "./pages/RostersPage";
import BirdsViewPage from "./pages/BirdsViewPage";
import TimesheetPage from "./pages/TimesheetPage";
import TemplatesPage from "./pages/TemplatesPage";
import ManagementPage from "./pages/ManagementPage";
import EmployeeBidsPage from "./pages/EmployeeBidsPage";
import InsightsPage from "./pages/InsightsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProfilePage from "./pages/ProfilePage";
import MyRosterPage from "./pages/MyRosterPage";
import AvailabilitiesPage from "./pages/AvailabilitiesPage";
import BroadcastPage from "./pages/BroadcastPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Layout component that includes the Navbar and Sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <SearchProvider>
            <SidebarProvider defaultOpen={true}>
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
                  <Route path="/my-roster" element={
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
                  
                  {/* Broadcast route - Admin only */}
                  <Route path="/broadcast" element={
                    <ProtectedRoute requiredRole="admin">
                      <AppLayout>
                        <BroadcastPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Rostering routes */}
                  <Route path="/templates" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <TemplatesPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/rosters" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <RostersPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/birds-view" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <BirdsViewPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/timesheet" element={
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
                  <Route path="/bids" element={
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
            </SidebarProvider>
          </SearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
