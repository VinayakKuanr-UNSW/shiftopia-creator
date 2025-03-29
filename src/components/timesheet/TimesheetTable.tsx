
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimesheetRow } from './TimesheetRow';

interface TimesheetTableProps {
  selectedDate: Date;
  readOnly?: boolean;
}

export const TimesheetTable: React.FC<TimesheetTableProps> = ({ selectedDate, readOnly }) => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Sample data for demonstration
  const timesheetEntries = [
    { 
      id: 1, 
      date: new Date(selectedDate), 
      employee: 'Alex Johnson', 
      role: 'Event Coordinator',
      department: 'Convention',
      startTime: '08:00', 
      endTime: '16:00', 
      breakDuration: '30 min',
      totalHours: '7.5',
      status: 'Completed' as const,
      bidId: 201,
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null
    },
    { 
      id: 2, 
      date: new Date(selectedDate), 
      employee: 'Sam Wilson', 
      role: 'Tour Guide',
      department: 'Exhibition',
      startTime: '09:00', 
      endTime: '17:00', 
      breakDuration: '45 min',
      totalHours: '7.25',
      status: 'Active' as const,
      bidId: 202,
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null
    },
    { 
      id: 3, 
      date: new Date(selectedDate), 
      employee: 'Jamie Smith', 
      role: 'Sound Engineer',
      department: 'Theatre',
      startTime: '14:00', 
      endTime: '22:00', 
      breakDuration: '60 min',
      totalHours: '7',
      status: 'Completed' as const,
      bidId: 203,
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null
    },
    { 
      id: 4, 
      date: new Date(selectedDate), 
      employee: 'Taylor Brown', 
      role: 'Security Officer',
      department: 'Convention',
      startTime: '09:00', 
      endTime: '17:00', 
      breakDuration: '45 min',
      totalHours: '7.25',
      status: 'Cancelled' as const,
      bidId: 204,
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: 'Personal emergency'
    },
    { 
      id: 5, 
      date: new Date(selectedDate), 
      employee: 'Jordan Davis', 
      role: 'Information Desk',
      department: 'Exhibition',
      startTime: '08:30', 
      endTime: '16:30', 
      breakDuration: '30 min',
      totalHours: '7.5',
      status: 'Active' as const,
      bidId: 205,
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: null
    },
    { 
      id: 6, 
      date: new Date(selectedDate), 
      employee: 'Casey Morgan', 
      role: 'Event Coordinator',
      department: 'Convention',
      startTime: '10:00', 
      endTime: '18:00', 
      breakDuration: '45 min',
      totalHours: '7.25',
      status: 'Swapped' as const,
      bidId: 206,
      originalEmployee: 'Riley Wilson',
      replacementEmployee: 'Casey Morgan',
      cancellationReason: 'Shift swap requested by original employee'
    },
    { 
      id: 7, 
      date: new Date(selectedDate), 
      employee: 'Alex Carter', 
      role: 'Tour Guide',
      department: 'Exhibition',
      startTime: '09:00', 
      endTime: '17:00', 
      breakDuration: '30 min',
      totalHours: '7.5',
      status: 'No-Show' as const,
      bidId: 207,
      originalEmployee: null,
      replacementEmployee: null,
      cancellationReason: 'Employee did not show up for shift'
    },
  ];
  
  // Filter entries based on selected status
  const filteredEntries = statusFilter
    ? timesheetEntries.filter(entry => entry.status === statusFilter)
    : timesheetEntries;
  
  return (
    <div>
      {/* Status filters */}
      <div className="mb-4 flex flex-wrap gap-2">
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
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/5">
              <th className="text-left p-3 text-sm font-medium text-white/80">Employee</th>
              <th className="text-left p-3 text-sm font-medium text-white/80">Department</th>
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
    </div>
  );
};
