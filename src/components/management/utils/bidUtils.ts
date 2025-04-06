
import { Bid, Employee } from '@/api/models/types';
import { BidWithEmployee, ShiftDetails } from '../types/bid-types';
import { shiftService } from '@/api/services/shiftService';

// Process bids with employee and shift details
export const processBidsWithDetails = async (bids: Bid[], employees: Employee[]): Promise<BidWithEmployee[]> => {
  const processedBids: BidWithEmployee[] = [];

  // Process each bid one by one
  for (const bid of bids) {
    const employee = employees.find(e => e.id === bid.employeeId);
    
    // Get shift details from the API
    let shiftDetails;
    try {
      shiftDetails = await shiftService.getShiftById(bid.shiftId);
    } catch (error) {
      console.error(`Error fetching details for shift ${bid.shiftId}:`, error);
      
      // If API fails, use fallback data
      shiftDetails = {
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
    }
    
    processedBids.push({
      ...bid,
      employee,
      shiftDetails
    });
  }
  
  return processedBids;
};

export const getApplicantsForShift = (bids: BidWithEmployee[], shiftId: string, sortByScore: boolean = false): BidWithEmployee[] => {
  const shiftsApplicants = bids.filter(bid => bid.shiftId === shiftId);
  
  if (sortByScore) {
    // Sort by employee tier or suitability score
    return shiftsApplicants.sort((a, b) => {
      // Convert tier to number for comparison
      const scoreA = Number(a.employee?.tier || 0);
      const scoreB = Number(b.employee?.tier || 0);
      return scoreB - scoreA; // Higher score first
    });
  }
  
  // Sort by timestamp (earlier bids first)
  return shiftsApplicants.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

// Get suitable tag for applicant based on their profile
export const getApplicantTag = (bid: BidWithEmployee, allBids: BidWithEmployee[]): { text: string; color: string; tooltip?: string } | null => {
  // No tag if no employee
  if (!bid.employee) return null;
  
  // First applicant tag
  const isFirst = allBids
    .filter(b => b.shiftId === bid.shiftId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]?.id === bid.id;
  
  if (isFirst) {
    return {
      text: 'First to Apply',
      color: 'bg-blue-500',
      tooltip: 'This employee was the first to apply for this shift'
    };
  }
  
  // Highly qualified tag (GOLD tier)
  if (bid.employee?.tier === 'GOLD' || Number(bid.employee?.tier) >= 8) {
    return {
      text: 'Highly Qualified',
      color: 'bg-amber-500',
      tooltip: 'This employee has a high qualification level'
    };
  }
  
  // For employees with multiple bids on different shifts
  const employeeOtherBids = allBids
    .filter(b => 
      b.employeeId === bid.employeeId && 
      b.shiftId !== bid.shiftId &&
      b.status !== 'Rejected'
    );
  
  if (employeeOtherBids.length > 0) {
    // If they have another bid with 'Approved' status
    const hasApprovedBid = employeeOtherBids.some(b => b.status === 'Approved');
    
    if (hasApprovedBid) {
      return {
        text: 'Has Approved Shift',
        color: 'bg-orange-500',
        tooltip: 'This employee has already been approved for another shift'
      };
    }
    
    // Multiple pending applications
    return {
      text: `${employeeOtherBids.length + 1} Applications`,
      color: 'bg-purple-500', 
      tooltip: 'This employee has applied to multiple shifts'
    };
  }
  
  // Default, no special tag
  return null;
};

// Check if an employee has potential scheduling conflicts
export const checkApplicantConflicts = (bid: BidWithEmployee, allBids: BidWithEmployee[]): { hasConflict: boolean; conflictReason?: string } => {
  // No conflict check if details are missing
  if (!bid.employee || !bid.shiftDetails) {
    return { hasConflict: false };
  }
  
  // Get all approved bids for this employee
  const approvedBids = allBids.filter(b => 
    b.employeeId === bid.employeeId && 
    b.status === 'Approved' &&
    b.shiftDetails
  );
  
  // Check for date/time conflicts
  for (const approvedBid of approvedBids) {
    if (!approvedBid.shiftDetails) continue;
    
    // Same date conflict check
    if (approvedBid.shiftDetails.date === bid.shiftDetails.date) {
      // Convert times to comparable format (minutes since midnight)
      const getMinutes = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const currentShiftStart = getMinutes(bid.shiftDetails.startTime);
      const currentShiftEnd = getMinutes(bid.shiftDetails.endTime);
      const approvedShiftStart = getMinutes(approvedBid.shiftDetails.startTime);
      const approvedShiftEnd = getMinutes(approvedBid.shiftDetails.endTime);
      
      // Check for overlap (one shift starts before the other ends)
      if (
        (currentShiftStart <= approvedShiftEnd && currentShiftEnd >= approvedShiftStart) ||
        (approvedShiftStart <= currentShiftEnd && approvedShiftEnd >= currentShiftStart)
      ) {
        return { 
          hasConflict: true,
          conflictReason: `Time conflict with an approved shift on ${approvedBid.shiftDetails.date}`
        };
      }
    }
  }
  
  return { hasConflict: false };
};

// Format shifts for display
export const formatShiftTime = (startTime: string, endTime: string): string => {
  try {
    // Parse hours and minutes
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    // Create Date objects for formatting
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0);
    
    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0);
    
    // Format with AM/PM
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    return `${startDate.toLocaleTimeString('en-US', options)} – ${endDate.toLocaleTimeString('en-US', options)}`;
  } catch (error) {
    console.error('Error formatting shift time:', error);
    return `${startTime} - ${endTime}`;
  }
};

// Calculate net hours from time strings
export const calculateNetHours = (start: string, end: string, breakMinutes: number = 0): string => {
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);
  
  let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes) - breakMinutes;
  
  // Handle overnight shifts
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

// Parse a break duration string like "30m" into minutes
export const parseBreakDuration = (duration: string | undefined): number => {
  if (!duration) return 0;
  
  const match = duration.match(/(\d+)m/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  return 0;
};

// Get display color for shift status
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-green-500';
    case 'offered':
    case 'approved':
      return 'bg-blue-500';
    case 'filled':
    case 'confirmed':
      return 'bg-purple-500';
    case 'cancelled':
    case 'rejected':
      return 'bg-red-500';
    case 'draft':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};
