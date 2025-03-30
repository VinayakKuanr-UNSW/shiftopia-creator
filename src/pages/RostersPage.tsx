import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Calendar, Clock, Filter, Search, User, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { RosterSidebar } from '@/components/roster/RosterSidebar';
import { RosterCalendar } from '@/components/roster/RosterCalendar';
import { RosterHeader } from '@/components/roster/RosterHeader';
import { useAuth } from '@/hooks/useAuth';
import { useRosters } from '@/api/hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RostersPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const { useRosterByDate, useCreateRoster, useUpdateRoster } = useRosters();
  
  const { data: currentRoster, isLoading } = useRosterByDate(selectedDate.toISOString().split('T')[0]);
  const createRosterMutation = useCreateRoster();
  const updateRosterMutation = useUpdateRoster();

  // Handle applying template
  const handleApplyTemplate = (templateId: number) => {
    createRosterMutation.mutate(
      { date: selectedDate.toISOString().split('T')[0], templateId },
      {
        onSuccess: () => {
          toast({
            title: "Template Applied",
            description: "The roster has been created from the selected template.",
          });
          setIsTemplateDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to apply template. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  // Handle saving roster
  const handleSaveRoster = () => {
    if (!currentRoster) return;

    updateRosterMutation.mutate(
      { 
        date: selectedDate.toISOString().split('T')[0], 
        updates: currentRoster 
      },
      {
        onSuccess: () => {
          toast({
            title: "Roster Saved",
            description: "All changes have been saved successfully.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to save roster. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex">
          {/* Main content */}
          <div className="flex-1 p-4 md:p-8">
            <div className="glass-panel p-6 mb-6" style={{ animation: 'none' }}>
              <RosterHeader 
                sidebarOpen={sidebarOpen} 
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onApplyTemplate={() => setIsTemplateDialogOpen(true)}
                onSaveRoster={handleSaveRoster}
              />
              
              <div className="mt-6">
                <RosterCalendar 
                  selectedDate={selectedDate} 
                  readOnly={!hasPermission('update')}
                  roster={currentRoster}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
          
          {/* Employee sidebar */}
          {sidebarOpen && (
            <RosterSidebar readOnly={!hasPermission('update')} />
          )}
        </div>

        {/* Template Selection Dialog */}
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
            <DialogHeader>
              <DialogTitle>Apply Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Template</label>
                <Select onValueChange={(value) => handleApplyTemplate(Number(value))}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                    <SelectItem value="1">Standard Weekday Template</SelectItem>
                    <SelectItem value="2">Weekend Template</SelectItem>
                    <SelectItem value="3">Special Event Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-white/60">
                This will create a new roster based on the selected template.
                Any existing roster for this date will be overwritten.
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
};

export default RostersPage;