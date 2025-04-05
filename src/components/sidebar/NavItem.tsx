
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavItemProps } from './types';

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

export default NavItem;
