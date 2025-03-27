import React from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, ClipboardList, Clock, MessageSquare, TrendingUp, AlertCircle, BarChart } from 'lucide-react';
import { WeeklyStats } from '@/components/dashboard/WeeklyStats';
import { StaffingAlertCard } from '@/components/dashboard/StaffingAlertCard';
import { EmployeeSpotlightCard } from '@/components/dashboard/EmployeeSpotlightCard';

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
            
            {/* Weekly Stats for Convention */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-300">Weekly Overview</h3>
              <WeeklyStats 
                department="convention" 
                color="blue"
                stats={{
                  shiftsAssigned: 48,
                  shiftsFilled: 42,
                  attendanceRate: 92,
                  pendingShifts: 6,
                  noShows: 2,
                  utilizationRate: 87
                }}
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
            
            {/* Weekly Stats for Exhibition */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-green-300">Weekly Overview</h3>
              <WeeklyStats 
                department="exhibition" 
                color="green"
                stats={{
                  shiftsAssigned: 36,
                  shiftsFilled: 33,
                  attendanceRate: 95,
                  pendingShifts: 3,
                  noShows: 1,
                  utilizationRate: 91
                }}
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
            
            {/* Weekly Stats for Theatre */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-red-300">Weekly Overview</h3>
              <WeeklyStats 
                department="theatre" 
                color="red"
                stats={{
                  shiftsAssigned: 54,
                  shiftsFilled: 48,
                  attendanceRate: 89,
                  pendingShifts: 6,
                  noShows: 4,
                  utilizationRate: 84
                }}
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
            
            {/* Weekly Stats for IT */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-purple-300">Weekly Overview</h3>
              <WeeklyStats 
                department="it" 
                color="purple"
                stats={{
                  shiftsAssigned: 22,
                  shiftsFilled: 22,
                  attendanceRate: 100,
                  pendingShifts: 0,
                  noShows: 0,
                  utilizationRate: 95
                }}
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
          
          {/* Alerts section */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Alerts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StaffingAlertCard 
                title="Low Staff Alert" 
                description="Theatre department is understaffed for upcoming weekend shifts"
                severity="high"
                actionText="View Shifts"
                actionLink="/rostering/rosters"
              />
              <StaffingAlertCard 
                title="Pending Approvals" 
                description="6 timesheets pending your approval from last week"
                severity="medium"
                actionText="Review Timesheets"
                actionLink="/rostering/timesheets"
              />
            </div>
          </div>
          
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
          
          {/* Employee spotlight section */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Employee Spotlight</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EmployeeSpotlightCard 
                name="John Smith"
                department="convention"
                metric="100% Attendance"
                shifts={12}
              />
              <EmployeeSpotlightCard 
                name="Sarah Johnson"
                department="exhibition"
                metric="16 Shifts Completed"
                shifts={16}
              />
              <EmployeeSpotlightCard 
                name="David Chen"
                department="theatre"
                metric="15 hrs Overtime"
                shifts={10}
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

// Staff Alert Card Component
interface StaffingAlertCardProps {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionText: string;
  actionLink: string;
}

const StaffingAlertCard: React.FC<StaffingAlertCardProps> = ({ 
  title, description, severity, actionText, actionLink 
}) => {
  const getSeverityClasses = () => {
    switch (severity) {
      case 'high':
        return 'bg-red-900/30 border-red-500/30';
      case 'medium':
        return 'bg-amber-900/30 border-amber-500/30';
      case 'low':
        return 'bg-blue-900/30 border-blue-500/30';
      default:
        return 'bg-gray-900/30 border-gray-500/30';
    }
  };
  
  return (
    <Card className={`${getSeverityClasses()} border`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{description}</p>
        <a 
          href={actionLink} 
          className="text-xs font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors inline-block"
        >
          {actionText}
        </a>
      </CardContent>
    </Card>
  );
};

// Employee Spotlight Card Component
interface EmployeeSpotlightCardProps {
  name: string;
  department: string;
  metric: string;
  shifts: number;
}

const EmployeeSpotlightCard: React.FC<EmployeeSpotlightCardProps> = ({ 
  name, department, metric, shifts 
}) => {
  const getDepartmentClasses = () => {
    switch (department) {
      case 'convention':
        return 'bg-blue-900/30 border-blue-500/30 text-blue-300';
      case 'exhibition':
        return 'bg-green-900/30 border-green-500/30 text-green-300';
      case 'theatre':
        return 'bg-red-900/30 border-red-500/30 text-red-300';
      case 'it':
        return 'bg-purple-900/30 border-purple-500/30 text-purple-300';
      default:
        return 'bg-gray-900/30 border-gray-500/30 text-gray-300';
    }
  };
  
  return (
    <Card className={`${getDepartmentClasses()} border`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          {name}
        </CardTitle>
        <div className="text-xs opacity-70 capitalize">{department}</div>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold mb-1">{metric}</div>
        <div className="text-xs opacity-70">{shifts} shifts this month</div>
      </CardContent>
    </Card>
  );
};

export default DashboardPage;
