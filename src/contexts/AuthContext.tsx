
import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isEligibleForShift: (shiftDepartment: string, shiftRole: string) => boolean;
  checkWorkHourCompliance: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  isEligibleForShift: () => false,
  checkWorkHourCompliance: () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
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

  // Check if the user is eligible for a specific shift
  const isEligibleForShift = (shiftDepartment: string, shiftRole: string) => {
    if (!user) return false;
    
    // Simple eligibility check based on department and role
    // In a real app, this would be more sophisticated and check tier, availability, etc.
    const userDepartment = user.user_metadata?.department || '';
    const userRole = user.user_metadata?.role || '';
    
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isEligibleForShift,
        checkWorkHourCompliance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
