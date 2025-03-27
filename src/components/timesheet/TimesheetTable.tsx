
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, addDays } from 'date-fns';
import { ShiftStatusBadge } from '@/components/timesheet/ShiftStatusBadge';
import { ShiftHistoryDrawer } from '@/components/timesheet/ShiftHistoryDrawer';
import { TimesheetRow } from '@/components/timesheet/TimesheetRow';
import { Clock, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

// Mock data for timesheet entries
const MOCK_TIMESHEET_DATA = [
  {
    id: '1',
    shiftId: 'shift-001',
    position: 'Bartender',
    location: 'Convention Centre',
    subGroup: 'Main Hall',
    originalEmployee: {
      id: 'emp-001',
      name: 'John Smith',
      status: 'Cancelled',
      reason: 'Family emergency'
    },
    replacementEmployees: [
      {
        id: 'emp-002',
        name: 'Emma Johnson',
        status: 'Completed',
        clockIn: '09:00 AM',
        clockOut: '05:00 PM',
        breakTime: '30 min',
        notes: 'Covered for John Smith'
      }
    ]
  },
  {
    id: '2',
    shiftId: 'shift-002',
    position: 'Security',
    location: 'Exhibition Centre',
    subGroup: 'Entry Point',
    originalEmployee: {
      id: 'emp-003',
      name: 'Michael Chen',
      status: 'Cancelled',
      reason: 'Sick leave'
    },
    replacementEmployees: [
      {
        id: 'emp-004',
        name: 'Robert Davis',
        status: 'Cancelled',
        reason: 'Double booking'
      },
      {
        id: 'emp-005',
        name: 'Sarah Wilson',
        status: 'Completed',
        clockIn: '08:30 AM',
        clockOut: '04:30 PM',
        breakTime: '45 min',
        notes: 'Took extended break due to understaffing'
      }
    ]
  },
  {
    id: '3',
    shiftId: 'shift-003',
    position: 'Host',
    location: 'Theatre',
    subGroup: 'VIP Area',
    originalEmployee: {
      id: 'emp-006',
      name: 'Olivia Rodriguez',
      status: 'Completed',
      clockIn: '10:00 AM',
      clockOut: '06:00 PM',
      breakTime: '30 min'
    },
    replacementEmployees: []
  },
  {
    id: '4',
    shiftId: 'shift-004',
    position: 'Technician',
    location: 'Convention Centre',
    subGroup: 'Stage',
    originalEmployee: {
      id: 'emp-007',
      name: 'David Kim',
      status: 'Active',
      clockIn: '07:00 AM',
      breakTime: '30 min'
    },
    replacementEmployees: []
  }
];

interface TimesheetTableProps {
  selectedDate: Date;
}

export const TimesheetTable: React.FC<TimesheetTableProps> = ({ selectedDate }) => {
  const { toast } = useToast();
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
  
  // Generate the week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfWeek, i);
    return {
      date: day,
      shortDay: format(day, 'EEE'),
      dayNumber: format(day, 'd')
    };
  });
  
  const handleApprove = (shiftId: string) => {
    toast({
      title: "Timesheet Approved",
      description: `Timesheet for shift ${shiftId} has been approved`,
    });
  };
  
  const handleReject = (shiftId: string) => {
    toast({
      title: "Timesheet Rejected",
      description: `Timesheet for shift ${shiftId} has been rejected`,
    });
  };
  
  return (
    <div className="overflow-auto">
      <Table className="border border-white/10 rounded-md">
        <TableHeader className="bg-black/30">
          <TableRow>
            <TableHead className="text-white font-medium w-[250px]">Employee & Status</TableHead>
            <TableHead className="text-white font-medium">Position</TableHead>
            <TableHead className="text-white font-medium">Location</TableHead>
            <TableHead className="text-white font-medium">Clock In</TableHead>
            <TableHead className="text-white font-medium">Clock Out</TableHead>
            <TableHead className="text-white font-medium">Break</TableHead>
            <TableHead className="text-white font-medium">Hours</TableHead>
            <TableHead className="text-white font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_TIMESHEET_DATA.map((timesheet) => (
            <React.Fragment key={timesheet.id}>
              {/* Original employee row */}
              <TimesheetRow 
                timesheet={timesheet}
                onApprove={() => handleApprove(timesheet.shiftId)}
                onReject={() => handleReject(timesheet.shiftId)}
                onViewHistory={() => setSelectedShift(timesheet.shiftId)}
              />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      
      {/* Shift history drawer */}
      {selectedShift && (
        <ShiftHistoryDrawer 
          shiftId={selectedShift}
          isOpen={!!selectedShift}
          onClose={() => setSelectedShift(null)}
          data={MOCK_TIMESHEET_DATA.find(t => t.shiftId === selectedShift)}
        />
      )}
    </div>
  );
};
