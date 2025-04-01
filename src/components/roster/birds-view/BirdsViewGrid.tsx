
import React, { useState, useMemo } from 'react';
import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Roster, Employee } from '@/api/models/types';
import { ShiftCard } from './ShiftCard';
import { employeeService } from '@/api/services/employeeService';

interface BirdsViewGridProps {
  startDate: Date;
  endDate: Date;
  rosters: Roster[];
  isLoading: boolean;
  searchQuery: string;
}

export const BirdsViewGrid: React.FC<BirdsViewGridProps> = ({ 
  startDate, 
  endDate, 
  rosters, 
  isLoading,
  searchQuery
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  
  // Fetch employees on component mount
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const data = await employeeService.getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoadingEmployees(false);
      }
    };
    
    fetchEmployees();
  }, []);
  
  // Generate array of dates between start and end date
  const dateRange = useMemo(() => 
    eachDayOfInterval({ start: startDate, end: endDate }), 
    [startDate, endDate]
  );
  
  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    
    return employees.filter(employee => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);
  
  // Calculate hours worked and pay for each employee in the date range
  const employeeMetrics = useMemo(() => {
    return filteredEmployees.map(employee => {
      let hoursWorked = 0;
      let totalPay = 0;
      const shifts = [];
      
      // Get all shifts for this employee across all rosters in the date range
      for (const roster of rosters) {
        const rosterDate = new Date(roster.date);
        
        for (const group of roster.groups) {
          for (const subGroup of group.subGroups) {
            for (const shift of subGroup.shifts) {
              if (shift.employeeId === employee.id) {
                // Calculate shift duration
                const [startHour, startMinute] = shift.startTime.split(':').map(Number);
                const [endHour, endMinute] = shift.endTime.split(':').map(Number);
                
                let hours = endHour - startHour;
                let minutes = endMinute - startMinute;
                
                if (minutes < 0) {
                  hours -= 1;
                  minutes += 60;
                }
                
                // Adjust for break if any
                let breakDuration = 0;
                if (shift.breakDuration) {
                  const [breakHour, breakMinute] = shift.breakDuration.split(':').map(Number);
                  breakDuration = breakHour + (breakMinute / 60);
                }
                
                const shiftDuration = hours + (minutes / 60) - breakDuration;
                hoursWorked += shiftDuration;
                
                // Calculate pay based on remuneration level
                const hourlyRate = employee.tier === 'Junior' ? 20 : 
                                   employee.tier === 'Regular' ? 25 : 
                                   employee.tier === 'Senior' ? 30 : 25;
                                   
                const shiftPay = shiftDuration * hourlyRate;
                totalPay += shiftPay;
                
                // Store shift info for rendering
                shifts.push({
                  ...shift,
                  date: rosterDate,
                  group,
                  subGroup
                });
              }
            }
          }
        }
      }
      
      return {
        employee,
        hoursWorked,
        totalPay,
        shifts
      };
    });
  }, [filteredEmployees, rosters]);
  
  if (isLoading || loadingEmployees) {
    return <div className="p-8 flex justify-center"><Skeleton className="w-full h-[400px]" /></div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[800px]">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-black/50 backdrop-blur-sm p-3 border-b border-white/10 text-left min-w-[220px]">
              Employee
            </th>
            {dateRange.map(date => (
              <th key={date.toISOString()} className="p-3 border-b border-white/10 text-center min-w-[180px]">
                <div className="font-medium">{format(date, 'EEE')}</div>
                <div className="text-sm text-white/70">{format(date, 'MMM d')}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employeeMetrics.map(({ employee, hoursWorked, totalPay, shifts }) => (
            <tr key={employee.id} className="hover:bg-white/5">
              <td className="sticky left-0 z-10 bg-black/50 backdrop-blur-sm p-3 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{employee.name}</div>
                    <div className="text-sm text-white/70 truncate">{employee.role}</div>
                    <div className="text-xs flex justify-between mt-1">
                      <span>{hoursWorked.toFixed(1)} hrs</span>
                      <span>${totalPay.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </td>
              
              {dateRange.map(date => {
                // Find shifts for this employee on this date
                const dayShifts = shifts.filter(shift => 
                  isSameDay(shift.date, date)
                );
                
                return (
                  <td key={date.toISOString()} className="p-2 border-b border-white/10 align-top">
                    <div className="space-y-2">
                      {dayShifts.map((shift, index) => (
                        <ShiftCard 
                          key={`${shift.id}-${index}`}
                          shift={shift}
                          group={shift.group}
                          subGroup={shift.subGroup}
                        />
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
