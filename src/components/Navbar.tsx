
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from '@/components/ThemeSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from '@/components/ui/sidebar';
import { NavBreadcrumb } from '@/components/NavBreadcrumb';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut 
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
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, []);

  return (
    <nav className="w-full h-16 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg flex items-center px-4 md:px-8 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full gap-2">
        {/* Left section with menu and breadcrumb */}
        <div className="flex items-center space-x-2 text-white/90">
          <SidebarTrigger className="text-white/80 hover:text-white" />
  
          <div className="hidden md:flex items-center">
            <NavBreadcrumb />
          </div>
        </div>
        
        {/* Right section with search, notifications, theme toggle and profile */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
            <Search className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-purple-500 rounded-full text-xs flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
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
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Breadcrumb - Only show on small screens */}
      <div className="md:hidden px-4 py-2 bg-background/50 backdrop-blur-sm border-b border-border/40 absolute top-16 left-0 right-0">
        <NavBreadcrumb />
      </div>
    </nav>
  );
};

export default Navbar;
