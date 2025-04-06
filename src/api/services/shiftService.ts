import { Shift, ShiftDetails } from '../models/types';
import { supabase } from '@/integrations/supabase/client';

// Local storage for shifts - in a real app this would be a database
let shifts: Record<string, ShiftDetails> = {
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

export const shiftService = {
  getAllShifts: async (): Promise<ShiftDetails[]> => {
    try {
      // First try to get shifts from Supabase
      const { data, error } = await supabase
        .from('shifts')
        .select('*, employees(name)');
      
      if (error) {
        console.error('Error fetching shifts from Supabase:', error);
        // Fall back to mock data
        return Promise.resolve(Object.values(shifts));
      }
      
      // Map Supabase data to our ShiftDetails model
      if (data && data.length > 0) {
        return data.map(shift => ({
          id: shift.id,
          date: shift.shift_date,
          startTime: shift.shift_time,
          endTime: calculateEndTime(shift.shift_time, shift.net_length),
          netLength: shift.net_length || '0',
          paidBreakDuration: shift.paid_break_duration || '0m',
          unpaidBreakDuration: shift.unpaid_break_duration || '0m',
          department: shift.department,
          subDepartment: shift.sub_department,
          role: shift.role,
          remunerationLevel: shift.remuneration_level,
          status: shift.status,
          isDraft: shift.is_draft || false,
          assignedEmployee: shift.employees?.name || null
        }));
      }
      
      // Fall back to mock data
      return Promise.resolve(Object.values(shifts));
    } catch (e) {
      console.error('Error in getAllShifts:', e);
      return Promise.resolve(Object.values(shifts));
    }
  },
  
  getShiftById: async (id: string): Promise<ShiftDetails | null> => {
    try {
      // First try to get shift from Supabase
      const { data, error } = await supabase
        .from('shifts')
        .select('*, employees(name)')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error(`Error fetching shift with ID ${id} from Supabase:`, error);
        // Fall back to mock data
        return Promise.resolve(shifts[id] || null);
      }
      
      // Map Supabase data to our ShiftDetails model
      if (data) {
        return {
          id: data.id,
          date: data.shift_date,
          startTime: data.shift_time,
          endTime: calculateEndTime(data.shift_time, data.net_length),
          netLength: data.net_length || '0',
          paidBreakDuration: data.paid_break_duration || '0m',
          unpaidBreakDuration: data.unpaid_break_duration || '0m',
          department: data.department,
          subDepartment: data.sub_department,
          role: data.role,
          remunerationLevel: data.remuneration_level,
          status: data.status,
          isDraft: data.is_draft || false,
          assignedEmployee: data.employees?.name || null
        };
      }
      
      // Fall back to mock data
      return Promise.resolve(shifts[id] || null);
    } catch (e) {
      console.error(`Error in getShiftById for ID ${id}:`, e);
      return Promise.resolve(shifts[id] || null);
    }
  },
  
  getShiftsByDateRange: async (startDate: string, endDate: string): Promise<ShiftDetails[]> => {
    try {
      // First try to get shifts from Supabase
      const { data, error } = await supabase
        .from('shifts')
        .select('*, employees(name)')
        .gte('shift_date', startDate)
        .lte('shift_date', endDate);
        
      if (error) {
        console.error(`Error fetching shifts for date range ${startDate} to ${endDate} from Supabase:`, error);
        // Fall back to filtering mock data
        const filteredShifts = Object.values(shifts).filter(
          shift => shift.date >= startDate && shift.date <= endDate
        );
        return Promise.resolve(filteredShifts);
      }
      
      // Map Supabase data to our ShiftDetails model
      if (data && data.length > 0) {
        return data.map(shift => ({
          id: shift.id,
          date: shift.shift_date,
          startTime: shift.shift_time,
          endTime: calculateEndTime(shift.shift_time, shift.net_length),
          netLength: shift.net_length || '0',
          paidBreakDuration: shift.paid_break_duration || '0m',
          unpaidBreakDuration: shift.unpaid_break_duration || '0m',
          department: shift.department,
          subDepartment: shift.sub_department,
          role: shift.role,
          remunerationLevel: shift.remuneration_level,
          status: shift.status,
          isDraft: shift.is_draft || false,
          assignedEmployee: shift.employees?.name || null
        }));
      }
      
      // Fall back to filtering mock data
      const filteredShifts = Object.values(shifts).filter(
        shift => shift.date >= startDate && shift.date <= endDate
      );
      return Promise.resolve(filteredShifts);
    } catch (e) {
      console.error(`Error in getShiftsByDateRange for range ${startDate} to ${endDate}:`, e);
      // Fall back to filtering mock data
      const filteredShifts = Object.values(shifts).filter(
        shift => shift.date >= startDate && shift.date <= endDate
      );
      return Promise.resolve(filteredShifts);
    }
  },
  
  getShiftsByDepartment: async (department: string): Promise<ShiftDetails[]> => {
    try {
      // First try to get shifts from Supabase
      const { data, error } = await supabase
        .from('shifts')
        .select('*, employees(name)')
        .eq('department', department);
        
      if (error) {
        console.error(`Error fetching shifts for department ${department} from Supabase:`, error);
        // Fall back to filtering mock data
        const filteredShifts = Object.values(shifts).filter(
          shift => shift.department === department
        );
        return Promise.resolve(filteredShifts);
      }
      
      // Map Supabase data to our ShiftDetails model
      if (data && data.length > 0) {
        return data.map(shift => ({
          id: shift.id,
          date: shift.shift_date,
          startTime: shift.shift_time,
          endTime: calculateEndTime(shift.shift_time, shift.net_length),
          netLength: shift.net_length || '0',
          paidBreakDuration: shift.paid_break_duration || '0m',
          unpaidBreakDuration: shift.unpaid_break_duration || '0m',
          department: shift.department,
          subDepartment: shift.sub_department,
          role: shift.role,
          remunerationLevel: shift.remuneration_level,
          status: shift.status,
          isDraft: shift.is_draft || false,
          assignedEmployee: shift.employees?.name || null
        }));
      }
      
      // Fall back to filtering mock data
      const filteredShifts = Object.values(shifts).filter(
        shift => shift.department === department
      );
      return Promise.resolve(filteredShifts);
    } catch (e) {
      console.error(`Error in getShiftsByDepartment for department ${department}:`, e);
      // Fall back to filtering mock data
      const filteredShifts = Object.values(shifts).filter(
        shift => shift.department === department
      );
      return Promise.resolve(filteredShifts);
    }
  },
  
  updateShiftStatus: async (id: string, status: string, assignedEmployee?: string): Promise<ShiftDetails | null> => {
    try {
      // First try to update shift in Supabase
      const updateData: Record<string, any> = { status };
      if (assignedEmployee) {
        updateData.assigned_employee = assignedEmployee;
      }
      
      const { data, error } = await supabase
        .from('shifts')
        .update(updateData)
        .eq('id', id)
        .select('*, employees(name)')
        .single();
        
      if (error) {
        console.error(`Error updating shift with ID ${id} in Supabase:`, error);
        // Fall back to updating mock data
        if (!shifts[id]) return Promise.resolve(null);
        
        shifts[id] = {
          ...shifts[id],
          status,
          assignedEmployee: assignedEmployee || shifts[id].assignedEmployee
        };
        
        return Promise.resolve(shifts[id]);
      }
      
      // Map updated Supabase data to our ShiftDetails model
      if (data) {
        const updated = {
          id: data.id,
          date: data.shift_date,
          startTime: data.shift_time,
          endTime: calculateEndTime(data.shift_time, data.net_length),
          netLength: data.net_length || '0',
          paidBreakDuration: data.paid_break_duration || '0m',
          unpaidBreakDuration: data.unpaid_break_duration || '0m',
          department: data.department,
          subDepartment: data.sub_department,
          role: data.role,
          remunerationLevel: data.remuneration_level,
          status: data.status,
          isDraft: data.is_draft || false,
          assignedEmployee: data.employees?.name || null
        };
        
        // Update mock data to keep it in sync
        shifts[id] = updated;
        
        return Promise.resolve(updated);
      }
      
      // Fall back to updating mock data
      if (!shifts[id]) return Promise.resolve(null);
      
      shifts[id] = {
        ...shifts[id],
        status,
        assignedEmployee: assignedEmployee || shifts[id].assignedEmployee
      };
      
      return Promise.resolve(shifts[id]);
    } catch (e) {
      console.error(`Error in updateShiftStatus for ID ${id}:`, e);
      // Fall back to updating mock data
      if (!shifts[id]) return Promise.resolve(null);
      
      shifts[id] = {
        ...shifts[id],
        status,
        assignedEmployee: assignedEmployee || shifts[id].assignedEmployee
      };
      
      return Promise.resolve(shifts[id]);
    }
  }
};

// Helper function to calculate end time based on start time and shift length
function calculateEndTime(startTime: string, hours: string | number): string {
  try {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const hoursNum = typeof hours === 'string' ? parseFloat(hours) : hours;
    
    const totalMinutes = startHour * 60 + startMinute + hoursNum * 60;
    const endHour = Math.floor(totalMinutes / 60) % 24;
    const endMinute = Math.floor(totalMinutes % 60);
    
    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  } catch (e) {
    console.error('Error calculating end time:', e);
    return '00:00';
  }
}
