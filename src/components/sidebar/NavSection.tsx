
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, FolderKanban, UserCircle2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavSectionProps } from './types';

const NavSection: React.FC<NavSectionProps> = ({ 
  title, 
  isOpen, 
  onToggle, 
  children, 
  collapsed, 
  sectionColor = "primary" 
}) => {
  const colorClass = sectionColor === "primary" ? "text-primary" : `text-${sectionColor}-400`;
  
  // Get section icon based on title
  const getSectionIcon = () => {
    switch (title.toLowerCase()) {
      case "my workspace":
        return <UserCircle2 className={cn("h-5 w-5", colorClass)} />;
      case "rostering":
        return <FolderKanban className={cn("h-5 w-5", colorClass)} />;
      case "management":
        return <Shield className={cn("h-5 w-5", colorClass)} />;
      default:
        return <FolderKanban className={cn("h-5 w-5", colorClass)} />;
    }
  };
  
  return (
    <div className="mb-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={cn(
                "flex items-center w-full px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors",
                collapsed ? "justify-center" : "justify-between",
                "mt-4 first:mt-0" // Add spacing between sections
              )}
            >
              {collapsed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  {getSectionIcon()}
                  <motion.div 
                    className={cn(
                      "absolute -top-1 -right-1 h-2 w-2 rounded-full",
                      isOpen ? "bg-primary" : "bg-transparent"
                    )} 
                  />
                </motion.div>
              ) : (
                <>
                  <span className="text-sm font-medium uppercase tracking-wider text-xs text-muted-foreground">
                    {title}
                  </span>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform", 
                      isOpen && "transform rotate-180",
                      colorClass
                    )} 
                  />
                </>
              )}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">{title}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
      
      {!collapsed && isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="border-l border-border ml-3 pl-2" // Add vertical border for visual grouping
        >
          {children}
        </motion.div>
      )}
      
      {/* Show collapsed items when sidebar is collapsed but section is open */}
      {collapsed && isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-1 mt-1"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default NavSection;
