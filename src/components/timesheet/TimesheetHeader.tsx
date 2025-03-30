
import React from 'react';
import { Calendar, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TimesheetHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const TimesheetHeader: React.FC<TimesheetHeaderProps> = ({
  selectedDate,
  onDateChange
}) => {
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    onDateChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    onDateChange(newDate);
  };

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Timesheets</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="bg-black/30 border border-white/10 rounded-md pl-10 pr-4 py-2 text-sm w-full"
            />
          </div>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between bg-black/20 p-3 rounded-md border border-white/10">
        <button 
          onClick={goToPreviousWeek}
          className="bg-black/30 hover:bg-black/50 border border-white/10 p-2 rounded-md transition-colors"
        >
          <span className="sr-only">Previous week</span>
          &larr;
        </button>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-white/70" />
          <span className="font-medium">
            {format(startOfWeek, 'MMM d')} - {format(endOfWeek, 'MMM d, yyyy')}
          </span>
        </div>
        
        <button 
          onClick={goToNextWeek}
          className="bg-black/30 hover:bg-black/50 border border-white/10 p-2 rounded-md transition-colors"
        >
          <span className="sr-only">Next week</span>
          &rarr;
        </button>
      </div>
    </div>
  );
};
