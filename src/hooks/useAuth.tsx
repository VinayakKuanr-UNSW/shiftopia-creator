
import { useContext } from 'react';
import { AuthContext, ExtendedUser } from '@/contexts/AuthContext';

export interface AuthHook {
  user: ExtendedUser | null;
  session: any;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isEligibleForShift: (shiftDepartment: string, shiftRole: string) => boolean;
  checkWorkHourCompliance: (shiftDate?: string, shiftHours?: number) => any;
  hasPermission: (feature: string) => boolean;
}

export const useAuth = (): AuthHook => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Check if the user is eligible for a specific shift
  const isEligibleForShift = (shiftDepartment: string, shiftRole: string) => {
    if (!context.user) return false;
    
    // Simple eligibility check based on department and role
    // In a real app, this would be more sophisticated and check tier, availability, etc.
    const userDepartment = context.user.department || '';
    const userRole = context.user.role || '';
    
    // Admin can bid on any shift
    if (userRole === 'admin') return true;
    
    // Manager can bid on shifts in their department
    if (userRole === 'manager' && userDepartment === shiftDepartment.toLowerCase()) return true;
    
    // Team lead can only bid on specific roles in their department
    if (userRole === 'teamlead' && userDepartment === shiftDepartment.toLowerCase()) {
      // Add logic for which roles a team lead can bid on
      return true;
    }
    
    return false;
  };
  
  // Check compliance with maximum work hours
  const checkWorkHourCompliance = (shiftDate?: string, shiftHours: number = 0) => {
    // In a real app, this would check against the database for existing shifts
    // and calculate total hours to ensure compliance with daily and monthly limits
    return {
      compliant: true,
      dailyHours: shiftHours,
      weeklyHours: shiftHours * 5, // Example calculation
      monthlyHours: shiftHours * 20, // Example calculation
      dailyLimit: 12,
      weeklyLimit: 48,
      monthlyLimit: 152
    };
  };

  return context;
};
