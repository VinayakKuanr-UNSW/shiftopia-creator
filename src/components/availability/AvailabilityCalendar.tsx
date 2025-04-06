
import React from 'react';
import { format, isSameMonth, isToday, startOfWeek, endOfWeek, addDays, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { AvailabilityStatus } from '@/api/models/types';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';

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
    deleteAvailability,
    isDateLocked,
    monthlyAvailabilities
  } = useAvailabilities();
  
  const { toast } = useToast();

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
  
  const handleDeleteAvailability = async (date: Date, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (isDateLocked(date)) {
      toast({
        title: "Cannot Delete",
        description: "This date is locked and cannot be modified.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await deleteAvailability(date);
    if (success) {
      toast({
        title: "Availability Deleted",
        description: `Availability for ${format(date, 'MMMM dd, yyyy')} has been removed.`,
      });
    }
  };

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
                const isLocked = isDateLocked(day);
                
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "h-32 md:h-40 p-1 transition-colors relative group",
                      isLocked 
                        ? "opacity-60 cursor-not-allowed bg-gray-800/20" 
                        : "hover:bg-muted/50 cursor-pointer",
                      !isCurrentMonth && "opacity-40"
                    )}
                    onClick={() => !isLocked && onSelectDate(day)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start">
                        <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded-full",
                            isTodayDate ? "bg-blue-500 text-white" : isCurrentMonth 
                              ? "text-white/80" 
                              : "text-white/40"
                          )}
                        >
                          {format(day, 'd')}
                        </span>
                        
                        {isLocked && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-amber-500">
                                  <AlertTriangle size={14} />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Date locked - past cutoff</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      
                      {availability && (
                        <div className="w-full grow mt-1 space-y-1">
                          <div 
                            className={cn(
                              "w-full rounded-md p-2",
                              getDayStatusColor(availability.status as AvailabilityStatus),
                              "flex items-center justify-between text-white text-xs font-medium"
                            )}
                          >
                            <span>{availability.status}</span>
                            
                            {!isLocked && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => handleDeleteAvailability(day, e)}
                              >
                                <Trash2 size={12} />
                              </Button>
                            )}
                          </div>
                          
                          {availability.timeSlots && availability.timeSlots.length > 0 && (
                            <div className="overflow-hidden text-xs">
                              {availability.timeSlots.slice(0, 2).map((slot, i) => (
                                <div key={i} className="truncate text-muted-foreground p-1 rounded bg-muted/30">
                                  {slot.startTime} - {slot.endTime}
                                </div>
                              ))}
                              {availability.timeSlots.length > 2 && (
                                <div className="text-muted-foreground text-center">
                                  +{availability.timeSlots.length - 2} more
                                </div>
                              )}
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
