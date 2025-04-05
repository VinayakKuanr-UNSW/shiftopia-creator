
import { ReactNode } from 'react';

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  indent?: boolean;
}

export interface NavSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  collapsed: boolean;
}

export interface ThemeToggleProps {
  isCollapsed: boolean;
  theme: 'dark' | 'light' | 'glass';
  handleThemeChange: (theme: 'dark' | 'light' | 'glass') => void;
}

export interface UserProfileProps {
  user: any;
  isCollapsed: boolean;
  handleLogout: () => void;
}
