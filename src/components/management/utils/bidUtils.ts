
import { Bid } from '@/api/models/types';
import { BidWithEmployee } from '../types/bid-types';

// Sample shift details for demonstration (in a real app, these would come from an API)
const shiftDetailsMap: Record<string, any> = {
  'shift-001': {
    id: 'shift-001',
    date: '2023-04-10',
    startTime: '05:45',
    endTime: '14:00',
    netLength: '8',
    paidBreakDuration: '30m',
    unpaidBreakDuration: '0m',
    department: 'Convention Centre',
    subDepartment: 'AM Base',
    role: 'Team Leader',
    remunerationLevel: 'GOLD',
    status: 'Open',
    isDraft: false,
    assignedEmployee: null
  },
  'shift-002': {
    id: 'shift-002',
    date: '2023-04-10',
    startTime: '06:15',
    endTime: '14:00',
    netLength: '7.75',
    paidBreakDuration: '30m',
    unpaidBreakDuration: '0m',
    department: 'Convention Centre',
    subDepartment: 'AM Base',
    role: 'TM3',
    remunerationLevel: 'SILVER',
    status: 'Open',
    isDraft: false,
    assignedEmployee: null
  },
  'shift-003': {
    id: 'shift-003',
    date: '2023-04-11',
    startTime: '11:30',
    endTime: '16:30',
    netLength: '5',
    paidBreakDuration: '15m',
    unpaidBreakDuration: '15m',
    department: 'Convention Centre',
    subDepartment: 'AM Assist',
    role: 'TM2',
    remunerationLevel: 'BRONZE',
    status: 'Open',
    isDraft: true,
    assignedEmployee: null
  },
  'shift-004': {
    id: 'shift-004',
    date: '2023-04-12',
    startTime: '08:00',
    endTime: '16:00',
    netLength: '8',
    paidBreakDuration: '30m',
    unpaidBreakDuration: '30m',
    department: 'Exhibition Centre',
    subDepartment: 'Bump-In',
    role: 'Team Leader',
    remunerationLevel: 'GOLD',
    status: 'Filled',
    isDraft: false,
    assignedEmployee: 'Jane Smith'
  },
  'shift-005': {
    id: 'shift-005',
    date: '2023-04-12',
    startTime: '08:00',
    endTime: '16:00',
    netLength: '8',
    paidBreakDuration: '30m',
    unpaidBreakDuration: '30m',
    department: 'Theatre',
    subDepartment: 'AM Floaters',
    role: 'Supervisor',
    remunerationLevel: 'GOLD',
    status: 'Open',
    isDraft: false,
    assignedEmployee: null
  }
};

export const processBidsWithDetails = (bids: Bid[], employees: any[]): BidWithEmployee[] => {
  return bids.map(bid => {
    const employee = employees.find(e => e.id === bid.employeeId);
    
    // Get shift details from our map (in a real app, this would be from the API)
    const shiftDetails = shiftDetailsMap[bid.shiftId] || {
      id: bid.shiftId,
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      netLength: '8',
      paidBreakDuration: '30m',
      unpaidBreakDuration: '30m',
      department: 'Unknown Department',
      subDepartment: 'Unknown Sub-department',
      role: 'Unknown Role',
      remunerationLevel: 'UNSPECIFIED',
      status: 'Open',
      isDraft: false,
      assignedEmployee: null
    };
    
    return {
      ...bid,
      employee,
      shiftDetails
    };
  });
};

export const getApplicantsForShift = (bids: BidWithEmployee[], shiftId: string, sortByScore: boolean = false): BidWithEmployee[] => {
  const shiftsApplicants = bids.filter(bid => bid.shiftId === shiftId);
  
  if (sortByScore) {
    // Sort by employee tier or suitability score
    return shiftsApplicants.sort((a, b) => {
      const scoreA = a.employee?.tier || 0;
      const scoreB = b.employee?.tier || 0;
      return scoreB - scoreA; // Higher score first
    });
  }
  
  // Sort by timestamp (earlier bids first)
  return shiftsApplicants.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};
