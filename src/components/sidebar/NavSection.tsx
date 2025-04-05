
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavSectionProps } from './types';

const NavSection: React.FC<NavSectionProps> = ({ title, isOpen, onToggle, children, collapsed }) => {
  return (
    <div className="mb-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={cn(
                "flex items-center w-full px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors",
                collapsed ? "justify-center" : "justify-between"
              )}
            >
              {!collapsed && <span className="text-sm font-medium">{title}</span>}
              {!collapsed ? (
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform", 
                    isOpen && "transform rotate-180"
                  )} 
                />
              ) : (
                <ChevronRight className="h-4 w-4" />
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
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default NavSection;
