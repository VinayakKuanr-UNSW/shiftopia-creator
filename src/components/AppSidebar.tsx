
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock,
  Users,
  FileText,
  TrendingUp,
  MessageSquare,
  BarChart2,
  ChevronDown,
  ChevronRight,
  Eye
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [rosteringOpen, setRosteringOpen] = React.useState(currentPath.includes('/rostering'));
  const [managementOpen, setManagementOpen] = React.useState(currentPath.includes('/management'));

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Dashboard" 
                  isActive={currentPath === '/dashboard'}
                  asChild
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="My Roster" 
                  isActive={currentPath === '/myroster'}
                  asChild
                >
                  <Link to="/myroster">
                    <Calendar className="h-5 w-5" />
                    <span>My Roster</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="My Availabilities" 
                  isActive={currentPath === '/availabilities'}
                  asChild
                >
                  <Link to="/availabilities">
                    <Clock className="h-5 w-5" />
                    <span>My Availabilities</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Rostering Dropdown - Not a link */}
              <SidebarMenuItem>
                <Collapsible open={rosteringOpen} onOpenChange={setRosteringOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip="Rostering" 
                      isActive={currentPath.includes('/rostering')}
                    >
                      <Users className="h-5 w-5" />
                      <span>Rostering</span>
                      {rosteringOpen ? (
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={currentPath === '/rostering/templates'}
                          asChild
                        >
                          <Link to="/rostering/templates">
                            <FileText className="h-4 w-4" />
                            <span>Templates</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={currentPath === '/rostering/rosters'}
                          asChild
                        >
                          <Link to="/rostering/rosters">
                            <Calendar className="h-4 w-4" />
                            <span>Rosters</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={currentPath === '/rostering/birds-view'}
                          asChild
                        >
                          <Link to="/rostering/birds-view">
                            <Eye className="h-4 w-4" />
                            <span>Birds-view</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={currentPath === '/rostering/timesheets'}
                          asChild
                        >
                          <Link to="/rostering/timesheets">
                            <Clock className="h-4 w-4" />
                            <span>Timesheets</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Management Dropdown - Not a link */}
              <SidebarMenuItem>
                <Collapsible open={managementOpen} onOpenChange={setManagementOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip="Management" 
                      isActive={currentPath.includes('/management')}
                    >
                      <BarChart2 className="h-5 w-5" />
                      <span>Management</span>
                      {managementOpen ? (
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={currentPath === '/management/bids'}
                          asChild
                        >
                          <Link to="/management/bids">
                            <MessageSquare className="h-4 w-4" />
                            <span>Open Bids</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={currentPath === '/management/swaps'}
                          asChild
                        >
                          <Link to="/management/swaps">
                            <Users className="h-4 w-4" />
                            <span>Swap Requests</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Insights */}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Insights" 
                  isActive={currentPath === '/insights'}
                  asChild
                >
                  <Link to="/insights">
                    <TrendingUp className="h-5 w-5" />
                    <span>Insights</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
