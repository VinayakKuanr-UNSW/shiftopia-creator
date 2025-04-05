
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, HelpCircle } from 'lucide-react';
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

export default UserSection;
