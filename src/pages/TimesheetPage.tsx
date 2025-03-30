
import React, { useState } from 'react';
import { Calendar, Clock, Filter, Search, Download, PlusCircle, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { TimesheetHeader } from '@/components/timesheet/TimesheetHeader';
import { TimesheetTable } from '@/components/timesheet/TimesheetTable';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const TimesheetPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold flex items-center">
              <Clock className="mr-2 text-primary" size={24} />
              Timesheets
            </h1>
            
            <div className="flex flex-wrap gap-2">
              {hasPermission('create') && (
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <PlusCircle className="mr-1.5 h-4 w-4" />
                  New Entry
                </Button>
              )}
              
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                size="sm"
                onClick={handleExport}
              >
                <Download className="mr-1.5 h-4 w-4" />
                Export
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="border-border"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-1.5 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
          
          <TimesheetHeader 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          
          <div className="mt-6">
            <TimesheetTable 
              selectedDate={selectedDate} 
              readOnly={!hasPermission('update')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetPage;
