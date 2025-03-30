
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const handleThemeChange = (newTheme: 'default' | 'light' | 'dark') => {
    setTheme(newTheme);
    
    const themeNames = {
      default: 'Default',
      light: 'Light',
      dark: 'Dark'
    };
    
    toast({
      title: `Theme Changed`,
      description: `${themeNames[newTheme]} theme applied successfully.`,
      duration: 2000,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Select theme">
          {theme === 'light' && <Sun className="h-5 w-5" />}
          {theme === 'dark' && <Moon className="h-5 w-5" />}
          {theme === 'default' && <Monitor className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-popover border border-border">
        <DropdownMenuItem 
          className={`flex items-center gap-2 cursor-pointer ${theme === 'default' ? 'bg-accent/50' : ''}`}
          onClick={() => handleThemeChange('default')}
        >
          <Monitor className="h-4 w-4" />
          <span>Default</span>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
