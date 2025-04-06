
import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// Extended User type to include custom properties
export interface ExtendedUser extends User {
  name?: string;
  role?: 'admin' | 'manager' | 'teamlead' | 'member';
  department?: string;
  avatar?: string;
  email?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  isAuthenticated: boolean; // Boolean to quickly check if user is authenticated
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>; // Alias for signIn
  logout: () => Promise<void>; // Alias for signOut
  isEligibleForShift: (shiftDepartment: string, shiftRole: string) => boolean;
  checkWorkHourCompliance: () => boolean;
  hasPermission: (feature: string) => boolean; // Add hasPermission function
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  login: async () => {},
  logout: async () => {},
  isEligibleForShift: () => false,
  checkWorkHourCompliance: () => false,
  hasPermission: () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        // If session exists, extend the user with custom properties
        if (session?.user) {
          const userData = session.user;
          
          // Extract user metadata and add it to user object
          const extendedUser: ExtendedUser = {
            ...userData,
            name: userData.user_metadata?.name || userData.email?.split('@')[0] || 'User',
            role: userData.user_metadata?.role || 'member',
            department: userData.user_metadata?.department || 'convention',
            avatar: userData.user_metadata?.avatar || '',
          };
          
          setUser(extendedUser);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      // If session exists, extend the user with custom properties
      if (session?.user) {
        const userData = session.user;
        
        // Extract user metadata and add it to user object
        const extendedUser: ExtendedUser = {
          ...userData,
          name: userData.user_metadata?.name || userData.email?.split('@')[0] || 'User',
          role: userData.user_metadata?.role || 'member',
          department: userData.user_metadata?.department || 'convention',
          avatar: userData.user_metadata?.avatar || '',
        };
        
        setUser(extendedUser);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (!result.success) {
      throw new Error(result.error || 'Login failed');
    }
  };

  const signUp = async (email: string, password: string, userData?: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const logout = signOut;

  // Check if the user is eligible for a specific shift
  const isEligibleForShift = (shiftDepartment: string, shiftRole: string) => {
    if (!user) return false;
    
    // Simple eligibility check based on department and role
    // In a real app, this would be more sophisticated and check tier, availability, etc.
    const userDepartment = user.department || '';
    const userRole = user.role || '';
    
    // Admin can bid on any shift
    if (userRole === 'admin') return true;
    
    // Manager can bid on shifts in their department
    if (userRole === 'manager' && userDepartment.toLowerCase() === shiftDepartment.toLowerCase()) return true;
    
    // Team lead can only bid on specific roles in their department
    if (userRole === 'teamlead' && userDepartment.toLowerCase() === shiftDepartment.toLowerCase()) {
      // Add logic for which roles a team lead can bid on
      return true;
    }
    
    return true; // For demo purposes, allow all shifts
  };

  // Check if the user complies with work hour restrictions
  const checkWorkHourCompliance = () => {
    // In a real app, this would check the user's currently assigned shifts
    // and verify that this new shift wouldn't cause a violation of work hour rules
    return true; // For demo purposes, always return true
  };

  // Check if the user has permission to access a specific feature
  const hasPermission = (feature: string): boolean => {
    if (!user) return false;
    
    const role = user.role || 'member';
    
    switch (feature) {
      case 'dashboard':
        return true; // All roles can access dashboard
        
      case 'my-roster':
      case 'availabilities':
      case 'bids':
        return true; // All roles can access these features
        
      case 'templates':
      case 'rosters':
      case 'birds-view':
        return role === 'admin' || role === 'manager'; // Only admin and manager
        
      case 'timesheet-edit':
        return role === 'admin' || role === 'manager'; // Only admin and manager can edit
        
      case 'timesheet-view':
        return role === 'admin' || role === 'manager' || role === 'teamlead'; // Admin, manager, teamlead can view
        
      case 'management':
        return role === 'admin' || role === 'manager'; // Only admin and manager
        
      case 'broadcast':
        // Making sure admin, manager, teamlead AND member can access broadcast
        // Members will have limited functionality, handled in the component
        return true;
        
      case 'insights':
        return role === 'admin' || role === 'manager'; // Only admin and manager
        
      case 'configurations':
        return role === 'admin'; // Only admin
        
      case 'update':
        return role === 'admin' || role === 'manager'; // Only admin and manager can update
        
      default:
        return role === 'admin'; // Default to admin-only for undefined features
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoading: loading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        login,
        logout,
        isEligibleForShift,
        checkWorkHourCompliance,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
