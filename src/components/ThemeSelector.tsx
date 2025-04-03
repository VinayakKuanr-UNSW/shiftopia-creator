
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Monitor, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const handleThemeChange = (newTheme: 'dark' | 'light' | 'default' | 'glass' | 'system') => {
    setTheme(newTheme);
    
    const themeNames = {
      default: 'Default',
      glass: 'Glass',
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    };
    
    toast({
      title: `Theme Changed`,
      description: `${themeNames[newTheme]} theme applied successfully.`,
      duration: 2000,
    });
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-5 w-5" />;
      case 'dark': return <Moon className="h-5 w-5" />;
      case 'default': return <Monitor className="h-5 w-5" />;
      case 'glass': return <Sparkles className="h-5 w-5" />;
      case 'system': return <Monitor className="h-5 w-5" />;
      default: return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Select theme">
                {getThemeIcon()}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Theme Settings
          </TooltipContent>
          <DropdownMenuContent align="end" className="w-40 bg-popover border border-border">
            <DropdownMenuItem 
              className={`flex items-center gap-2 cursor-pointer ${theme === 'default' ? 'bg-accent/50' : ''}`}
              onClick={() => handleThemeChange('default')}
            >
              <Monitor className="h-4 w-4" />
              <span>Default</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={`flex items-center gap-2 cursor-pointer ${theme === 'glass' ? 'bg-accent/50' : ''}`}
              onClick={() => handleThemeChange('glass')}
            >
              <Sparkles className="h-4 w-4" />
              <span>Glass</span>
            </DropdownMenuItem>
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
              className={`flex items-center gap-2 cursor-pointer ${theme === 'system' ? 'bg-accent/50' : ''}`}
              onClick={() => handleThemeChange('system')}
            >
              <Monitor className="h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
};
