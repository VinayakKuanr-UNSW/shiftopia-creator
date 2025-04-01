
import React from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { Separator } from '@/components/ui/separator';

interface MonthListViewProps {
  onSelectDate: (date: Date) => void;
}

export function MonthListView({ onSelectDate }: MonthListViewProps) {
  const {
    selectedMonth,
    goToPreviousMonth,
    goToNextMonth,
    getDayStatusColor,
    getDayAvailability,
  } = useAvailabilities();

  const daysInMonth = React.useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return eachDayOfInterval({ start, end });
  }, [selectedMonth]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <CalendarDays className="h-6 w-6 mr-2" />
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
        <div className="p-4">
          <ul className="space-y-1">
            {daysInMonth.map((day) => {
              const availability = getDayAvailability(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <li key={day.toString()}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start p-3 h-auto",
                      isToday ? "bg-muted/50" : ""
                    )}
                    onClick={() => onSelectDate(day)}
                  >
                    <div className="flex items-center w-full">
                      <div 
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center mr-4",
                          isToday ? "bg-primary text-primary-foreground" : "bg-muted/30"
                        )}
                      >
                        <span className={cn("text-lg", isToday ? "font-bold" : "")}>
                          {format(day, 'd')}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className={cn("font-medium", isToday ? "text-primary" : "")}>
                            {format(day, 'EEEE')}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {format(day, 'MMMM d, yyyy')}
                          </span>
                        </div>
                        
                        {availability ? (
                          <div className="flex items-center mt-1">
                            <div
                              className={cn(
                                "h-3 w-3 rounded-full mr-2",
                                getDayStatusColor(availability.status as AvailabilityStatus)
                              )}
                            />
                            <span className="text-sm">
                              {availability.status}
                              {availability.timeSlots.length > 0 && (
                                <span className="text-muted-foreground ml-2">
                                  ({availability.timeSlots.length} time slot{availability.timeSlots.length !== 1 ? 's' : ''})
                                </span>
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground mt-1 flex items-center">
                            <div className="h-3 w-3 rounded-full bg-gray-300 mr-2" />
                            Not set
                          </span>
                        )}
                      </div>
                    </div>
                  </Button>
                  <Separator className="mt-1" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
