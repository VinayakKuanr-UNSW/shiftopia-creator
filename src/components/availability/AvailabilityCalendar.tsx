
import React from 'react';
import { format, isSameMonth, isToday, startOfWeek, endOfWeek, addDays, eachDayOfInterval, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAvailabilities } from '@/hooks/useAvailabilities';

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

  // Create calendar grid
  const calendarDays = React.useMemo(() => {
    // Get start of first week (Sunday)
    const firstDayOfMonth = startOfMonth;
    const start = startOfWeek(firstDayOfMonth);
    
    // Get end of last week (Saturday)
    const lastDayOfMonth = endOfMonth;
    const end = endOfWeek(lastDayOfMonth);

    // Get all days in the calendar view
    return eachDayOfInterval({ start, end });
  }, [startOfMonth, endOfMonth]);

  // Organize days into weeks
  const calendarWeeks = React.useMemo(() => {
    const weeks = [];
    let week = [];

    for (const day of calendarDays) {
      week.push(day);
      
      if (getDay(day) === 6) {  // If it's Saturday, end the week
        weeks.push([...week]);
        week = [];
      }
    }

    // Add any remaining days
    if (week.length > 0) {
      weeks.push(week);
    }

    return weeks;
  }, [calendarDays]);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {format(selectedMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
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

        <div className="grid grid-cols-7 divide-x divide-y divide-border">
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
                      "h-24 p-1 hover:bg-muted/50 cursor-pointer transition-colors",
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
                            getDayStatusColor(availability.status),
                            "flex items-center justify-center text-white text-xs font-medium"
                          )}
                        >
                          {availability.status}
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
