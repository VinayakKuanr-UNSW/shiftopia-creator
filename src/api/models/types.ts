
// Types for all data models used in the application

export type Role = 'Team Leader' | 'TM3' | 'TM2';
export type RemunerationLevel = 'GOLD' | 'SILVER' | 'BRONZE';
export type ShiftStatus = 'Assigned' | 'Completed' | 'Cancelled' | 'Swapped' | 'No-Show';
export type DepartmentName = 'Convention Centre' | 'Exhibition Centre' | 'Theatre' | 'IT';
export type DepartmentColor = 'blue' | 'green' | 'red' | 'purple';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  tier: RemunerationLevel;
  avatar?: string;
}

export interface Shift {
  id: string;
  role: Role;
  startTime: string;
  endTime: string;
  breakDuration: string;
  remunerationLevel: RemunerationLevel;
  employeeId?: string;
  employee?: Employee;
  status?: ShiftStatus;
  actualStartTime?: string;
  actualEndTime?: string;
  notes?: string;
}

export interface SubGroup {
  id: number;
  name: string;
  shifts: Shift[];
}

export interface Group {
  id: number;
  name: DepartmentName;
  color: DepartmentColor;
  subGroups: SubGroup[];
}

export interface Template {
  id: number;
  name: string;
  description?: string;
  groups: Group[];
  createdAt: string;
  updatedAt: string;
}

export interface Roster {
  id: number;
  date: string;
  templateId: number;
  groups: Group[];
  createdAt: string;
  updatedAt: string;
}

export interface Timesheet {
  id: number;
  date: string;
  rosterId: number;
  groups: Group[];
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: string;
  employeeId: string;
  shiftId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  notes?: string;
}
