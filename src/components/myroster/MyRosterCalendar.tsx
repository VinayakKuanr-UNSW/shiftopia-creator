
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, startOfMonth, endOfMonth, getDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { CalendarView } from '@/hooks/useRosterView';
import { Shift } from '@/api/models/types';
import { useQuery } from '@tanstack/react-query';
import MyRosterShift from './MyRosterShift';
import { rosterService } from '@/api/services/rosterService';

interface MyRosterCalendarProps {
  view: CalendarView;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const MyRosterCalendar: React.FC<MyRosterCalendarProps> = ({ view, selectedDate, onDateChange }) => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<Date[]>([]);
  
  // Calculate the date range based on the view
  useEffect(() => {
    if (view === 'day') {
      setDateRange([selectedDate]);
    } else if (view === '3day') {
      setDateRange([
        selectedDate,
        addDays(selectedDate, 1),
        addDays(selectedDate, 2)
      ]);
    } else if (view === 'week') {
      const start = startOfWeek(selectedDate);
      setDateRange(eachDayOfInterval({ start, end: endOfWeek(selectedDate) }));
    } else if (view === 'month') {
      const start = startOfMonth(selectedDate);
      setDateRange(eachDayOfInterval({ start, end: endOfMonth(selectedDate) }));
    }
  }, [selectedDate, view]);
  
  // Fetch shifts for the date range
  const { data: rosters, isLoading } = useQuery({
    queryKey: ['myRosters', dateRange.map(d => format(d, 'yyyy-MM-dd')), user?.id],
    queryFn: async () => {
      if (dateRange.length === 0) return [];
      
      const startDate = format(dateRange[0], 'yyyy-MM-dd');
      const endDate = format(dateRange[dateRange.length - 1], 'yyyy-MM-dd');
      
      const rostersData = await rosterService.getRostersByDateRange(startDate, endDate);
      return rostersData;
    },
    enabled: !!user && dateRange.length > 0
  });
  
  // Get shifts for a specific user
  const getMyShiftsForDate = (date: Date) => {
    if (!rosters || !user) return [];
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const roster = rosters.find(r => r.date.split('T')[0] === dateStr);
    
    if (!roster) return [];
    
    const myShifts: Array<{
      shift: Shift,
      groupName: string,
      groupColor: string,
      subGroupName: string
    }> = [];
    
    roster.groups.forEach(group => {
      group.subGroups.forEach(subGroup => {
        subGroup.shifts.forEach(shift => {
          if (shift.employeeId === user.id) {
            myShifts.push({
              shift,
              groupName: group.name,
              groupColor: group.color,
              subGroupName: subGroup.name
            });
          }
        });
      });
    });
    
    return myShifts;
  };
  
