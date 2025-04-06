
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Menu,
  UserCircle,
  LogOut,
  Settings,
  Calendar,
  User,
  Building,
  Bell,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-lg sm:text-xl font-bold flex items-center">
              <Building className="mr-2 h-6 w-6 text-purple-400" />
              Shift Bidding
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/shifts" 
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Shifts
              </Link>
              <Link 
                to="/bids" 
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                My Bids
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center">
            {/* Notification Icon */}
            <Button variant="ghost" size="icon" className="relative mr-2">
              <Bell size={20} />
              <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
            </Button>
            
            {/* User Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <UserCircle className="h-5 w-5 text-white/80" />
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.email || 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.email || 'User'}</p>
                  <p className="text-xs text-white/60">Employee</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>My Schedule</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Main menu"
              aria-expanded="false"
            >
              {mobileMenuOpen ? <ChevronUp size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/shifts" 
              className="text-white/70 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shifts
            </Link>
            <Link 
              to="/bids" 
              className="text-white/70 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Bids
            </Link>
            <div className="pt-4 pb-3 border-t border-white/10">
              <div className="px-3 space-y-1">
                <div 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="inline-block mr-2 h-5 w-5" />
                  Profile
                </div>
                <div 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="inline-block mr-2 h-5 w-5" />
                  Settings
                </div>
                <div 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-white hover:bg-white/5"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="inline-block mr-2 h-5 w-5" />
                  Sign out
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
