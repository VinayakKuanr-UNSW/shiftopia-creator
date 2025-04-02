
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { departments, subDepartments, roles } from './types/bid-types';

interface BidFilterPopoverProps {
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  subDepartmentFilter: string;
  setSubDepartmentFilter: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
}

const BidFilterPopover: React.FC<BidFilterPopoverProps> = ({
  departmentFilter,
  setDepartmentFilter,
  subDepartmentFilter, 
  setSubDepartmentFilter,
  roleFilter,
  setRoleFilter
}) => {
  const { toast } = useToast();

  const handleClearFilters = () => {
    setDepartmentFilter('All Departments');
    setSubDepartmentFilter('All Sub-departments');
    setRoleFilter('All Roles');
  };

  const handleSavePreset = () => {
    toast({
      title: "Filter Preset Saved",
      description: "Your filter configuration has been saved."
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-white/10"
        >
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-slate-900 border-white/10">
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">Department</h4>
            <div className="flex flex-wrap gap-2">
              {departments.map(dept => (
                <Button 
                  key={dept}
                  variant={departmentFilter === dept ? "outline" : "ghost"} 
                  size="sm"
                  className={departmentFilter === dept ? "bg-white/5 border-white/10" : ""}
                  onClick={() => setDepartmentFilter(dept)}
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium">Sub-Department</h4>
            <div className="flex flex-wrap gap-2">
              {subDepartments.map(subDept => (
                <Button 
                  key={subDept}
                  variant={subDepartmentFilter === subDept ? "outline" : "ghost"} 
                  size="sm"
                  className={subDepartmentFilter === subDept ? "bg-white/5 border-white/10" : ""}
                  onClick={() => setSubDepartmentFilter(subDept)}
                >
                  {subDept}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium">Role</h4>
            <div className="flex flex-wrap gap-2">
              {roles.map(role => (
                <Button 
                  key={role}
                  variant={roleFilter === role ? "outline" : "ghost"} 
                  size="sm"
                  className={roleFilter === role ? "bg-white/5 border-white/10" : ""}
                  onClick={() => setRoleFilter(role)}
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white/10"
              onClick={handleClearFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={handleSavePreset}
            >
              Save as Preset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BidFilterPopover;
