
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import RosterDayView from './views/RosterDayView';
import RosterThreeDayView from './views/RosterThreeDayView';
import RosterWeekView from './views/RosterWeekView';
import RosterMonthView from './views/RosterMonthView';
import RosterListView from './views/RosterListView';
import { RosterEmployeeView } from './RosterEmployeeView';
import { RosterFilter } from './RosterFilter';
import { AssignShiftDialog } from './AssignShiftDialog';
import AddGroupDialog from './dialogs/AddGroupDialog';
import { Clock, Filter, Plus, Calendar as CalendarIcon, List, Grid2X2, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Roster, Group, DepartmentName, DepartmentColor } from '@/api/models/types';
import { FilterCategory } from '@/types/roster';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface RosterCalendarProps {
  selectedDate: Date;
  readOnly?: boolean;
  roster?: Roster;
  isLoading?: boolean;
  onAssignEmployee?: (shiftId: string, employeeId: string) => void;
  onAddGroup?: (group: { name: DepartmentName; color: DepartmentColor }) => void;
}

export const RosterCalendar: React.FC<RosterCalendarProps> = ({ 
  selectedDate, 
  readOnly,
  roster,
  isLoading,
  onAssignEmployee,
  onAddGroup
}) => {
  const [viewMode, setViewMode] = useState<'day' | '3day' | 'week' | 'month' | 'list' | 'employee'>('day');
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const { toast } = useToast();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'EMPLOYEE',
    drop: (item: { id: string, name: string }, monitor) => {
      toast({
        title: "Employee Dropped",
        description: `Employee ${item.name} was dropped onto the roster.`,
      });
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Extract all shifts from roster
  const allShifts: Array<{ 
    shift: any, 
    groupName: string, 
    groupColor: string, 
    subGroupName: string 
  }> = [];

  if (roster) {
    roster.groups.forEach(group => {
      group.subGroups.forEach(subGroup => {
        subGroup.shifts.forEach(shift => {
          allShifts.push({
            shift,
            groupName: group.name,
            groupColor: group.color,
            subGroupName: subGroup.name
          });
        });
      });
    });
  }

  // Handle filters
  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
    
    // You would filter the data based on these filters
    console.log('Filters applied:', filters);
    
    // Show toast notification
    const totalFilters = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
    if (totalFilters > 0) {
      toast({
        title: "Filters Applied",
        description: `${totalFilters} filter${totalFilters > 1 ? 's' : ''} applied to roster view.`,
      });
    }
  };

  // Handle assigning multiple shifts
  const handleAssignShifts = (assignments: Array<{ shiftId: string, employeeId: string }>) => {
    // Process each assignment
    assignments.forEach(({ shiftId, employeeId }) => {
      if (onAssignEmployee) {
        onAssignEmployee(shiftId, employeeId);
      }
    });
    
    // Clear selected shifts after assignment
    setSelectedShifts([]);
    
    // Show confirmation toast
    toast({
      title: "Shifts Assigned",
      description: `Successfully assigned ${assignments.length} shift${assignments.length > 1 ? 's' : ''}.`,
    });
  };

  // Handle adding a new group
  const handleAddGroup = (group: { name: DepartmentName; color: DepartmentColor }) => {
    if (onAddGroup) {
      onAddGroup(group);
    } else {
      // Mock implementation for demo
      toast({
        title: "Department Added",
        description: `${group.name} department would be added to the roster.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" ref={drop}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center text-white/80 text-sm">
          <Clock size={14} className="mr-2 text-blue-400" />
          <span>Showing roster for {selectedDate.toLocaleDateString()}</span>
          
          {!readOnly && (
            <AddGroupDialog
              onAddGroup={handleAddGroup}
              trigger={
                <Button variant="outline" size="sm" className="ml-4">
                  <Plus size={14} className="mr-1" />
                  Add Department
                </Button>
              }
            />
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <RosterFilter onFilterChange={handleFilterChange} />
          
          {viewMode === 'employee' && selectedShifts.length > 0 && (
            <AssignShiftDialog
              selectedShifts={selectedShifts}
              allShifts={allShifts}
              onAssign={handleAssignShifts}
              trigger={
                <Button variant="outline" size="sm">
                  Assign Selected ({selectedShifts.length})
                </Button>
              }
            />
          )}
          
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as any)}>
            <ToggleGroupItem value="day" aria-label="Day View">
              Day
            </ToggleGroupItem>
            <ToggleGroupItem value="3day" aria-label="3-Day View">
              3-Day
            </ToggleGroupItem>
            <ToggleGroupItem value="week" aria-label="Week View">
              Week
            </ToggleGroupItem>
            <ToggleGroupItem value="month" aria-label="Month View">
              Month
            </ToggleGroupItem>
            <ToggleGroupItem value="employee" aria-label="Employee View">
              <Users size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List View">
              <List size={16} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Day View */}
      {viewMode === 'day' && (
        <RosterDayView 
          roster={roster || null} 
          isLoading={isLoading || false}
          isOver={isOver}
          readOnly={readOnly}
        />
      )}
      
      {/* 3-Day View */}
      {viewMode === '3day' && (
        <RosterThreeDayView 
          roster={roster || null} 
          selectedDate={selectedDate}
          readOnly={readOnly}
        />
      )}
      
      {/* Week View */}
      {viewMode === 'week' && (
        <RosterWeekView 
          roster={roster || null} 
          selectedDate={selectedDate}
          readOnly={readOnly}
        />
      )}
      
      {/* Month View */}
      {viewMode === 'month' && (
        <RosterMonthView 
          roster={roster || null} 
          selectedDate={selectedDate}
          readOnly={readOnly}
        />
      )}
      
      {/* Employee View */}
      {viewMode === 'employee' && (
        <RosterEmployeeView 
          roster={roster || null} 
          selectedDate={selectedDate}
          onAssignShift={onAssignEmployee}
        />
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <RosterListView 
          roster={roster || null} 
          selectedDate={selectedDate}
          readOnly={readOnly}
        />
      )}
    </div>
  );
};
