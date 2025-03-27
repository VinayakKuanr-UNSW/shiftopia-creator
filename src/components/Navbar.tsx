
import React, { useState } from 'react';
import { ChevronRight, Home, Menu, Bell, Search, User, Calendar, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="w-full h-16 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg flex items-center px-8 sticky top-0 z-50">
      <div className="animate-fade-in flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-white/90">
          <Link to="/" className="p-2 hover:bg-white/5 rounded-full transition-all duration-200 hover:text-white">
            <Home className="h-5 w-5" />
          </Link>
          <ChevronRight className="h-4 w-4 text-white/60" />
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/5 text-white/90 hover:text-white">
                  Rostering
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-black/80 backdrop-blur-md border border-white/10">
                  <ul className="grid gap-3 p-4 w-[200px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/rostering/templates"
                          className="flex items-center p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                        >
                          <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                          <span>Templates</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/rostering/rosters"
                          className="flex items-center p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                        >
                          <Users className="h-4 w-4 mr-2 text-blue-400" />
                          <span>Rosters</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/rostering/timesheets"
                          className="flex items-center p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                        >
                          <Clock className="h-4 w-4 mr-2 text-green-400" />
                          <span>Timesheets</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/rostering/schedule"
                          className="flex items-center p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
                        >
                          <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                          <span>Schedule</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <ChevronRight className="h-4 w-4 text-white/60" />
          <span className="font-medium bg-white/5 px-3 py-1 rounded-md border border-white/10">Timesheets</span>
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
          <button 
            className="ml-2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5 text-white/80 hover:text-white" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 md:hidden animate-fade-in">
          <div className="p-4 space-y-3">
            <Link 
              to="/rostering/templates"
              className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                <span>Templates</span>
              </div>
            </Link>
            <Link 
              to="/rostering/rosters"
              className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                <span>Rosters</span>
              </div>
            </Link>
            <Link 
              to="/rostering/timesheets"
              className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-400" />
                <span>Timesheets</span>
              </div>
            </Link>
            <Link 
              to="/rostering/schedule"
              className="block w-full p-2 hover:bg-white/5 rounded-md transition-all duration-200 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-yellow-400" />
                <span>Schedule</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
