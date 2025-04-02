
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { TimesheetHeader } from '@/components/timesheet/TimesheetHeader';
import { TimesheetTable } from '@/components/timesheet/TimesheetTable';

const TimesheetPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'group'>('table');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const { theme } = useTheme();

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Timesheets refreshed",
        description: "Latest timesheet data has been loaded."
      });
    }, 1000);
  };

  const handleExport = () => {
    toast({
      title: "Exporting timesheets",
      description: "Your timesheet data is being prepared for download."
    });
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your timesheet data has been exported successfully."
      });
    }, 1500);
  };

  const handleNewEntry = () => {
    setIsNewEntryDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full">
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-xl p-4 md:p-6">
        <TimesheetHeader 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onViewChange={setViewMode}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onNewEntry={handleNewEntry}
          onExport={handleExport}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <TimesheetTable 
          selectedDate={selectedDate} 
          readOnly={!hasPermission('update')}
          statusFilter={statusFilter}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />
      </div>

      {/* New Entry Dialog */}
      {isNewEntryDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-card text-card-foreground border border-border p-6 rounded-lg shadow-lg w-96 max-w-full mx-4">
            <h2 className="text-xl font-bold mb-4">New Timesheet Entry</h2>
            <p className="mb-4">This is a placeholder dialog for creating a new timesheet entry.</p>
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 border border-border rounded-md hover:bg-accent"
                onClick={() => setIsNewEntryDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                onClick={() => setIsNewEntryDialogOpen(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimesheetPage;
