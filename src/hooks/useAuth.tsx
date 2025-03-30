
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Check if the user is eligible to bid for a specific shift
  const isEligibleForShift = (shiftDepartment: string, shiftRole: string) => {
    if (!context.user) return false;
    
    // Simple eligibility check based on department and role
    // In a real app, this would be more sophisticated and check tier, availability, etc.
    const userDepartment = context.user.department;
    const userRole = context.user.role;
    
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
  const checkWorkHourCompliance = (shiftDate: string, shiftHours: number) => {
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
  
  return { 
    ...context, 
    isEligibleForShift,
    checkWorkHourCompliance
  };
};
