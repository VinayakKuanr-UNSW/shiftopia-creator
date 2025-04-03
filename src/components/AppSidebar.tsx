
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
  BadgeCheck,
  RefreshCw
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import Navbar from './Navbar';
import { ThemeSelector } from './ThemeSelector';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';

// Define sidebar items structure with nested items for sections with sub-menus
const sidebarItemsStructure = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'My Roster',
    to: '/my-roster',
    icon: <Calendar size={18} />,
  },
  {
    label: 'Timesheet',
    to: '/timesheet',
    icon: <Clock size={18} />,
  },
  {
    label: 'Availabilities',
    to: '/availabilities',
    icon: <CalendarDays size={18} />,
  },
  {
    label: 'My Bids',
    to: '/bids',
    icon: <BadgeCheck size={18} />,
  },
  {
    label: 'Rostering',
    icon: <FileSpreadsheet size={18} />,
    roles: ['admin', 'manager'],
    submenu: [
      {
        label: 'Templates',
        to: '/templates',
        icon: <Workflow size={16} />,
      },
      {
        label: 'Rosters',
        to: '/rosters',
        icon: <FileSpreadsheet size={16} />,
      },
      {
        label: 'Birds View',
        to: '/birds-view',
        icon: <PanelLeft size={16} />,
      },
      {
        label: 'Timesheet',
        to: '/timesheet',
        icon: <Clock size={16} />,
      },
    ],
  },
  {
    label: 'Management',
    icon: <Users size={18} />,
    roles: ['admin', 'manager'],
    submenu: [
      {
        label: 'Open Bids',
        to: '/management/bids',
        icon: <BadgeCheck size={16} />,
      },
      {
        label: 'Swap Requests',
        to: '/management/swaps',
        icon: <RefreshCw size={16} />,
      },
      {
        label: 'Broadcast',
        to: '/broadcast',
        icon: <BellRing size={16} />,
        roles: ['admin'],
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role || 'user';

  // Helper function to check if a route is active (exact match or starts with for submenus)
  const isRouteActive = (path: string) => {
    if (path === location.pathname) return true;
    // For submenus, check if the current path starts with the submenu path
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Filter items based on user role
  const filteredItems = sidebarItemsStructure.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  return (
    <div className="h-screen flex flex-col border-r">
      {/* Include NavBar at the top of the sidebar */}
      <Navbar />
      
      <div className="px-4 py-2 flex justify-between items-center">
        <h2 className="text-lg font-bold">Menu</h2>
        <ThemeSelector />
      </div>
      
      <Separator />
      
      <nav className="flex-1 overflow-auto">
        <ul className="mt-2 space-y-1 px-2">
          {filteredItems.map((item) => (
            <li key={item.label}>
              {item.submenu ? (
                <Collapsible className="w-full">
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="pl-6 space-y-1 pt-1">
                      {item.submenu.map(subItem => {
                        // Filter submenu items based on roles
                        if (subItem.roles && !subItem.roles.includes(userRole)) {
                          return null;
                        }
                        
                        return (
                          <li key={subItem.label}>
                            <NavLink
                              to={subItem.to}
                              className={({ isActive }) => 
                                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                                  isActive || isRouteActive(subItem.to)
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'hover:bg-muted'
                                }`
                              }
                            >
                              {subItem.icon}
                              {subItem.label}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive || isRouteActive(item.to)
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AppSidebar;
