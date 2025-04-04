
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addMonths, subMonths } from 'date-fns';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';
import { AvailabilityForm } from '@/components/availability/AvailabilityForm';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthListView } from '@/components/availability/MonthListView';
import { PresetSelector } from '@/components/availability/PresetSelector';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AvailabilitiesPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    monthlyAvailabilities,
    isLoading,
    setAvailability,
    applyPreset,
  } = useAvailabilities();

  const handleNextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1));
  };

  const handlePrevMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
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

  const handleApplyPreset = async (presetId: string, startDate: Date, endDate: Date) => {
    await applyPreset({
      presetId,
      startDate,
      endDate
    });

    toast({
      title: "Preset Applied",
      description: `Availability preset has been applied from ${format(startDate, 'dd MMM')} to ${format(endDate, 'dd MMM yyyy')}.`,
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
  };

  const currentMonthLabel = format(selectedMonth, 'MMMM yyyy');

  return (
    <div className="h-full flex flex-col p-4 md:p-6 gap-4 overflow-auto">
      <div className="flex flex-col gap-4">
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
              variant="default" 
              onClick={() => {
                setSelectedDate(new Date());
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Availability
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="w-36 text-center font-medium">
                {currentMonthLabel}
              </div>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <PresetSelector onApplyPreset={handleApplyPreset} />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 mt-4">
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <div className="grid flex-1 h-full">
          {viewMode === 'calendar' ? (
            <Card className="h-full overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle>My Availability</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-auto">
                <AvailabilityCalendar onSelectDate={handleDateClick} />
              </CardContent>
            </Card>
          ) : (
            <MonthListView onSelectDate={handleDateClick} />
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
    </div>
  );
};

export default AvailabilitiesPage;
