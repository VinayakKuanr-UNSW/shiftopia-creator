
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarRange, CalendarDays, ListFilter, CalendarClock, CirclePlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';
import { AvailabilityForm } from '@/components/availability/AvailabilityForm';
import { PresetSelector } from '@/components/availability/PresetSelector';
import { DayAvailabilityView } from '@/components/availability/DayAvailabilityView';
import { MonthListView } from '@/components/availability/MonthListView';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';

type ViewMode = 'calendar' | 'list';

const AvailabilitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDayDialog, setShowDayDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTabInAdd, setActiveTabInAdd] = useState('custom');

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setShowDayDialog(true);
  };

  const handleEditDay = () => {
    setShowDayDialog(false);
    setShowAddDialog(true);
    setActiveTabInAdd('custom');
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Please log in to manage availabilities</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <CalendarClock className="mr-2 text-primary" size={28} />
            Manage Your Availability
          </h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-lg">Welcome back, {user.name}</p>
              <p className="text-sm text-muted-foreground">Department: {user.department.charAt(0).toUpperCase() + user.department.slice(1)}</p>
            </div>

            <div className="flex gap-2">
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
                <ToggleGroupItem value="calendar" aria-label="Calendar view">
                  <CalendarRange className="h-4 w-4 mr-1" />
                  Calendar
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  List
                </ToggleGroupItem>
              </ToggleGroup>

              <Button 
                onClick={() => {
                  setShowAddDialog(true);
                  setActiveTabInAdd('custom');
                }}
                className="ml-2"
              >
                <CirclePlus className="h-4 w-4 mr-1" />
                Add Availability
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border shadow-lg p-4 mb-4">
              {viewMode === 'calendar' ? (
                <AvailabilityCalendar onSelectDate={handleSelectDate} />
              ) : (
                <MonthListView onSelectDate={handleSelectDate} />
              )}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ListFilter className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Apply presets to your schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => {
                    setShowAddDialog(true);
                    setActiveTabInAdd('presets');
                  }}
                >
                  <CalendarRange className="h-4 w-4 mr-2" />
                  Apply Availability Preset
                </Button>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Color Legend</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2" />
                      <span className="text-sm">Partially Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-red-500 mr-2" />
                      <span className="text-sm">Unavailable</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-gray-300 mr-2" />
                      <span className="text-sm">Not Set</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Click on a date to view or edit availability</li>
                    <li>• Use presets to quickly apply common schedules</li>
                    <li>• Switch between calendar and list views</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Day detail dialog */}
        <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Availability for {format(selectedDate, 'EEEE, MMMM d, yyyy')}</DialogTitle>
            </DialogHeader>
            <DayAvailabilityView date={selectedDate} onEdit={handleEditDay} />
          </DialogContent>
        </Dialog>
        
        {/* Add/Edit availability dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {activeTabInAdd === 'custom' 
                  ? 'Set Availability' 
                  : 'Apply Availability Preset'}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs 
              defaultValue={activeTabInAdd} 
              value={activeTabInAdd}
              onValueChange={setActiveTabInAdd}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="custom">Custom Schedule</TabsTrigger>
                <TabsTrigger value="presets">Use Presets</TabsTrigger>
              </TabsList>
              <TabsContent value="custom">
                <AvailabilityForm onClose={() => setShowAddDialog(false)} />
              </TabsContent>
              <TabsContent value="presets">
                <PresetSelector onClose={() => setShowAddDialog(false)} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AvailabilitiesPage;
