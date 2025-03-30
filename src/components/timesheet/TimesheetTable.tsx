
import React, { useState } from 'react';
import { Filter, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimesheetRow } from './TimesheetRow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimesheetTableProps {
  selectedDate: Date;
  readOnly?: boolean;
}

export const TimesheetTable: React.FC<TimesheetTableProps> = ({ selectedDate, readOnly }) => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<string>('tableView');
  
  // Sample data for demonstration, structured according to the template
  const timesheetEntries = [
    { 
      id: 1, 
      date: new Date(selectedDate), 
      employee: 'Vinayak Singh', 
      role: 'Team Leader',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      startTime: '05:45', 
      endTime: '14:00', 
      breakDuration: '30 min',
      totalHours: '7.75',
      status: 'Active' as const,
      bidId: 201,
      assignedTime: '2 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'GOLD'
    },
    { 
      id: 2, 
      date: new Date(selectedDate), 
      employee: 'John Smith', 
      role: 'TM3',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      startTime: '06:15', 
      endTime: '14:00', 
      breakDuration: '30 min',
      totalHours: '7.25',
      status: 'Active' as const,
      bidId: 202,
      assignedTime: '3 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'GOLD'
    },
    { 
      id: 3, 
      date: new Date(selectedDate), 
      employee: 'Emma Watson', 
      role: 'TM2',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      startTime: '06:30', 
      endTime: '14:00', 
      breakDuration: '30 min',
      totalHours: '7',
      status: 'Completed' as const,
      bidId: 203,
      assignedTime: '5 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'GOLD'
    },
    { 
      id: 4, 
      date: new Date(selectedDate), 
      employee: 'David Miller', 
      role: 'TM2',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      startTime: '06:30', 
      endTime: '14:00', 
      breakDuration: '30 min',
      totalHours: '7',
      status: 'Cancelled' as const,
      bidId: 204,
      assignedTime: '4 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: 'Personal emergency',
      remunerationLevel: 'SILVER'
    },
    { 
      id: 5, 
      date: new Date(selectedDate), 
      employee: 'Sarah Johnson', 
      role: 'TM2',
      department: 'Convention Centre',
      subGroup: 'AM Assist',
      startTime: '11:30', 
      endTime: '16:30', 
      breakDuration: '30 min',
      totalHours: '4.5',
      status: 'Active' as const,
      bidId: 205,
      assignedTime: '1 day ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'SILVER'
    },
    { 
      id: 6, 
      date: new Date(selectedDate), 
      employee: 'Casey Morgan', 
      role: 'Team Leader',
      department: 'Convention Centre',
      subGroup: 'PM Base',
      startTime: '13:15', 
      endTime: '21:30', 
      breakDuration: '45 min',
      totalHours: '7.5',
      status: 'Swapped' as const,
      bidId: 206,
      assignedTime: '2 days ago',
      originalEmployee: 'Riley Wilson',
      replacementEmployee: 'Casey Morgan',
      cancellationReason: 'Shift swap requested by original employee',
      remunerationLevel: 'GOLD'
    },
    { 
      id: 7, 
      date: new Date(selectedDate), 
      employee: 'Alex Carter', 
      role: 'TM3',
      department: 'Convention Centre',
      subGroup: 'Late',
      startTime: '16:30', 
      endTime: '23:00', 
      breakDuration: '30 min',
      totalHours: '6',
      status: 'No-Show' as const,
      bidId: 207,
      assignedTime: '5 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: 'Employee did not show up for shift',
      remunerationLevel: 'GOLD'
    },
    { 
      id: 8, 
      date: new Date(selectedDate), 
      employee: 'Jordan Davis', 
      role: 'Coordinator',
      department: 'Exhibition Centre',
      subGroup: 'Bump-In',
      startTime: '09:00', 
      endTime: '17:00', 
      breakDuration: '45 min',
      totalHours: '7.25',
      status: 'Active' as const,
      bidId: 208,
      assignedTime: '3 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'GOLD'
    },
    { 
      id: 9, 
      date: new Date(selectedDate), 
      employee: 'Taylor Brown', 
      role: 'Supervisor',
      department: 'Theatre',
      subGroup: 'AM Floaters',
      startTime: '08:00', 
      endTime: '16:00', 
      breakDuration: '60 min',
      totalHours: '7',
      status: 'Active' as const,
      bidId: 209,
      assignedTime: '4 days ago',
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null,
      remunerationLevel: 'GOLD'
    },
  ];
  
  // Filter entries based on selected status
  const filteredEntries = statusFilter
    ? timesheetEntries.filter(entry => entry.status === statusFilter)
    : timesheetEntries;
  
  // Group entries by department and subgroup
  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    const department = entry.department;
    const subGroup = entry.subGroup;
    
    if (!acc[department]) {
      acc[department] = {};
    }
    
    if (!acc[department][subGroup]) {
      acc[department][subGroup] = [];
    }
    
    acc[department][subGroup].push(entry);
    
    return acc;
  }, {} as Record<string, Record<string, typeof timesheetEntries>>);
  
  return (
    <div>
      {/* View mode selection */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={statusFilter === null ? "outline" : "ghost"} 
            size="sm" 
            className={statusFilter === null ? "bg-white/5 border-white/10" : ""}
            onClick={() => setStatusFilter(null)}
          >
            All Shifts
          </Button>
          <Button 
            variant={statusFilter === 'Active' ? "outline" : "ghost"} 
            size="sm"
            className={statusFilter === 'Active' ? "bg-blue-900/20 border-blue-500/20 text-blue-300" : ""}
            onClick={() => setStatusFilter('Active')}
          >
            Active
          </Button>
          <Button 
            variant={statusFilter === 'Completed' ? "outline" : "ghost"} 
            size="sm"
            className={statusFilter === 'Completed' ? "bg-green-900/20 border-green-500/20 text-green-300" : ""}
            onClick={() => setStatusFilter('Completed')}
          >
            Completed
          </Button>
          <Button 
            variant={statusFilter === 'Cancelled' ? "outline" : "ghost"} 
            size="sm"
            className={statusFilter === 'Cancelled' ? "bg-red-900/20 border-red-500/20 text-red-300" : ""}
            onClick={() => setStatusFilter('Cancelled')}
          >
            Cancelled
          </Button>
          <Button 
            variant={statusFilter === 'Swapped' ? "outline" : "ghost"} 
            size="sm"
            className={statusFilter === 'Swapped' ? "bg-purple-900/20 border-purple-500/20 text-purple-300" : ""}
            onClick={() => setStatusFilter('Swapped')}
          >
            Swapped
          </Button>
          <Button 
            variant={statusFilter === 'No-Show' ? "outline" : "ghost"} 
            size="sm"
            className={statusFilter === 'No-Show' ? "bg-yellow-900/20 border-yellow-500/20 text-yellow-300" : ""}
            onClick={() => setStatusFilter('No-Show')}
          >
            No-Show
          </Button>
        </div>
        
        <Tabs defaultValue="tableView" className="w-auto">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger 
              value="tableView" 
              className="data-[state=active]:bg-white/10"
              onClick={() => setViewMode('tableView')}
            >
              Table
            </TabsTrigger>
            <TabsTrigger 
              value="groupView" 
              className="data-[state=active]:bg-white/10"
              onClick={() => setViewMode('groupView')}
            >
              Group
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tableView" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left p-3 text-sm font-medium text-white/80">Employee</th>
                    <th className="text-left p-3 text-sm font-medium text-white/80">Department</th>
                    <th className="text-left p-3 text-sm font-medium text-white/80">Sub-Group</th>
                    <th className="text-left p-3 text-sm font-medium text-white/80">Role</th>
                    <th className="text-left p-3 text-sm font-medium text-white/80">Start Time</th>
                    <th className="text-left p-3 text-sm font-medium text-white/80">End Time</th>
                    <th className="text-left p-3 text-sm font-medium text-white/80">Break</th>
                    <th className="text-left p-3 text-sm font-medium text-white/80">Total Hours</th>
                    <th className="text-left p-3 text-sm font-medium text-white/80">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-white/80">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <TimesheetRow key={entry.id} entry={entry} readOnly={readOnly} />
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-white/60">
                No shifts found matching the selected filter.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="groupView" className="mt-0">
            <div className="space-y-8">
              {Object.entries(groupedEntries).map(([department, subGroups]) => (
                <div key={department} className="space-y-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${
                      department === 'Convention Centre' ? 'bg-blue-500' : 
                      department === 'Exhibition Centre' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    {department}
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(subGroups).map(([subGroup, entries]) => (
                      <div key={subGroup} className="bg-black/20 rounded-lg p-4 border border-white/10">
                        <h4 className="text-lg font-medium mb-3">{subGroup}</h4>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {entries.map(entry => (
                            <div key={entry.id} className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="font-medium text-white">{entry.employee}</span>
                                  <span className="ml-3 text-xs px-2 py-0.5 rounded bg-blue-500/20 text-white/80 border border-blue-500/20">
                                    {entry.role}
                                  </span>
                                  <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                                    entry.remunerationLevel === 'GOLD' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30' :
                                    entry.remunerationLevel === 'SILVER' ? 'bg-slate-400/30 text-slate-300 border border-slate-400/30' :
                                    'bg-orange-600/30 text-orange-300 border border-orange-600/30'
                                  }`}>
                                    {entry.remunerationLevel}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-white/70">
                                  <Clock size={12} className="mr-1" />
                                  {entry.startTime} - {entry.endTime} ({entry.totalHours} hrs)
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <div className={`text-xs px-2 py-1 rounded-full ${
                                  entry.status === 'Active' ? 'bg-blue-500/20 text-blue-300' :
                                  entry.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                                  entry.status === 'Cancelled' ? 'bg-red-500/20 text-red-300' :
                                  entry.status === 'Swapped' ? 'bg-purple-500/20 text-purple-300' :
                                  'bg-yellow-500/20 text-yellow-300'
                                }`}>
                                  {entry.status}
                                </div>
                                
                                <button className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-blue-400">
                                  <Clock size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(groupedEntries).length === 0 && (
                <div className="text-center py-8 text-white/60">
                  No shifts found matching the selected filter.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
