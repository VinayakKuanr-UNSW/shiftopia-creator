
import React from 'react';
import { format, isSameMonth, isToday, startOfWeek, endOfWeek, addDays, eachDayOfInterval, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { AvailabilityStatus } from '@/api/models/types';

interface AvailabilityCalendarProps {
  onSelectDate: (date: Date) => void;
}

export function AvailabilityCalendar({ onSelectDate }: AvailabilityCalendarProps) {
  const {
    selectedMonth,
    goToPreviousMonth,
    goToNextMonth,
    startOfMonth,
    endOfMonth,
    getDayStatusColor,
    getDayAvailability,
  } = useAvailabilities();

  const calendarDays = React.useMemo(() => {
    const firstDayOfMonth = startOfMonth;
    const start = startOfWeek(firstDayOfMonth);
    
    const lastDayOfMonth = endOfMonth;
    const end = endOfWeek(lastDayOfMonth);

    return eachDayOfInterval({ start, end });
  }, [startOfMonth, endOfMonth]);

  const calendarWeeks = React.useMemo(() => {
    const weeks = [];
    let week = [];

    for (const day of calendarDays) {
      week.push(day);
      
      if (getDay(day) === 6) {
        weeks.push([...week]);
        week = [];
      }
    }

    if (week.length > 0) {
      weeks.push(week);
    }

    return weeks;
  }, [calendarDays]);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-full flex flex-col overflow-auto p-4 md:p-6">
      <div className="bg-card border border-border rounded-lg overflow-hidden h-full">
        <div className="grid grid-cols-7 bg-muted">
          {weekdays.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 divide-x divide-y divide-border h-full">
          {calendarWeeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day) => {
                const availability = getDayAvailability(day);
                const isCurrentMonth = isSameMonth(day, selectedMonth);
                const isTodayDate = isToday(day);
                
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "h-24 md:h-32 p-1 hover:bg-muted/50 cursor-pointer transition-colors",
                      !isCurrentMonth && "opacity-40"
                    )}
                    onClick={() => onSelectDate(day)}
                  >
                    <div className="flex flex-col h-full">
                      <div 
                        className={cn(
                          "self-end w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1",
                          isTodayDate ? "bg-primary text-primary-foreground font-bold" : "text-foreground"
                        )}
                      >
                        {format(day, 'd')}
                      </div>
                      
                      {availability && (
                        <div 
                          className={cn(
                            "w-full grow mt-1 rounded-md",
                            getDayStatusColor(availability.status as AvailabilityStatus),
                            "flex items-center justify-center text-white text-xs font-medium"
                          )}
                        >
                          {availability.status}
                          {availability.timeSlots && availability.timeSlots.length > 0 && (
                            <span className="hidden md:inline ml-1">
                              ({availability.timeSlots.length})
                            </span>
                          )}
                        </div>
                      )}
                      
                      {availability?.timeSlots && availability.timeSlots.length > 0 && (
                        <div className="mt-1 overflow-hidden text-xs hidden md:block">
                          {availability.timeSlots.slice(0, 1).map((slot, i) => (
                            <div key={i} className="truncate text-muted-foreground">
                              {slot.startTime} - {slot.endTime}
                            </div>
                          ))}
                          {availability.timeSlots.length > 1 && (
                            <div className="text-muted-foreground">
                              +{availability.timeSlots.length - 1} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
