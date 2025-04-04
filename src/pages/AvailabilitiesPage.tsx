
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
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
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
        
        <div className="flex items-center justify-between">
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
          
          <PresetSelector onApplyPreset={handleApplyPreset} />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-grow p-4 grid place-items-center">
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <div className="flex-grow overflow-auto">
          {viewMode === 'calendar' ? (
            <div className="h-full overflow-hidden">
              <AvailabilityCalendar onSelectDate={handleDateClick} />
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
    </div>
  );
};

export default AvailabilitiesPage;
