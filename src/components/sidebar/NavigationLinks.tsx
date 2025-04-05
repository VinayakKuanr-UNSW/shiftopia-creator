
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarDays, 
  BadgeCheck, 
  Clock, 
  FileSpreadsheet, 
  PanelLeft, 
  Workflow,
  Users,
  BellRing,
  Settings,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import NavItem from './NavItem';
import NavSection from './NavSection';

interface NavigationLinksProps {
  openMenus: {[key: string]: boolean};
  toggleMenu: (menu: string) => void;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ openMenus, toggleMenu }) => {
  const location = useLocation();
  const { hasPermission } = useAuth();

  const isRouteActive = (path: string) => {
    if (path === location.pathname) return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <div className="flex-1 overflow-y-auto py-4 px-3">
      <NavItem
        icon={<LayoutDashboard className="h-5 w-5" />}
        label="Dashboard"
        path="/dashboard"
        active={isRouteActive('/dashboard')}
      />
      
      <NavSection
        title="My Workspace"
        isOpen={openMenus['workspace']}
        onToggle={() => toggleMenu('workspace')}
        collapsed={false}
      >
        <NavItem
          icon={<Calendar className="h-5 w-5" />}
          label="My Roster"
          path="/my-roster"
          active={isRouteActive('/my-roster')}
          indent
        />
        <NavItem
          icon={<CalendarDays className="h-5 w-5" />}
          label="Availabilities"
          path="/availabilities"
          active={isRouteActive('/availabilities')}
          indent
        />
        <NavItem
          icon={<BadgeCheck className="h-5 w-5" />}
          label="My Bids"
          path="/bids"
          active={isRouteActive('/bids')}
          indent
        />
      </NavSection>
      
      {(hasPermission('templates') || hasPermission('rosters') || hasPermission('birds-view') || hasPermission('timesheet-view')) && (
        <NavSection
          title="Rostering"
          isOpen={openMenus['rostering']}
          onToggle={() => toggleMenu('rostering')}
          collapsed={false}
        >
          {hasPermission('templates') && (
            <NavItem
              icon={<Workflow className="h-5 w-5" />}
              label="Templates"
              path="/templates"
              active={isRouteActive('/templates')}
              indent
            />
          )}
          {hasPermission('rosters') && (
            <NavItem
              icon={<FileSpreadsheet className="h-5 w-5" />}
              label="Rosters"
              path="/rosters"
              active={isRouteActive('/rosters')}
              indent
            />
          )}
          {hasPermission('birds-view') && (
            <NavItem
              icon={<PanelLeft className="h-5 w-5" />}
              label="Birds View"
              path="/birds-view"
              active={isRouteActive('/birds-view')}
              indent
            />
          )}
          {hasPermission('timesheet-view') && (
            <NavItem
              icon={<Clock className="h-5 w-5" />}
              label="Timesheet"
              path="/timesheet"
              active={isRouteActive('/timesheet')}
              indent
            />
          )}
        </NavSection>
      )}
      
      {hasPermission('management') && (
        <NavSection
          title="Management"
          isOpen={openMenus['management']}
          onToggle={() => toggleMenu('management')}
          collapsed={false}
        >
          <NavItem
            icon={<BadgeCheck className="h-5 w-5" />}
            label="Open Bids"
            path="/management/bids"
            active={isRouteActive('/management/bids')}
            indent
          />
          <NavItem
            icon={<RefreshCw className="h-5 w-5" />}
            label="Swap Requests"
            path="/management/swaps"
            active={isRouteActive('/management/swaps')}
            indent
          />
        </NavSection>
      )}
      
      {hasPermission('broadcast') && (
        <NavItem
          icon={<BellRing className="h-5 w-5" />}
          label="Broadcast"
          path="/broadcast"
          active={isRouteActive('/broadcast')}
        />
      )}
      
      {hasPermission('insights') && (
        <NavItem
          icon={<TrendingUp className="h-5 w-5" />}
          label="Insights"
          path="/insights"
          active={isRouteActive('/insights')}
        />
      )}
      
      {hasPermission('configurations') && (
        <NavItem
          icon={<Settings className="h-5 w-5" />}
          label="Configurations"
          path="/configurations"
          active={isRouteActive('/configurations')}
        />
      )}
    </div>
  );
};

export default NavigationLinks;
