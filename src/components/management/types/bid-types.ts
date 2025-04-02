
import { Bid, Employee } from '@/api/models/types';

export type BidWithEmployee = Bid & { 
  employee?: Employee,
  shiftDetails?: {
    role: string;
    startTime: string;
    endTime: string;
    department: string;
    subDepartment?: string;
    group?: string;
    subGroup?: string;
    remunerationLevel: string;
    breakDuration: string;
  }
};

export type GroupedBids = {
  [date: string]: BidWithEmployee[];
};

export const departments = ['All Departments', 'Convention Centre', 'Exhibition Centre', 'Theatre'];
export const subDepartments = ['All Sub-departments', 'AM Base', 'PM Base', 'Floaters', 'Assist', 'Bump-In'];
export const roles = ['All Roles', 'Team Leader', 'Supervisor', 'TM3', 'TM2', 'Coordinator'];
