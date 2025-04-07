
import React, { useState } from 'react';
import { format, isSameMonth, isToday, startOfWeek, endOfWeek, addDays, eachDayOfInterval, getDay, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Trash2, Check, X, AlertTriangle, MoreHorizontal } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";

interface AvailabilityCalendarProps {
  onSelectDate: (date: Date) => void;
  selectedMonth: Date;
}

export function AvailabilityCalendar({ onSelectDate, selectedMonth }: AvailabilityCalendarProps) {
  const {
    startOfMonth,
    endOfMonth,
    getDayStatusColor,
    getDayAvailability,
    deleteAvailability,
    isDateLocked,
    monthlyAvailabilities
  } = useAvailabilities();
  
  const [showTimeSlotsDialog, setShowTimeSlotsDialog] = useState(false);
  const [selectedTimeSlotsDate, setSelectedTimeSlotsDate] = useState<Date | null>(null);
  
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

  const showAllTimeSlots = (date: Date, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedTimeSlotsDate(date);
    setShowTimeSlotsDialog(true);
  };

  const getStatusIndicator = (status: AvailabilityStatus) => {
    switch (status) {
      case 'Available':
        return <div className="h-3 w-3 rounded-full bg-green-500"></div>;
      case 'Unavailable':
        return <div className="h-3 w-3 rounded-full bg-red-500"></div>;
      case 'Partial':
        return <div className="h-3 w-3 rounded-full bg-yellow-500"></div>;
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-300"></div>;
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
                          
                          {availability.timeSlots && (
                            <div className="flex flex-wrap gap-1">
                              {availability.timeSlots.slice(0, 2).map((slot, i) => (
                                <Badge key={i} variant="outline" className="text-[0.65rem] py-0 h-4 flex items-center gap-1">
                                  {getStatusIndicator(slot.status as AvailabilityStatus)} 
                                  {slot.startTime.substring(0,5)}-{slot.endTime.substring(0,5)}
                                </Badge>
                              ))}
                              {availability.timeSlots.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 px-1 text-[0.65rem] text-muted-foreground"
                                  onClick={(e) => showAllTimeSlots(day, e)}
                                >
                                  +{availability.timeSlots.length - 2} more
                                </Button>
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
      
      {/* Time slots dialog */}
      {showTimeSlotsDialog && selectedTimeSlotsDate && (
        <Dialog open={showTimeSlotsDialog} onOpenChange={setShowTimeSlotsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Availability for {format(selectedTimeSlotsDate, 'MMMM d, yyyy')}
              </DialogTitle>
              <DialogDescription>
                All time slots for this date
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              {getDayAvailability(selectedTimeSlotsDate)?.timeSlots.map((slot, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-md",
                    slot.status === 'Available' ? "bg-green-500/20 border border-green-500/30" :
                    slot.status === 'Unavailable' ? "bg-red-500/20 border border-red-500/30" :
                    "bg-yellow-500/20 border border-yellow-500/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIndicator(slot.status as AvailabilityStatus)}
                    <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <Badge>{slot.status}</Badge>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
