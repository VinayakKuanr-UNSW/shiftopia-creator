
// Template interfaces
export interface Template {
  id: number;
  name: string;
  description?: string;
  groups: Group[];
  createdAt: string;
  updatedAt: string;
  department_id?: number;
  sub_department_id?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export interface DBTemplate {
  template_id: number;
  name: string;
  description?: string;
  groups?: Group[] | string;
  created_at: string;
  updated_at: string;
  department_id: number;
  sub_department_id: number;
  start_date: string;
  end_date: string;
  status?: string;
}

export interface Group {
  id: number;
  name: DepartmentName;
  color: DepartmentColor;
  subGroups: SubGroup[];
}

export interface SubGroup {
  id: number;
  name: string;
  shifts: Shift[];
}

// Shift types
export interface Shift {
  id: string;
  startTime: string;
  endTime: string;
  role: Role;
  requiredSkills?: string[];
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  status?: ShiftStatus;
  notes?: string;
  remunerationLevel?: RemunerationLevel;
  breakDuration?: string;
}

export type ShiftStatus = 'scheduled' | 'completed' | 'in-progress' | 'cancelled' | 'no-show';
export type Role = 'Manager' | 'Supervisor' | 'Team Leader' | 'Staff' | 'Casual' | 'Contractor';
export type RemunerationLevel = 1 | 2 | 3 | 4 | 5;

// Department types
export type DepartmentName = 'Convention Centre' | 'Exhibition Centre' | 'Theatre' | 'IT' | 'Darling Harbor Theatre' | string;
export type DepartmentColor = 'blue' | 'green' | 'red' | 'purple' | 'sky' | string;

// Roster types
export interface Roster {
  id: number;
  date: string;
  groups: Group[];
  status: 'draft' | 'published' | 'approved';
  createdAt: string;
  updatedAt: string;
}

// Employee types
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  role?: Role;
  remunerationLevel?: RemunerationLevel;
  status?: 'active' | 'inactive' | 'on-leave';
  availability?: Record<string, TimeSlot[]>;
}

// Timesheet types
export interface Timesheet {
  id: number;
  date: string;
  groups: Group[];
  totalHours: number;
  totalPay: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Bid types
export interface Bid {
  id: string;
  shiftId: string;
  employeeId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

// Availability types
export interface DayAvailability {
  date: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: AvailabilityStatus;
}

export type AvailabilityStatus = 'available' | 'unavailable' | 'preferred';

export interface AvailabilityPreset {
  id: string;
  name: string;
  pattern: Record<string, TimeSlot[]>;
}
