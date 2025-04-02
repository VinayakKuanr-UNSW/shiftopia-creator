
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface EmployeeSelectorProps {
  onSelect: (employeeId: string, isAdmin?: boolean) => void;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({ onSelect }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('auth_users_view')
          .select('id, name, email, role, department')
          .order('name');

        if (error) throw error;
        
        setEmployees(data || []);
        setFilteredEmployees(data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load employees: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term
  useEffect(() => {
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  // Handle employee selection
  const handleSelect = () => {
    if (!selectedEmployee) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive"
      });
      return;
    }
    
    onSelect(selectedEmployee, isAdmin);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="search" className="text-sm font-medium">
          Search Employees
        </label>
        <Input
          id="search"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Select Employee</label>
        {isLoading ? (
          <div className="space-y-2 mt-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <ScrollArea className="h-52 mt-1 border rounded-md">
            <div className="p-2 space-y-1">
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No employees found
                </div>
              ) : (
                filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                      selectedEmployee === employee.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedEmployee(employee.id)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.email} • {employee.role}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="admin"
          checked={isAdmin}
          onCheckedChange={(checked) => setIsAdmin(checked === true)}
        />
        <label
          htmlFor="admin"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Add as group admin
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onSelect('', false)}>
          Cancel
        </Button>
        <Button onClick={handleSelect} disabled={!selectedEmployee}>
          Add to Group
        </Button>
      </div>
    </div>
  );
};

export default EmployeeSelector;
