
import React, { useState } from 'react';
import { TimesheetRow } from './TimesheetRow';

interface TimesheetTableProps {
  selectedDate: Date;
  readOnly?: boolean;
}

export const TimesheetTable: React.FC<TimesheetTableProps> = ({ selectedDate, readOnly }) => {
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
      status: 'Completed' as const
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
      status: 'Active' as const
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
      status: 'Completed' as const
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
      status: 'Cancelled' as const
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
      status: 'Active' as const
    },
  ];
  
  return (
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
          {timesheetEntries.map((entry) => (
            <TimesheetRow key={entry.id} entry={entry} readOnly={readOnly} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
