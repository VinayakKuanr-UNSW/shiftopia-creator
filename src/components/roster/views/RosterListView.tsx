import React, { useState } from 'react';
import { Roster } from '@/api/models/types';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, User, MapPin, Building } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface RosterListViewProps {
  roster: Roster | null;
  selectedDate: Date;
  readOnly?: boolean;
}

export const RosterListView: React.FC<RosterListViewProps> = ({ 
  roster, 
  selectedDate,
  readOnly
}) => {
  const [sortField, setSortField] = useState<string>('startTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Collect all shifts from all groups and subgroups
  const allShifts: Array<{ 
    id: string;
    role: string;
    startTime: string;
    endTime: string;
    employee?: { id: string; name: string; };
    employeeId?: string;
    groupName: string;
    groupColor: string;
    subGroupName: string;
    breakDuration: string;
    remunerationLevel: string;
  }> = [];
  
  if (roster) {
    roster.groups.forEach(group => {
      group.subGroups.forEach(subGroup => {
        subGroup.shifts.forEach(shift => {
          allShifts.push({
            ...shift,
            groupName: group.name,
            groupColor: group.color,
            subGroupName: subGroup.name
          });
        });
      });
    });
  }
  
  // Sort shifts
  const sortedShifts = [...allShifts].sort((a, b) => {
    if (sortField === 'startTime') {
      const dateA = new Date(a.startTime || '');
      const dateB = new Date(b.startTime || '');
      return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
    if (sortField === 'role') {
      return sortDirection === 'asc' 
        ? a.role.localeCompare(b.role) 
        : b.role.localeCompare(a.role);
    }
    if (sortField === 'group') {
      return sortDirection === 'asc' 
        ? a.groupName.localeCompare(b.groupName) 
        : b.groupName.localeCompare(a.groupName);
    }
    if (sortField === 'employee') {
      const nameA = a.employee?.name || 'Unassigned';
      const nameB = b.employee?.name || 'Unassigned';
      return sortDirection === 'asc' 
        ? nameA.localeCompare(nameB) 
        : nameB.localeCompare(nameA);
    }
    return 0;
  });
  
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  if (!roster) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/60">No roster data available for the selected date</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-blue-400" />
          <span className="text-sm text-white/80">
            Showing shifts for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort: {sortField} ({sortDirection})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleSort('startTime')}>
              Sort by Time
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('role')}>
              Sort by Role
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('group')}>
              Sort by Group
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('employee')}>
              Sort by Employee
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Time</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Subgroup</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedShifts.length > 0 ? (
            sortedShifts.map(shift => {
              // Create a compatible employee object if needed
              const employeeObj = shift.employee ? {
                id: shift.employee.id,
                name: shift.employee.name || `${shift.employee.firstName || ''} ${shift.employee.lastName || ''}`.trim()
              } : undefined;
              
              return (
                <TableRow key={shift.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-2 text-blue-400" />
                      <span>
                        {shift.startTime ? format(parseISO(shift.startTime), 'HH:mm') : '--'} - 
                        {shift.endTime ? format(parseISO(shift.endTime), 'HH:mm') : '--'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{shift.role}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`bg-${shift.groupColor}-500/30`}>
                      {shift.groupName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-white/70">{shift.subGroupName}</span>
                  </TableCell>
                  <TableCell>
                    {employeeObj ? (
                      <div className="flex items-center">
                        <span>{employeeObj.name}</span>
                      </div>
                    ) : (
                      <span className="text-white/50">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span>{shift.remunerationLevel}</span>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-white/60">
                No shifts found for this date
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RosterListView;
