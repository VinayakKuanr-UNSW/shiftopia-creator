
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
  RefreshCw,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const AppSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { state } = useSidebar();
  const userRole = user?.role || 'user';

  // Helper function to check if a route is active
  const isRouteActive = (path: string) => {
    if (path === location.pathname) return true;
    // For submenus, check if the current path starts with the submenu path
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 pb-0">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-lg font-semibold transition-opacity",
                state === "collapsed" && "opacity-0"
              )}>
                Roster App
              </span>
            </div>
          </SidebarGroupLabel>
            
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isRouteActive('/dashboard')}
                  tooltip="Dashboard"
                  asChild
                >
                  <NavLink to="/dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
                
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isRouteActive('/my-roster')}
                  tooltip="My Roster"
                  asChild
                >
                  <NavLink to="/my-roster">
                    <Calendar className="h-5 w-5" />
                    <span>My Roster</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isRouteActive('/availabilities')}
                  tooltip="Availabilities"
                  asChild
                >
                  <NavLink to="/availabilities">
                    <CalendarDays className="h-5 w-5" />
                    <span>Availabilities</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isRouteActive('/bids')}
                  tooltip="My Bids"
                  asChild
                >
                  <NavLink to="/bids">
                    <BadgeCheck className="h-5 w-5" />
                    <span>My Bids</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {(userRole === 'admin' || userRole === 'manager') && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={
                        isRouteActive('/templates') ||
                        isRouteActive('/rosters') ||
                        isRouteActive('/birds-view') ||
                        isRouteActive('/timesheet')
                      }
                    >
                      <FileSpreadsheet className="h-5 w-5" />
                      <span>Rostering</span>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform ui-open:rotate-180" />
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          isActive={isRouteActive('/templates')}
                          asChild
                        >
                          <NavLink to="/templates">
                            <Workflow className="h-4 w-4" />
                            <span>Templates</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          isActive={isRouteActive('/rosters')}
                          asChild
                        >
                          <NavLink to="/rosters">
                            <FileSpreadsheet className="h-4 w-4" />
                            <span>Rosters</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          isActive={isRouteActive('/birds-view')}
                          asChild
                        >
                          <NavLink to="/birds-view">
                            <PanelLeft className="h-4 w-4" />
                            <span>Birds View</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          isActive={isRouteActive('/timesheet')}
                          asChild
                        >
                          <NavLink to="/timesheet">
                            <Clock className="h-4 w-4" />
                            <span>Timesheet</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={
                        isRouteActive('/management/bids') ||
                        isRouteActive('/management/swaps') ||
                        isRouteActive('/broadcast')
                      }
                    >
                      <Users className="h-5 w-5" />
                      <span>Management</span>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform ui-open:rotate-180" />
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          isActive={isRouteActive('/management/bids')}
                          asChild
                        >
                          <NavLink to="/management/bids">
                            <BadgeCheck className="h-4 w-4" />
                            <span>Open Bids</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          isActive={isRouteActive('/management/swaps')}
                          asChild
                        >
                          <NavLink to="/management/swaps">
                            <RefreshCw className="h-4 w-4" />
                            <span>Swap Requests</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {userRole === 'admin' && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton 
                            isActive={isRouteActive('/broadcast')}
                            asChild
                          >
                            <NavLink to="/broadcast">
                              <BellRing className="h-4 w-4" />
                              <span>Broadcast</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="hidden md:block">
        <div className="p-2 flex items-center justify-center">
          <Button variant="outline" size="sm" className="w-full">
            <span className={cn(
              "transition-opacity",
              state === "collapsed" && "opacity-0"
            )}>
              Help & Support
            </span>
            <HelpCircle className={cn(
              "h-4 w-4",
              state !== "collapsed" && "ml-2"
            )} />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
