
import React from 'react';
import { ChevronRight, Home, Menu, Bell, Search, User } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full h-16 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg flex items-center px-8 sticky top-0 z-50">
      <div className="animate-fade-in flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-white/90">
          <a href="#" className="p-2 hover:bg-white/5 rounded-full transition-all duration-200 hover:text-white">
            <Home className="h-5 w-5" />
          </a>
          <ChevronRight className="h-4 w-4 text-white/60" />
          <a href="#" className="transition-all duration-200 hover:text-white px-2 py-1 hover:bg-white/5 rounded-md">Dashboard</a>
          <ChevronRight className="h-4 w-4 text-white/60" />
          <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">Create Template</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200">
            <Search className="h-5 w-5 text-white/80 hover:text-white" />
          </button>
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 relative">
            <Bell className="h-5 w-5 text-white/80 hover:text-white" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-purple-500 rounded-full animate-pulse-glow"></span>
          </button>
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200">
            <User className="h-5 w-5 text-white/80 hover:text-white" />
          </button>
          <button className="ml-2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 md:hidden">
            <Menu className="h-5 w-5 text-white/80 hover:text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
