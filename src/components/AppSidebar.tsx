
import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { 
  Calendar, 
  LayoutDashboard, 
  Clock, 
  PanelLeft, 
  Users,
  Workflow,
  CalendarDays,
  FileSpreadsheet,
  BellRing,
  BadgeCheck
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

// Define sidebar items with their routes, icons, and access roles
const sidebarItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/my-roster', label: 'My Roster', icon: <Calendar size={18} /> },
  { to: '/timesheet', label: 'Timesheet', icon: <Clock size={18} /> },
  { to: '/availabilities', label: 'Availabilities', icon: <CalendarDays size={18} /> },
  { to: '/bids', label: 'My Bids', icon: <BadgeCheck size={18} /> },
  { 
    to: '/rosters', 
    label: 'Rosters', 
    icon: <FileSpreadsheet size={18} />,
    roles: ['admin', 'manager'],
  },
  { 
    to: '/birds-view', 
    label: 'Birds View', 
    icon: <PanelLeft size={18} />,
    roles: ['admin', 'manager'],
  },
  { 
    to: '/templates', 
    label: 'Templates', 
    icon: <Workflow size={18} />,
    roles: ['admin'],
  },
  { 
    to: '/management', 
    label: 'Management', 
    icon: <Users size={18} />,
    roles: ['admin', 'manager'],
  },
  {
    to: '/broadcast',
    label: 'Broadcast',
    icon: <BellRing size={18} />,
    roles: ['admin'],
  }
];

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role || 'user';

  // Filter sidebar items based on user role
  const filteredItems = sidebarItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  return (
    <div className="h-full py-4 flex flex-col border-r">
      <div className="px-4 py-2">
        <h2 className="text-lg font-bold">Menu</h2>
      </div>
      <Separator />
      <nav className="flex-1 overflow-auto">
        <ul className="mt-2 space-y-1 px-2">
          {filteredItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AppSidebar;
