import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { RosterGroup } from './RosterGroup';
import { RosterEmployeeView } from './RosterEmployeeView';
import { RosterFilter } from './RosterFilter';
import { AssignShiftDialog } from './AssignShiftDialog';
import { Clock, Filter, Plus, Calendar as CalendarIcon, List, Grid2X2, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Roster, Group, FilterCategory } from '@/api/models/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface RosterCalendarProps {
  selectedDate: Date;
  readOnly?: boolean;
  roster?: Roster;
  isLoading?: boolean;
  onAssignEmployee?: (shiftId: string, employeeId: string) => void;
}

export const RosterCalendar: React.FC<RosterCalendarProps> = ({ 
  selectedDate, 
  readOnly,
  roster,
  isLoading,
  onAssignEmployee
}) => {
  const [viewMode, setViewMode] = useState<'day' | '3day' | 'week' | 'month' | 'list' | 'employee'>('day');
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const { toast } = useToast();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'EMPLOYEE',
    drop: (item: { id: string, name: string }, monitor) => {
      // Handle employee drop
      console.log('Dropped employee:', item);
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
        <div className="mt-0">
          {roster?.groups.map((group) => (
            <RosterGroup 
              key={group.id} 
              group={group}
              readOnly={readOnly}
              isOver={isOver}
            />
          ))}
        </div>
      )}
      
      {/* Employee View */}
      {viewMode === 'employee' && (
        <div className="mt-0">
          <RosterEmployeeView 
            roster={roster || null} 
            selectedDate={selectedDate}
            onAssignShift={onAssignEmployee}
          />
        </div>
      )}
      
      {/* Other view modes */}
      {['3day', 'week', 'month', 'list'].includes(viewMode) && (
        <div className="p-4 bg-black/20 rounded-lg border border-white/10 backdrop-blur-md">
          <h3 className="text-lg font-medium mb-2">{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View</h3>
          <p className="text-white/70">
            This view is under development. Please use the Day or Employee view for now.
          </p>
        </div>
      )}
    </div>
  );
};
