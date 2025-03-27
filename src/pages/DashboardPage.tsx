
import React from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, ClipboardList, Clock, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Department-specific dashboard content
  const getDepartmentContent = () => {
    switch (user?.department) {
      case 'convention':
        return (
          <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3 text-blue-300">Convention Department</h2>
            <p className="text-white/70 mb-4">
              Manage all convention-related rosters, schedules, and staff assignments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard 
                title="Active Rosters" 
                value="12" 
                icon={<Calendar className="h-5 w-5 text-blue-400" />} 
                color="blue"
              />
              <DashboardCard 
                title="Staff Available" 
                value="24" 
                icon={<Users className="h-5 w-5 text-blue-400" />} 
                color="blue"
              />
              <DashboardCard 
                title="Pending Shifts" 
                value="8" 
                icon={<Clock className="h-5 w-5 text-blue-400" />} 
                color="blue"
              />
            </div>
          </div>
        );
      case 'exhibition':
        return (
          <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3 text-green-300">Exhibition Department</h2>
            <p className="text-white/70 mb-4">
              Oversee exhibition setup, event management, and gallery operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard 
                title="Upcoming Exhibitions" 
                value="5" 
                icon={<Calendar className="h-5 w-5 text-green-400" />} 
                color="green"
              />
              <DashboardCard 
                title="Staff Scheduled" 
                value="18" 
                icon={<Users className="h-5 w-5 text-green-400" />} 
                color="green"
              />
              <DashboardCard 
                title="Open Shifts" 
                value="3" 
                icon={<Clock className="h-5 w-5 text-green-400" />} 
                color="green"
              />
            </div>
          </div>
        );
      case 'theatre':
        return (
          <div className="bg-red-900/30 border border-red-500/20 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3 text-red-300">Theatre Department</h2>
            <p className="text-white/70 mb-4">
              Coordinate theatre productions, performances, and stage management.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard 
                title="Upcoming Shows" 
                value="7" 
                icon={<Calendar className="h-5 w-5 text-red-400" />} 
                color="red"
              />
              <DashboardCard 
                title="Cast & Crew" 
                value="32" 
                icon={<Users className="h-5 w-5 text-red-400" />}
                color="red"
              />
              <DashboardCard 
                title="Rehearsals Today" 
                value="4" 
                icon={<Clock className="h-5 w-5 text-red-400" />}
                color="red" 
              />
            </div>
          </div>
        );
      case 'it':
        return (
          <div className="bg-purple-900/30 border border-purple-500/20 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3 text-purple-300">IT Department</h2>
            <p className="text-white/70 mb-4">
              Maintain system performance, user access, and technical operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard 
                title="System Status" 
                value="Operational" 
                icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
                color="purple"
              />
              <DashboardCard 
                title="Active Users" 
                value="87" 
                icon={<Users className="h-5 w-5 text-purple-400" />}
                color="purple"
              />
              <DashboardCard 
                title="Open Tickets" 
                value="5" 
                icon={<AlertCircle className="h-5 w-5 text-purple-400" />}
                color="purple"
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-900/30 border border-gray-500/20 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3">General Dashboard</h2>
            <p className="text-white/70 mb-4">
              Welcome to the management system. Select a department to view specific information.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="glass-panel p-6 mb-6" style={{ animation: 'none' }}>
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
              <p className="text-white/60">
                Welcome back, {user?.name || 'User'}!
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {user?.role === 'admin' && (
                <div className="bg-purple-600/20 text-purple-300 text-xs px-2.5 py-1 rounded-full border border-purple-600/30">
                  Admin
                </div>
              )}
              {user?.role === 'manager' && (
                <div className="bg-blue-600/20 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-600/30">
                  Manager
                </div>
              )}
              {user?.role === 'teamlead' && (
                <div className="bg-green-600/20 text-green-300 text-xs px-2.5 py-1 rounded-full border border-green-600/30">
                  Team Lead
                </div>
              )}
              
              <div className="bg-white/10 text-white/80 text-xs px-2.5 py-1 rounded-full border border-white/20">
                {user?.department?.charAt(0).toUpperCase() + user?.department?.slice(1) || 'Department'}
              </div>
            </div>
          </div>
          
          {/* Department-specific content */}
          {getDepartmentContent()}
          
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Quick Access</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickAccessCard 
                title="Rosters" 
                description="View and manage staff schedules" 
                icon={<Calendar className="h-6 w-6" />}
                link="/rostering/rosters"
              />
              <QuickAccessCard 
                title="Timesheets" 
                description="Review and approve work hours" 
                icon={<ClipboardList className="h-6 w-6" />}
                link="/rostering/timesheets"
              />
              <QuickAccessCard 
                title="Open Bids" 
                description="Manage shift bidding process" 
                icon={<MessageSquare className="h-6 w-6" />}
                link="/management/bids"
              />
              <QuickAccessCard 
                title="Swap Requests" 
                description="Handle staff swap requests" 
                icon={<Users className="h-6 w-6" />}
                link="/management/swaps"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-900/30 border-blue-500/20';
      case 'green':
        return 'bg-green-900/30 border-green-500/20';
      case 'red':
        return 'bg-red-900/30 border-red-500/20';
      case 'purple':
        return 'bg-purple-900/30 border-purple-500/20';
      default:
        return 'bg-gray-900/30 border-gray-500/20';
    }
  };
  
  return (
    <Card className={`${getColorClasses()} border`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-white/80">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

// Quick Access Card Component
interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, description, icon, link }) => {
  return (
    <Card className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
      <a href={link} className="block h-full">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="p-2 rounded-full bg-white/10">{icon}</div>
          <div>
            <CardTitle className="text-md font-medium">{title}</CardTitle>
            <p className="text-xs text-white/60">{description}</p>
          </div>
        </CardHeader>
      </a>
    </Card>
  );
};

export default DashboardPage;
