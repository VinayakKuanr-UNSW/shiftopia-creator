
import React from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggleProps } from './types';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isCollapsed, theme, handleThemeChange }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {theme === 'light' ? <Sun className="h-5 w-5" /> : 
                 theme === 'dark' ? <Moon className="h-5 w-5" /> : 
                 <Sparkles className="h-5 w-5" />}
              </Button>
            </DropdownMenuTrigger>
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
        </TooltipTrigger>
        <TooltipContent side={isCollapsed ? "right" : "top"}>Theme Settings</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
