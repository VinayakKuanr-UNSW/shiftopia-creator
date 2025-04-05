import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BroadcastNotifications } from './broadcast/BroadcastNotifications';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Menu,
  Home,
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
  HelpCircle, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const UnifiedSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({});
  
  const isCollapsed = state === "collapsed";
  
  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };
  
  const isRouteActive = (path: string) => {
    if (path === location.pathname) return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-5 w-5" />;
      case 'dark': return <Moon className="h-5 w-5" />;
      case 'glass': return <Sparkles className="h-5 w-5" />;
      default: return <Sun className="h-5 w-5" />;
    }
  };
  
  const handleThemeChange = (newTheme: 'dark' | 'light' | 'glass') => {
    setTheme(newTheme);
  };
  
  const LogoSection = () => (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-3">
        {!isCollapsed && (
          <span className="text-xl font-semibold transition-opacity">
            ShiftoPia
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="rounded-full"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
  
  const NavigationLinks = () => (
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
        collapsed={isCollapsed}
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
          collapsed={isCollapsed}
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
          collapsed={isCollapsed}
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
  
  const UserSection = () => {
    if (!user) return null;
    
    return (
      <div className="p-4 border-t border-border space-y-4">
        <div className={cn("flex items-center bg-muted/30 rounded-lg", isCollapsed ? "hidden" : "")}>
          <Search className="h-4 w-4 ml-3 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="bg-transparent border-none pl-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="flex items-center justify-between">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => navigate('/search')} className="rounded-full">
                    <Search className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Search</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
          
          <ThemeToggle isCollapsed={isCollapsed} theme={theme} handleThemeChange={handleThemeChange} />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <BroadcastNotifications />
                </div>
              </TooltipTrigger>
              <TooltipContent side={isCollapsed ? "right" : "top"}>
                Notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <UserProfile user={user} isCollapsed={isCollapsed} handleLogout={handleLogout} />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("w-full flex items-center justify-center gap-2", 
                  isCollapsed && "px-2"
                )}
              >
                <HelpCircle className="h-4 w-4" />
                {!isCollapsed && <span>Help & Support</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "top"}>
              Help & Support
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <motion.div
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col bg-background border-r border-border",
        isCollapsed ? "w-[70px]" : "w-[250px]"
      )}
      initial={false}
      animate={{ width: isCollapsed ? 70 : 250 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <LogoSection />
      <NavigationLinks />
      <UserSection />
    </motion.div>
  );
};

interface ThemeToggleProps {
  isCollapsed: boolean;
  theme: 'dark' | 'light' | 'glass';
  handleThemeChange: (theme: 'dark' | 'light' | 'glass') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isCollapsed, theme, handleThemeChange }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {theme === 'light' ? <Sun className="h-5 w-5" /> : 
               theme === 'dark' ? <Moon className="h-5 w-5" /> : 
               <Sparkles className="h-5 w-5" />}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side={isCollapsed ? "right" : "top"}>Theme Settings</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align={isCollapsed ? "end" : "center"} className="w-40">
        <DropdownMenuItem 
          className={`flex items-center gap-2 cursor-pointer ${theme === 'light' ? 'bg-accent/50' : ''}`}
          onClick={() => handleThemeChange('light')}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center gap-2 cursor-pointer ${theme === 'dark' ? 'bg-accent/50' : ''}`}
          onClick={() => handleThemeChange('dark')}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center gap-2 cursor-pointer ${theme === 'glass' ? 'bg-accent/50' : ''}`}
          onClick={() => handleThemeChange('glass')}
        >
          <Sparkles className="h-4 w-4" />
          <span>Glass</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface UserProfileProps {
  user: any;
  isCollapsed: boolean;
  handleLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isCollapsed, handleLogout }) => {
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full flex items-center gap-3 px-3", 
                  isCollapsed ? "justify-center" : "justify-start"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-sm font-medium truncate">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.role}</span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side={isCollapsed ? "right" : "top"}>Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/profile">
          <DropdownMenuItem>
            <Users className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <Link to="/settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  indent?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, path, active, indent }) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            to={path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 my-1 rounded-lg transition-colors",
              active 
                ? "bg-primary/10 text-primary" 
                : "text-foreground hover:bg-muted/50",
              indent && !isCollapsed ? "ml-6" : "",
              isCollapsed && indent ? "justify-center" : ""
            )}
          >
            {icon}
            {!isCollapsed && <span className="text-sm">{label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">{label}</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

interface NavSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  collapsed: boolean;
}

const NavSection: React.FC<NavSectionProps> = ({ title, isOpen, onToggle, children, collapsed }) => {
  return (
    <div className="mb-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={cn(
                "flex items-center w-full px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors",
                collapsed ? "justify-center" : "justify-between"
              )}
            >
              {!collapsed && <span className="text-sm font-medium">{title}</span>}
              {!collapsed ? (
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform", 
                    isOpen && "transform rotate-180"
                  )} 
                />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">{title}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
      
      {!collapsed && isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default UnifiedSidebar;
