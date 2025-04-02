
import { Bid, Employee } from '@/api/models/types';
import { BidWithEmployee } from '../types/bid-types';

export const processBidsWithDetails = (bids: Bid[], employees: Employee[]): BidWithEmployee[] => {
  return bids.map(bid => {
    const employee = employees.find(emp => emp.id === bid.employeeId);
    
    const shiftIdNum = parseInt(bid.shiftId.replace(/\D/g, ''), 10) || 0;
    const department = shiftIdNum % 3 === 0 ? 'Convention Centre' : 
                      shiftIdNum % 3 === 1 ? 'Exhibition Centre' : 'Theatre';
    const subDep = ['AM Base', 'PM Base', 'Floaters', 'Assist', 'Bump-In'][shiftIdNum % 5];
    const role = ['Team Leader', 'Supervisor', 'TM3', 'TM2', 'Coordinator'][shiftIdNum % 5];
    
    const baseHourNum = 8 + (shiftIdNum % 4);
    const endHourNum = 16 + (shiftIdNum % 4);
    
    const baseHour = `${baseHourNum}:00`;
    const endHour = `${endHourNum}:00`;
    
    const remunerationValue = (shiftIdNum % 2 === 0) ? 'GOLD' : 'SILVER';
    
    // Fix: Directly use a string value instead of arithmetic operations with strings
    const breakDurationValue = "30 min";
    
    return {
      ...bid,
      employee,
      shiftDetails: {
        role,
        startTime: baseHour,
        endTime: endHour,
        department,
        subDepartment: subDep,
        group: department,
        subGroup: subDep,
        remunerationLevel: remunerationValue,
        breakDuration: breakDurationValue
      }
    };
  });
};

export const getApplicantsForShift = (bids: BidWithEmployee[], shiftId: string, sortByScore: boolean): BidWithEmployee[] => {
  return bids
    .filter(bid => bid.shiftId === shiftId)
    .sort((a, b) => {
      if (sortByScore) {
        // Convert tier to number for comparison or use 0 if undefined
        const scoreA = typeof a.employee?.tier === 'number' ? a.employee.tier : 
                     a.employee?.tier ? parseInt(a.employee.tier, 10) || 0 : 0;
        const scoreB = typeof b.employee?.tier === 'number' ? b.employee.tier : 
                     b.employee?.tier ? parseInt(b.employee.tier, 10) || 0 : 0;
        return scoreB - scoreA;
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });
};

