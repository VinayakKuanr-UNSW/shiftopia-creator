
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import LogoSection from './sidebar/LogoSection';
import NavigationLinks from './sidebar/NavigationLinks';
import UserSection from './sidebar/UserSection';

const UnifiedSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({
    workspace: true, // Default open for better UX
    rostering: false,
    management: false
  });
  
  const isCollapsed = state === "collapsed";
  
  const toggleMenu = (menu: string) => {
    if (isCollapsed) {
      // In collapsed state, just toggle the current menu and close others
      setOpenMenus(prev => {
        const newState = { ...prev };
        // Close all other menus
        Object.keys(newState).forEach(key => {
          if (key !== menu) newState[key] = false;
        });
        // Toggle the current menu
        newState[menu] = !prev[menu];
        return newState;
      });
    } else {
      // In expanded state, just toggle the menu
      setOpenMenus(prev => ({
        ...prev,
        [menu]: !prev[menu]
      }));
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const handleThemeChange = (newTheme: 'dark' | 'light' | 'glass') => {
    setTheme(newTheme);
  };

  return (
    <motion.div
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col bg-background border-r border-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-[250px]"
      )}
      initial={false}
      animate={{ width: isCollapsed ? 70 : 250 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
    >
      <LogoSection isCollapsed={isCollapsed} />
      <NavigationLinks openMenus={openMenus} toggleMenu={toggleMenu} />
      <UserSection 
        user={user} 
        isCollapsed={isCollapsed}
        theme={theme}
        handleThemeChange={handleThemeChange}
        handleLogout={handleLogout}
      />
    </motion.div>
  );
};

export default UnifiedSidebar;
