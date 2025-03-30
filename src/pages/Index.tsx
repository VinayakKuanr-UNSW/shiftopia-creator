
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Users, ArrowRight, Shield, BarChart } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
      <header className="w-full bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 px-6 md:px-8 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-white via-white to-white/70 text-transparent bg-clip-text flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-400" />
            Workforce Management
          </div>
          <div>
            <Button asChild variant="outline" className="bg-white/5 mr-2 border-white/10 hover:bg-white/10 hover:text-white">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter bg-gradient-to-r from-white via-white to-white/70 text-transparent bg-clip-text leading-tight">
            Intelligent Workforce Management
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Streamline your team scheduling, roster management, and timesheet tracking with our comprehensive platform.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group">
              <Link to="/login" className="flex items-center">
                Get Started 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <FeatureCard 
            icon={<Calendar className="h-10 w-10 text-blue-400" />}
            title="Smart Scheduling"
            description="Create and manage schedules with our intuitive drag-and-drop interface."
          />
          <FeatureCard 
            icon={<Users className="h-10 w-10 text-green-400" />}
            title="Team Management"
            description="Assign roles, track availability, and manage team members efficiently."
          />
          <FeatureCard 
            icon={<Clock className="h-10 w-10 text-purple-400" />}
            title="Time Tracking"
            description="Accurate time tracking and timesheet management for your workforce."
          />
          <FeatureCard 
            icon={<BarChart className="h-10 w-10 text-red-400" />}
            title="Custom Reporting"
            description="Generate insightful reports to optimize your workforce management."
          />
        </div>
        
        <div className="bg-gradient-to-br from-black/40 to-black/20 border border-white/10 rounded-xl shadow-2xl p-8 mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4 tracking-tight text-white">Role-Based Access Control</h2>
              <p className="text-white/70 mb-6">
                Our platform offers customized access levels for different team members:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-900/30 p-1 rounded-full mr-2 mt-0.5">
                    <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-blue-300">Administrators</span>
                    <p className="text-white/60 text-sm">Full system access and control with comprehensive management capabilities.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-900/30 p-1 rounded-full mr-2 mt-0.5">
                    <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-green-300">Managers</span>
                    <p className="text-white/60 text-sm">Create, update, and manage schedules, rosters, and timesheets.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-900/30 p-1 rounded-full mr-2 mt-0.5">
                    <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-purple-300">Team Leaders</span>
                    <p className="text-white/60 text-sm">View team schedules and basic reports with limited editing capabilities.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="inline-block bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 p-3 rounded-full mb-2">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium">Department-Specific Dashboards</h3>
              </div>
              <p className="text-white/70 mb-4 text-center">
                Each department has a tailored dashboard showing relevant metrics and information:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-3 text-center transform hover:scale-105 transition-transform duration-300">
                  <h4 className="font-medium text-blue-300 mb-1">Convention</h4>
                  <p className="text-xs text-white/60">Event staffing and management</p>
                </div>
                <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-3 text-center transform hover:scale-105 transition-transform duration-300">
                  <h4 className="font-medium text-green-300 mb-1">Exhibition</h4>
                  <p className="text-xs text-white/60">Gallery operations</p>
                </div>
                <div className="bg-red-900/30 border border-red-500/20 rounded-lg p-3 text-center transform hover:scale-105 transition-transform duration-300">
                  <h4 className="font-medium text-red-300 mb-1">Theatre</h4>
                  <p className="text-xs text-white/60">Performance scheduling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to streamline your workforce management?</h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations that use our platform to optimize their scheduling and workforce management.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group">
            <Link to="/login" className="flex items-center">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </main>
      
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Workforce Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:border-white/20">
      <div className="inline-flex p-3 rounded-full bg-white/5 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/60">{description}</p>
    </div>
  );
};

export default Index;
