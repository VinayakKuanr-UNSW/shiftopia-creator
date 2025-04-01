
import React, { useState } from 'react';
import { Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { addDays, addWeeks, format, subWeeks } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface BirdsViewHeaderProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (start: Date, end: Date) => void;
  onSearch: (query: string) => void;
}

export const BirdsViewHeader: React.FC<BirdsViewHeaderProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const { hasPermission } = useAuth();
  
  const formattedStartDate = format(startDate, 'MMM d, yyyy');
  const formattedEndDate = format(endDate, 'MMM d, yyyy');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };
  
  const handlePreviousWeek = () => {
    const newStartDate = subWeeks(startDate, 1);
    const newEndDate = subWeeks(endDate, 1);
    onDateRangeChange(newStartDate, newEndDate);
  };
  
  const handleNextWeek = () => {
    const newStartDate = addWeeks(startDate, 1);
    const newEndDate = addWeeks(endDate, 1);
    onDateRangeChange(newStartDate, newEndDate);
  };
  
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      // If new start date is after end date, adjust end date
      const newEndDate = date > endDate ? addDays(date, 6) : endDate;
      onDateRangeChange(date, newEndDate);
      setIsStartDateOpen(false);
    }
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      // If new end date is before start date, adjust start date
      const newStartDate = date < startDate ? date : startDate;
      onDateRangeChange(newStartDate, date);
      setIsEndDateOpen(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Birds-view</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
            <Input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 w-full md:w-auto min-w-[200px] bg-white/5 border-white/10"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousWeek}
            className="h-8 w-8 bg-white/5 border-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/5 border-white/10"
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formattedStartDate}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-900/95 backdrop-blur-xl border-gray-800">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <span className="text-white/70">to</span>
          
          <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/5 border-white/10"
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formattedEndDate}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-900/95 backdrop-blur-xl border-gray-800">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextWeek}
            className="h-8 w-8 bg-white/5 border-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="default"
            size="sm"
            onClick={() => {
              const today = new Date();
              const start = subWeeks(today, 0);
              const end = addDays(start, 6);
              onDateRangeChange(start, end);
            }}
          >
            This Week
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const start = addWeeks(today, 1);
              const end = addDays(start, 6);
              onDateRangeChange(start, end);
            }}
            className="bg-white/5 border-white/10"
          >
            Next Week
          </Button>
        </div>
      </div>
    </div>
  );
};
