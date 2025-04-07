
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addMonths, subMonths, addDays, eachDayOfInterval } from 'date-fns';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';
import { AvailabilityForm } from '@/components/availability/AvailabilityForm';
import { BatchAvailabilityForm } from '@/components/availability/BatchAvailabilityForm';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthListView } from '@/components/availability/MonthListView';
import { PresetSelector } from '@/components/availability/PresetSelector';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, List, Lock, Unlock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const AvailabilitiesPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBatchFormOpen, setIsBatchFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isCutoffPickerOpen, setCutoffPickerOpen] = useState(false);
  
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const isManager = hasPermission?.('manage_availability') || false;

  const {
    monthlyAvailabilities,
    isLoading,
    setAvailability,
    applyPreset,
    setCutoff,
    cutoffDate,
    goToPreviousMonth,
    goToNextMonth,
    setSelectedMonth: updateSelectedMonth
  } = useAvailabilities();

  const handleNextMonth = () => {
    const nextMonth = addMonths(selectedMonth, 1);
    setSelectedMonth(nextMonth);
    updateSelectedMonth(nextMonth);
  };

  const handlePrevMonth = () => {
    const prevMonth = subMonths(selectedMonth, 1);
    setSelectedMonth(prevMonth);
    updateSelectedMonth(prevMonth);
  };

  const handleSaveAvailability = async (data: any) => {
    if (!selectedDate) return;

    await setAvailability({
      startDate: selectedDate,
      endDate: selectedDate,
      timeSlots: data.timeSlots,
      notes: data.notes
    });

    toast({
      title: "Availability Saved",
      description: `Your availability for ${format(selectedDate, 'dd MMM yyyy')} has been saved successfully.`,
    });

    setIsFormOpen(false);
    setSelectedDate(null);
  };

  const handleSaveBatchAvailability = async (data: {
    startDate: Date;
    endDate: Date;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      status?: string;
    }>;
    notes?: string;
  }) => {
    if (!data.startDate || !data.endDate) {
      toast({
        title: "Missing Dates",
        description: "Please select both start and end dates",
        variant: "destructive"
      });
      return;
    }

    if (data.endDate < data.startDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date cannot be before start date",
        variant: "destructive"
      });
      return;
    }

    // Check if any dates in the range already have availability
    const daysInRange = eachDayOfInterval({ start: data.startDate, end: data.endDate });
    const existingDays = daysInRange.filter(date => 
      monthlyAvailabilities.some(a => a.date === format(date, 'yyyy-MM-dd'))
    );
    
    if (existingDays.length > 0) {
      toast({
        title: "Existing Availabilities",
        description: `${existingDays.length} dates in your selection already have availability set. Please edit those individually.`,
        variant: "destructive"
      });
      return;
    }

    await setAvailability({
      startDate: data.startDate,
      endDate: data.endDate,
      timeSlots: data.timeSlots,
      notes: data.notes
    });

    toast({
      title: "Batch Availability Saved",
      description: `Availability set for ${format(data.startDate, 'dd MMM')} to ${format(data.endDate, 'dd MMM yyyy')}`,
    });

    setIsBatchFormOpen(false);
  };

  const handleApplyPreset = async (presetId: string, startDate: Date, endDate: Date) => {
    // Check if any dates in the range already have availability
    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
    const existingDays = daysInRange.filter(date => 
      monthlyAvailabilities.some(a => a.date === format(date, 'yyyy-MM-dd'))
    );
    
    if (existingDays.length > 0) {
      toast({
        title: "Warning",
        description: `${existingDays.length} dates already have availability set and will be overwritten.`,
        variant: "warning"
      });
    }

    await applyPreset({
      presetId,
      startDate,
      endDate
    });
  };

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existing = monthlyAvailabilities.find(a => a.date === dateStr);
    
    if (existing) {
      // If availability exists, open the form for editing
      setSelectedDate(date);
      setIsFormOpen(true);
    } else {
      // If no availability exists yet, open the form for adding
      setSelectedDate(date);
      setIsFormOpen(true);
    }
  };
  
  const handleSetCutoffDate = (date: Date | undefined) => {
    setCutoff(date || null);
    setCutoffPickerOpen(false);
  };
  
  const handleRemoveCutoff = () => {
    setCutoff(null);
  };

  const openBatchForm = () => {
    setIsBatchFormOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="flex-shrink-0 p-4 md:p-6 space-y-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Availability Management</h1>
          
          <div className="flex items-center gap-2">
            <Tabs 
              value={viewMode} 
              onValueChange={(val) => setViewMode(val as 'calendar' | 'list')}
              className="hidden sm:block"
            >
              <TabsList>
                <TabsTrigger value="calendar">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedDate(new Date());
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Single Day
            </Button>
            
            <Button 
              variant="default" 
              onClick={openBatchForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Multiple Days
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-36 text-center font-medium">
              {format(selectedMonth, 'MMMM yyyy')}
            </div>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {isManager && (
              <>
                <Popover open={isCutoffPickerOpen} onOpenChange={setCutoffPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      {cutoffDate ? `Cutoff: ${format(cutoffDate, 'MMM dd')}` : 'Set Cutoff Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={cutoffDate || undefined}
                      onSelect={handleSetCutoffDate}
                      initialFocus
                    />
                    {cutoffDate && (
                      <div className="p-2 border-t border-border flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleRemoveCutoff}
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Remove Cutoff
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </>
            )}
            
            <PresetSelector onApplyPreset={handleApplyPreset} />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-grow p-4 grid place-items-center">
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : (
        <div className="flex-grow overflow-auto h-[calc(100vh-180px)]">
          {viewMode === 'calendar' ? (
            <div className="h-full overflow-hidden">
              <AvailabilityCalendar 
                onSelectDate={handleDateClick}
                selectedMonth={selectedMonth} 
              />
            </div>
          ) : (
            <div className="p-4 md:p-6">
              <MonthListView onSelectDate={handleDateClick} />
            </div>
          )}
        </div>
      )}
      
      {isFormOpen && selectedDate && (
        <AvailabilityForm
          selectedDate={selectedDate}
          onSubmit={handleSaveAvailability}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedDate(null);
          }}
        />
      )}

      {isBatchFormOpen && (
        <BatchAvailabilityForm
          onSubmit={handleSaveBatchAvailability}
          onCancel={() => {
            setIsBatchFormOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AvailabilitiesPage;
