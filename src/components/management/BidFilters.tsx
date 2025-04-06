
import React from 'react';
import { Search, Filter, SlidersHorizontal, CalendarDays, Building, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface BidFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  subDepartmentFilter: string;
  setSubDepartmentFilter: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  showDrafts: boolean;
  setShowDrafts: (value: boolean) => void;
  showUnassigned: boolean;
  setShowUnassigned: (value: boolean) => void;
  hoursRange: [number, number];
  setHoursRange: (range: [number, number]) => void;
  remunerationLevelFilter: string;
  setRemunerationLevelFilter: (value: string) => void;
}

const BidFilters: React.FC<BidFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter,
  subDepartmentFilter,
  setSubDepartmentFilter,
  roleFilter,
  setRoleFilter,
  sortOption,
  setSortOption,
  dateRange,
  setDateRange,
  showDrafts,
  setShowDrafts,
  showUnassigned,
  setShowUnassigned,
  hoursRange,
  setHoursRange,
  remunerationLevelFilter,
  setRemunerationLevelFilter
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 sticky top-0 z-10 bg-black bg-opacity-80 pt-4 pb-4 backdrop-blur-sm">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
        <Input
          type="text"
          placeholder="Search bids..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/5 border-white/10 pl-9 text-white"
        />
      </div>

      <div className="flex gap-2">
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="bg-white/5 border-white/10 w-full">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10">
            <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
            <SelectItem value="date-desc">Date (Newest First)</SelectItem>
            <SelectItem value="time-asc">Start Time (Earliest)</SelectItem>
            <SelectItem value="time-desc">Start Time (Latest)</SelectItem>
            <SelectItem value="hours-asc">Net Hours (Lowest)</SelectItem>
            <SelectItem value="hours-desc">Net Hours (Highest)</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="role">Role (A-Z)</SelectItem>
            <SelectItem value="department">Department (A-Z)</SelectItem>
          </SelectContent>
        </Select>
        
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          className="w-auto"
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-white/5 border-white/10 w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Offered">Offered</SelectItem>
            <SelectItem value="Filled">Filled</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 px-4 py-2 border-white/10">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-slate-900 border-white/10">
            <div className="space-y-4">
              <h3 className="font-medium mb-2">Filter Options</h3>
              
              <div className="space-y-2">
                <Label className="text-sm">Department</Label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="All Departments">All Departments</SelectItem>
                    <SelectItem value="Convention Centre">Convention Centre</SelectItem>
                    <SelectItem value="Exhibition Centre">Exhibition Centre</SelectItem>
                    <SelectItem value="Theatre">Theatre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Sub-Department</Label>
                <Select value={subDepartmentFilter} onValueChange={setSubDepartmentFilter}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select sub-department" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="All Sub-departments">All Sub-departments</SelectItem>
                    <SelectItem value="AM Base">AM Base</SelectItem>
                    <SelectItem value="PM Base">PM Base</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="All Roles">All Roles</SelectItem>
                    <SelectItem value="Team Leader">Team Leader</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="TM3">TM3</SelectItem>
                    <SelectItem value="TM2">TM2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Remuneration Level</Label>
                <Select value={remunerationLevelFilter} onValueChange={setRemunerationLevelFilter}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="All">All Levels</SelectItem>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                    <SelectItem value="5">Level 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Net Hours: {hoursRange[0]} - {hoursRange[1]} hours</Label>
                <Slider 
                  value={hoursRange} 
                  min={1} 
                  max={12} 
                  step={0.5} 
                  onValueChange={(value) => setHoursRange(value as [number, number])} 
                  className="mt-2 py-4"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm" htmlFor="show-drafts">Show Drafts</Label>
                <Switch 
                  id="show-drafts" 
                  checked={showDrafts} 
                  onCheckedChange={setShowDrafts}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm" htmlFor="show-unassigned">Show Unassigned Only</Label>
                <Switch 
                  id="show-unassigned" 
                  checked={showUnassigned} 
                  onCheckedChange={setShowUnassigned}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BidFilters;
