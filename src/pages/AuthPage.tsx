
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (isSignUp) {
        result = await signUp(email, password, {
          // Add additional user data as needed
          name: email.split('@')[0],
          role: 'employee',
          department: 'General'
        });
        
        if (result.success) {
          toast({
            title: "Account created",
            description: "Your account has been successfully created. You can now sign in.",
          });
          setIsSignUp(false);
        } else {
          toast({
            title: "Registration failed",
            description: result.error || "Failed to create account. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        result = await signIn(email, password);
        
        if (result.success) {
          toast({
            title: "Login successful",
            description: "You have successfully logged in.",
          });
          navigate('/');
        } else {
          toast({
            title: "Login failed",
            description: result.error || "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black/95 bg-gradient-to-br from-purple-900/20 to-black">
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <Building className="h-12 w-12 text-purple-400" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-white">
              Shift Bidding System
            </h2>
            <p className="mt-2 text-white/70">
              {isSignUp ? "Create your account" : "Sign in to your account"}
            </p>
          </div>
          
          <div className="bg-white/5 p-8 rounded-lg backdrop-blur-sm border border-white/10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/40" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 bg-white/10 border-white/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/40" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    className="pl-10 bg-white/10 border-white/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : isSignUp ? (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <Button
                variant="link"
                className="w-full text-white/70 hover:text-white"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-4 text-center text-white/50 text-sm">
        &copy; {new Date().getFullYear()} Shift Bidding System. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthPage;
