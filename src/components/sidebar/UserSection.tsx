
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, HelpCircle, Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BroadcastNotifications } from '../broadcast/BroadcastNotifications';
import ThemeToggle from './ThemeToggle';
import UserProfile from './UserProfile';

interface UserSectionProps {
  user: any;
  isCollapsed: boolean;
  theme: 'dark' | 'light' | 'glass';
  handleThemeChange: (theme: 'dark' | 'light' | 'glass') => void;
  handleLogout: () => void;
}

const UserSection: React.FC<UserSectionProps> = ({ 
  user, 
  isCollapsed, 
  theme, 
  handleThemeChange, 
  handleLogout 
}) => {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Handle keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  if (!user) return null;
  
  return (
    <div className="p-4 border-t border-border space-y-4">
      {/* Enhanced Search Bar */}
      <div 
        className={cn(
          "relative flex items-center transition-all duration-300 ease-in-out rounded-lg",
          isSearchFocused ? "bg-muted ring-2 ring-primary/20" : "bg-muted/30",
          isCollapsed ? "hidden" : ""
        )}
      >
        <Search className="h-4 w-4 ml-3 text-muted-foreground" />
        <Input 
          id="search-input"
          type="search" 
          placeholder="Search... (Ctrl+K)"
          className="bg-transparent border-none pl-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    navigate('/search');
                    document.getElementById('search-input')?.focus();
                  }} 
                  className="rounded-full hover:bg-muted/50 transition-transform duration-200 hover:scale-105"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Search (Ctrl+K)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
        
        <ThemeToggle isCollapsed={isCollapsed} theme={theme} handleThemeChange={handleThemeChange} />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="transition-transform duration-200 hover:scale-105">
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
      
      {/* Improved Help & Support Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "w-full flex items-center justify-center gap-2 transition-all duration-200 hover:bg-accent/50", 
                isCollapsed && "px-2"
              )}
            >
              <HelpCircle className="h-4 w-4 text-primary" />
              {!isCollapsed && (
                <span className="flex items-center gap-1">
                  <span>Help & Support</span>
                  <span className="text-xs text-muted-foreground bg-muted/50 px-1 rounded">?</span>
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isCollapsed ? "right" : "top"} className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">Need assistance?</p>
              <p className="text-xs">Access documentation, FAQs or contact support</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default UserSection;
