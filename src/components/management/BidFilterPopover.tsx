
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { FilterX, CalendarDays, Filter } from 'lucide-react';
import { departments, subDepartments, roles } from './types/bid-types';
import { Switch } from '@/components/ui/switch';

interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  department?: string;
  subDepartment?: string;
  role?: string;
  status?: string;
  isAssigned?: boolean;
  isDraft?: boolean;
  minHours?: number;
  maxHours?: number;
  remunerationLevel?: string;
}

interface BidFilterPopoverProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  activeFilterCount: number;
}

const BidFilterPopover: React.FC<BidFilterPopoverProps> = ({ filters, onFilterChange, activeFilterCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  
  // Status options
  const statusOptions = ['All Statuses', 'Open', 'Offered', 'Filled', 'Draft'];
  const remunerationLevels = ['All Levels', 'GOLD', 'SILVER', 'BRONZE'];
  
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };
  
  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {};
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    setIsOpen(false);
  };
  
  const updateLocalFilter = (key: keyof FilterOptions, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed relative">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Filter Shifts</h4>
            <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 px-2 text-xs">
              <FilterX className="mr-2 h-3 w-3" />
              Reset Filters
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date-range">Date Range</Label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <Label className="text-xs text-muted-foreground">From</Label>
                <Calendar
                  mode="single"
                  selected={localFilters.startDate}
                  onSelect={(date) => updateLocalFilter('startDate', date)}
                  disabled={(date) => localFilters.endDate ? date > localFilters.endDate : false}
                  initialFocus
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">To</Label>
                <Calendar
                  mode="single"
                  selected={localFilters.endDate}
                  onSelect={(date) => updateLocalFilter('endDate', date)}
                  disabled={(date) => localFilters.startDate ? date < localFilters.startDate : false}
                  initialFocus
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Department</Label>
              <select 
                className="border p-2 rounded-md" 
                value={localFilters.department || 'All Departments'}
                onChange={(e) => updateLocalFilter('department', e.target.value !== 'All Departments' ? e.target.value : undefined)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label>Sub-Department</Label>
              <select 
                className="border p-2 rounded-md" 
                value={localFilters.subDepartment || 'All Sub-departments'}
                onChange={(e) => updateLocalFilter('subDepartment', e.target.value !== 'All Sub-departments' ? e.target.value : undefined)}
                disabled={!localFilters.department || localFilters.department === 'All Departments'}
              >
                {subDepartments.map(subDept => (
                  <option key={subDept} value={subDept}>{subDept}</option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label>Role</Label>
              <select 
                className="border p-2 rounded-md" 
                value={localFilters.role || 'All Roles'}
                onChange={(e) => updateLocalFilter('role', e.target.value !== 'All Roles' ? e.target.value : undefined)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label>Status</Label>
              <select 
                className="border p-2 rounded-md" 
                value={localFilters.status || 'All Statuses'}
                onChange={(e) => updateLocalFilter('status', e.target.value !== 'All Statuses' ? e.target.value : undefined)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label>Remuneration Level</Label>
              <select 
                className="border p-2 rounded-md" 
                value={localFilters.remunerationLevel || 'All Levels'}
                onChange={(e) => updateLocalFilter('remunerationLevel', e.target.value !== 'All Levels' ? e.target.value : undefined)}
              >
                {remunerationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label>Net Hours Range (0-12h)</Label>
              <div className="px-2">
                <Slider 
                  defaultValue={[localFilters.minHours || 0, localFilters.maxHours || 12]} 
                  max={12} 
                  step={0.5} 
                  onValueChange={([min, max]) => {
                    updateLocalFilter('minHours', min);
                    updateLocalFilter('maxHours', max);
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{localFilters.minHours || 0}h</span>
                  <span>{localFilters.maxHours || 12}h</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={!!localFilters.isAssigned} 
                onCheckedChange={(checked) => updateLocalFilter('isAssigned', checked)}
                id="assigned-filter"
              />
              <Label htmlFor="assigned-filter">Show only assigned shifts</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={!!localFilters.isDraft} 
                onCheckedChange={(checked) => updateLocalFilter('isDraft', checked)}
                id="draft-filter"
              />
              <Label htmlFor="draft-filter">Show only draft shifts</Label>
            </div>
            
          </div>
          
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BidFilterPopover;
