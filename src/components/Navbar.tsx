import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from '@/components/ThemeSelector';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Home, 
  Menu, 
  Bell, 
  Search, 
  User, 
  Calendar, 
  Users, 
  Clock, 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  LogOut,
  Settings,
  ChevronRight
} from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'shift',
    message: 'Your shift starts in 1 hour',
    time: '1 hour ago',
    read: false
  },
  {
    id: 2,
    type: 'bid',
    message: 'Your bid for Evening Shift was approved',
    time: '2 hours ago',
    read: false
  },
  {
    id: 3,
    type: 'swap',
    message: 'New swap request from John Smith',
    time: '3 hours ago',
    read: true
  },
  {
    id: 4,
    type: 'system',
    message: 'System maintenance scheduled for tonight',
    time: '5 hours ago',
    read: true
  }
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, []);

  const getPathSegments = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments;
  };
  
  const pathSegments = getPathSegments();

  return (
    <nav className="w-full h-16 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg flex items-center px-4 md:px-8 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-white/90">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-gray-900/95 backdrop-blur-xl border-gray-800">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/myroster" 
                    className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    My Roster
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-all duration-200 hover:text-white">
            <Home className="h-5 w-5" />
          </Link>
          
          {pathSegments.length > 0 && (
            <>
              <ChevronRight className="h-4 w-4 text-white/60" />
              
              {pathSegments[0] === 'dashboard' && (
                <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">Dashboard</span>
              )}
              
              {pathSegments[0] === 'myroster' && (
                <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">My Roster</span>
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
                                  to="/myroster"
                                  className="flex items-center p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                                >
                                  <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
                                  <span>My Roster</span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
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
          <Button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200">
            <Search className="h-5 w-5 text-white/80 hover:text-white" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 relative">
                <Bell className="h-5 w-5 text-white/80 hover:text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-purple-500 rounded-full text-xs flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-popover border-border">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map(notification => (
                <DropdownMenuItem key={notification.id} className="flex items-start p-3 space-x-3 cursor-pointer">
                  <div className={`w-2 h-2 mt-2 rounded-full ${notification.read ? 'bg-gray-500' : 'bg-purple-500'}`} />
                  <div className="flex-1">
                    <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ThemeSelector />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center space-x-2 p-1 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <Link to="/profile">
                  <DropdownMenuItem className="hover:bg-accent cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/myroster">
                  <DropdownMenuItem className="hover:bg-accent cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Roster</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="hover:bg-accent cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={logout} className="hover:bg-accent cursor-pointer text-red-400">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
