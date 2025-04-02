
import React from 'react';
import { 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  PlusCircle, 
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';

interface TimesheetHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onViewChange: (view: 'table' | 'group') => void;
  statusFilter: string | null;
  onStatusFilterChange: (status: string | null) => void;
  onNewEntry: () => void;
  onExport: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const TimesheetHeader: React.FC<TimesheetHeaderProps> = ({
  selectedDate,
  onDateChange,
  onViewChange,
  statusFilter,
  onStatusFilterChange,
  onNewEntry,
  onExport,
  onRefresh,
  isRefreshing
}) => {
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onDateChange(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <Calendar className="mr-2 text-primary" size={24} />
          <h1 className="text-2xl font-bold">Timesheets</h1>
        </div>

        <div className="flex flex-wrap gap-2 ml-auto">
          <Button 
            variant="default" 
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
            onClick={onNewEntry}
          >
            <PlusCircle className="mr-1.5 h-4 w-4" />
            New Entry
          </Button>

          <Button 
            variant="default"
            className="bg-primary hover:bg-primary/90" 
            size="sm"
            onClick={onExport}
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-1.5 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search employees..." 
            className="pl-10 pr-4 py-2 text-sm w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <Button 
            variant={statusFilter === null ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => onStatusFilterChange(null)}
          >
            All Shifts
          </Button>
          <Button 
            variant={statusFilter === 'Active' ? "secondary" : "ghost"} 
            size="sm"
            className={statusFilter === 'Active' ? "bg-blue-500/20 text-blue-300" : ""}
            onClick={() => onStatusFilterChange('Active')}
          >
            Active
          </Button>
          <Button 
            variant={statusFilter === 'Completed' ? "secondary" : "ghost"} 
            size="sm"
            className={statusFilter === 'Completed' ? "bg-green-500/20 text-green-300" : ""}
            onClick={() => onStatusFilterChange('Completed')}
          >
            Completed
          </Button>
          <Button 
            variant={statusFilter === 'Cancelled' ? "secondary" : "ghost"} 
            size="sm"
            className={statusFilter === 'Cancelled' ? "bg-red-500/20 text-red-300" : ""}
            onClick={() => onStatusFilterChange('Cancelled')}
          >
            Cancelled
          </Button>
          <Button 
            variant={statusFilter === 'Swapped' ? "secondary" : "ghost"} 
            size="sm"
            className={statusFilter === 'Swapped' ? "bg-purple-500/20 text-purple-300" : ""}
            onClick={() => onStatusFilterChange('Swapped')}
          >
            Swapped
          </Button>
          <Button 
            variant={statusFilter === 'No-Show' ? "secondary" : "ghost"} 
            size="sm"
            className={statusFilter === 'No-Show' ? "bg-yellow-500/20 text-yellow-300" : ""}
            onClick={() => onStatusFilterChange('No-Show')}
          >
            No-Show
          </Button>
        </div>
      </div>

      {/* Date Navigation and View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center bg-black/20 p-2 rounded-md border border-white/10">
          <Button 
            variant="ghost"
            size="icon"
            onClick={goToPreviousDay}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-2 font-medium text-sm">
            {format(selectedDate, 'MMM dd, yyyy')}
          </span>
          <Button 
            variant="ghost"
            size="icon"
            onClick={goToNextDay}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="table" className="w-auto">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger 
              value="table" 
              className="data-[state=active]:bg-white/10"
              onClick={() => onViewChange('table')}
            >
              Table
            </TabsTrigger>
            <TabsTrigger 
              value="group" 
              className="data-[state=active]:bg-white/10"
              onClick={() => onViewChange('group')}
            >
              Group
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
