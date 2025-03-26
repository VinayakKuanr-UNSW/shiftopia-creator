
import React from 'react';
import { ChevronRight } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full h-16 backdrop-blur-md bg-black/30 border-b border-white/10 flex items-center px-8">
      <div className="animate-fade-in flex items-center space-x-2 text-white/90">
        <a href="#" className="transition-all duration-200 hover:text-white">Dashboard</a>
        <ChevronRight className="h-4 w-4 text-white/60" />
        <span className="font-medium">Create Template</span>
      </div>
    </nav>
  );
};

export default Navbar;
