
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSidebar } from '@/components/ui/sidebar';

interface LogoSectionProps {
  isCollapsed: boolean;
}

const LogoSection: React.FC<LogoSectionProps> = ({ isCollapsed }) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-3">
        {!isCollapsed && (
          <span className="text-xl font-semibold transition-opacity">
            ShiftoPia
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="rounded-full"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default LogoSection;
