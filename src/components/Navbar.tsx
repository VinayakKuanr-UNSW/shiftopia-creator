
import React, { useState } from 'react';
import { ChevronRight, Home, Menu, Bell, Search, User, Calendar, Users, Clock, LayoutDashboard, FileText, MessageSquare, TrendingUp, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const getPathSegments = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments;
  };
  
  const pathSegments = getPathSegments();
  
  return (
    <nav className="w-full h-16 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg flex items-center px-8 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-white/90">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-all duration-200 hover:text-white">
            <Home className="h-5 w-5" />
          </Link>
          
          {pathSegments.length > 0 && (
            <>
              <ChevronRight className="h-4 w-4 text-white/60" />
              
              {pathSegments[0] === 'dashboard' && (
                <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">Dashboard</span>
              )}
              
              {pathSegments[0] === 'rostering' && (
                <>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent hover:bg-white/5 text-white/90 hover:text-white">
                          Rostering
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="bg-black/80 backdrop-blur-md border border-white/10">
                          <ul className="grid gap-3 p-4 w-[200px]">
                            <li>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/rostering/templates"
                                  className="flex items-center p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                                >
                                  <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                                  <span>Templates</span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/rostering/rosters"
                                  className="flex items-center p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                                >
                                  <Users className="h-4 w-4 mr-2 text-blue-400" />
                                  <span>Rosters</span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/rostering/timesheets"
                                  className="flex items-center p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                                >
                                  <Clock className="h-4 w-4 mr-2 text-green-400" />
                                  <span>Timesheets</span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/rostering/schedule"
                                  className="flex items-center p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                                >
                                  <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                                  <span>Schedule</span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                  
                  <ChevronRight className="h-4 w-4 text-white/60" />
                  
                  {pathSegments[1] === 'rosters' && (
                    <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">Rosters</span>
                  )}
                  
                  {pathSegments[1] === 'timesheets' && (
                    <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">Timesheets</span>
                  )}
                  
                  {pathSegments[1] === 'templates' && (
                    <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">Templates</span>
                  )}
                  
                  {pathSegments[1] === 'schedule' && (
                    <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">Schedule</span>
                  )}
                </>
              )}
              
              {pathSegments[0] === 'management' && (
                <>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent hover:bg-white/5 text-white/90 hover:text-white">
                          Management
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="bg-black/80 backdrop-blur-md border border-white/10">
                          <ul className="grid gap-3 p-4 w-[200px]">
                            <li>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/management/bids"
                                  className="flex items-center p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                                >
                                  <MessageSquare className="h-4 w-4 mr-2 text-purple-400" />
                                  <span>Open Bids</span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/management/swaps"
                                  className="flex items-center p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                                >
                                  <Users className="h-4 w-4 mr-2 text-blue-400" />
                                  <span>Swap Requests</span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                  
                  <ChevronRight className="h-4 w-4 text-white/60" />
                  
                  {pathSegments[1] === 'bids' && (
                    <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">Open Bids</span>
                  )}
                  
                  {pathSegments[1] === 'swaps' && (
                    <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">Swap Requests</span>
                  )}
                </>
              )}
              
              {pathSegments[0] === 'insights' && (
                <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">Insights</span>
              )}
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200">
            <Search className="h-5 w-5 text-white/80 hover:text-white" />
          </button>
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 relative">
            <Bell className="h-5 w-5 text-white/80 hover:text-white" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-purple-500 rounded-full animate-pulse-glow"></span>
          </button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-1 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-md border border-white/10">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-white/50">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={logout} className="hover:bg-white/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200">
              <User className="h-5 w-5 text-white/80 hover:text-white" />
            </Link>
          )}
          
          <button 
            className="ml-2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5 text-white/80 hover:text-white" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 md:hidden animate-fade-in">
          <div className="p-4 space-y-3">
            <Link 
              to="/dashboard"
              className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <LayoutDashboard className="h-5 w-5 mr-2 text-white/60" />
                <span>Dashboard</span>
              </div>
            </Link>
            
            <div className="border-t border-white/10 pt-3">
              <p className="text-xs text-white/40 uppercase mb-2 px-2">Rostering</p>
              <Link 
                to="/rostering/templates"
                className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-400" />
                  <span>Templates</span>
                </div>
              </Link>
              <Link 
                to="/rostering/rosters"
                className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  <span>Rosters</span>
                </div>
              </Link>
              <Link 
                to="/rostering/timesheets"
                className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-400" />
                  <span>Timesheets</span>
                </div>
              </Link>
              <Link 
                to="/rostering/schedule"
                className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-yellow-400" />
                  <span>Schedule</span>
                </div>
              </Link>
            </div>
            
            <div className="border-t border-white/10 pt-3">
              <p className="text-xs text-white/40 uppercase mb-2 px-2">Management</p>
              <Link 
                to="/management/bids"
                className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-purple-400" />
                  <span>Open Bids</span>
                </div>
              </Link>
              <Link 
                to="/management/swaps"
                className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  <span>Swap Requests</span>
                </div>
              </Link>
            </div>
            
            <div className="border-t border-white/10 pt-3">
              <Link 
                to="/insights"
                className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  <span>Insights</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
