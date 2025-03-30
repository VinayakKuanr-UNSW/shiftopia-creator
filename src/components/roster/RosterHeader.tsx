import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Filter, PanelRight, Search, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface RosterHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onApplyTemplate: () => void;
  onSaveRoster: () => void;
}

export const RosterHeader: React.FC<RosterHeaderProps> = ({ 
  sidebarOpen, 
  toggleSidebar, 
  selectedDate,
  onDateChange,
  onApplyTemplate,
  onSaveRoster
}) => {
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onDateChange(newDate);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Users className="mr-2 text-purple-400" size={24} />
          Roster Management
        </h1>
        
        <div className="flex space-x-2">
          <Button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200">
            <Search className="h-5 w-5 text-white/80 hover:text-white" />
          </Button>
          <Button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200">
            <Filter className="h-5 w-5 text-white/80 hover:text-white" />
          </Button>
          <Button 
            className={`p-2 rounded-full transition-all duration-200 ${
              sidebarOpen ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
            }`} 
            onClick={toggleSidebar}
          >
            <PanelRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handlePrevDay}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-white/80 hover:text-white" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex items-center space-x-2 px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-all duration-200">
                <Calendar className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-white">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-black/80 backdrop-blur-md border border-white/10">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleNextDay}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5 text-white/80 hover:text-white" />
          </Button>
        </div>
        
        <div className="flex mt-2 md:mt-0 space-x-2">
          <Button 
            onClick={onApplyTemplate}
            className="button-outline"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Apply Template
          </Button>
          <Button 
            onClick={onSaveRoster}
            className="button-blue"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Save Roster
          </Button>
        </div>
      </div>
    </div>
  );
};