  const handlePrevious = () => {
    if (view === 'day') {
      onDateChange(addDays(selectedDate, -1));
    } else if (view === '3day') {
      onDateChange(addDays(selectedDate, -3));
    } else if (view === 'week') {
      onDateChange(addDays(selectedDate, -7));
    } else if (view === 'month') {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() - 1);
      onDateChange(newDate);
    }
  };
  
  const handleNext = () => {
    if (view === 'day') {
      onDateChange(addDays(selectedDate, 1));
    } else if (view === '3day') {
      onDateChange(addDays(selectedDate, 3));
    } else if (view === 'week') {
      onDateChange(addDays(selectedDate, 7));
    } else if (view === 'month') {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + 1);
      onDateChange(newDate);
    }
  };
  
  const getDateRangeText = () => {
    if (view === 'day') {
      return format(selectedDate, 'EEEE, MMMM d, yyyy');
    } else if (view === '3day') {
      const endDate = addDays(selectedDate, 2);
      return `${format(selectedDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    } else if (view === 'week') {
      const start = startOfWeek(selectedDate);
      const end = endOfWeek(selectedDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else if (view === 'month') {
      return format(selectedDate, 'MMMM yyyy');
    }
    return '';
  };
  
  // Rendering the calendar based on the view
  const renderCalendar = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      );
    }
    
    if (view === 'day') {
      return (
        <div className="bg-black/20 rounded-lg border border-white/10 p-4">
          <h3 className="text-lg font-medium text-white mb-3">
            {format(selectedDate, 'EEEE, MMMM d')}
            {isToday(selectedDate) && <span className="ml-2 text-sm bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded">Today</span>}
          </h3>
          <div className="space-y-2">
            {getMyShiftsForDate(selectedDate).length > 0 ? (
              getMyShiftsForDate(selectedDate).map((shiftData, idx) => (
                <MyRosterShift
                  key={`${shiftData.shift.id}-${idx}`}
                  shift={shiftData.shift}
                  groupName={shiftData.groupName}
                  groupColor={shiftData.groupColor}
                  subGroupName={shiftData.subGroupName}
                />
              ))
            ) : (
              <p className="text-white/60 text-center py-10">No shifts scheduled for this day</p>
            )}
          </div>
        </div>
      );
    } else if (view === '3day' || view === 'week') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {dateRange.map((date) => (
            <div
              key={date.toString()}
              className={`bg-black/20 rounded-lg border ${
                isToday(date) ? 'border-blue-500/50' : 'border-white/10'
              } p-3 h-full`}
            >
              <h3 className={`text-sm font-medium ${isToday(date) ? 'text-blue-300' : 'text-white/80'} mb-2`}>
                {format(date, 'EEE, MMM d')}
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {getMyShiftsForDate(date).length > 0 ? (
                  getMyShiftsForDate(date).map((shiftData, idx) => (
                    <MyRosterShift
                      key={`${shiftData.shift.id}-${idx}`}
                      shift={shiftData.shift}
                      groupName={shiftData.groupName}
                      groupColor={shiftData.groupColor}
                      subGroupName={shiftData.subGroupName}
                      compact
                    />
                  ))
                ) : (
                  <p className="text-white/40 text-xs text-center py-4">No shifts</p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (view === 'month') {
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      
      const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
      
      // Calculate the grid layout
      const rows = Math.ceil(dateRange.length / 7);
      
      return (
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-white/60 text-xs p-1 border-b border-white/10">
              {day}
            </div>
          ))}
          
          {dateRange.map((date, i) => {
            const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
            const dayShifts = getMyShiftsForDate(date);
            
            return (
              <div
                key={date.toString()}
                className={`min-h-[100px] p-1 ${
                  isCurrentMonth 
                    ? 'bg-black/20' 
                    : 'bg-black/10'
                } ${
                  isToday(date) 
                    ? 'border border-blue-500/50' 
                    : 'border border-white/5'
                } overflow-hidden`}
              >
                <div className="text-right">
                  <span 
                    className={`text-xs inline-block rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday(date) 
                        ? 'bg-blue-500 text-white' 
                        : isCurrentMonth 
                          ? 'text-white/80' 
                          : 'text-white/40'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </div>
                
                <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                  {dayShifts.map((shiftData, idx) => (
                    <div 
                      key={`${shiftData.shift.id}-${idx}`}
                      className={`text-[9px] p-1 truncate rounded ${
                        shiftData.groupColor === 'blue' 
                          ? 'bg-blue-500/20 text-blue-100' 
                          : shiftData.groupColor === 'green' 
                            ? 'bg-green-500/20 text-green-100' 
                            : shiftData.groupColor === 'red' 
                              ? 'bg-red-500/20 text-red-100' 
                              : 'bg-purple-500/20 text-purple-100'
                      }`}
                    >
                      {shiftData.shift.startTime.split(':').slice(0, 2).join(':')} - {shiftData.shift.role}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="icon"
          className="bg-white/5 border-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[240px] justify-start text-left font-normal bg-white/5 border-white/10"
            >
              {getDateRangeText()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-900/95 backdrop-blur-xl border-gray-800">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <Button
          onClick={handleNext}
          variant="outline"
          size="icon"
          className="bg-white/5 border-white/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {renderCalendar()}
    </div>
  );
};

export default MyRosterCalendar;
