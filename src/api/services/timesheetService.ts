
import { Timesheet, ShiftStatus, Role, RemunerationLevel } from '../models/types';
import { currentWeekTimesheets, generateTimesheet } from '../data/mockData';
import { rosterService } from './rosterService';

// Local storage for timesheets - in a real app this would be a database
let timesheets = [...currentWeekTimesheets];

export const timesheetService = {
  getAllTimesheets: async (): Promise<Timesheet[]> => {
    return Promise.resolve([...timesheets]);
  },
  
  getTimesheetsByDateRange: async (startDate: string, endDate: string): Promise<Timesheet[]> => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filteredTimesheets = timesheets.filter(timesheet => {
      const timesheetDate = new Date(timesheet.date);
      return timesheetDate >= start && timesheetDate <= end;
    });
    
    return Promise.resolve(filteredTimesheets);
  },
  
  getTimesheetByDate: async (date: string): Promise<Timesheet | null> => {
    const timesheet = timesheets.find(t => t.date.split('T')[0] === date.split('T')[0]);
    
    // If timesheet doesn't exist for this date, try to create one from roster
    if (!timesheet) {
      const roster = await rosterService.getRosterByDate(date);
      if (roster) {
        const newTimesheet = generateTimesheet(roster);
        timesheets.push(newTimesheet);
        return Promise.resolve(newTimesheet);
      }
      return Promise.resolve(null);
    }
    
    return Promise.resolve(timesheet);
  },
  
  updateTimesheet: async (date: string, updates: Partial<Timesheet>): Promise<Timesheet | null> => {
    const index = timesheets.findIndex(t => t.date.split('T')[0] === date.split('T')[0]);
    if (index === -1) return Promise.resolve(null);
    
    const updatedTimesheet = {
      ...timesheets[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    timesheets[index] = updatedTimesheet;
    return Promise.resolve(updatedTimesheet);
  },
  
  updateShiftStatus: async (
    date: string,
    groupId: number,
    subGroupId: number,
    shiftId: string,
    status: ShiftStatus
  ): Promise<Timesheet | null> => {
    const timesheet = await timesheetService.getTimesheetByDate(date);
    if (!timesheet) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedTimesheet = JSON.parse(JSON.stringify(timesheet)) as Timesheet;
    
    // Find the shift and update its status
    const group = updatedTimesheet.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    const shift = subGroup.shifts.find(s => s.id === shiftId);
    if (!shift) return Promise.resolve(null);
    
    // Update status
    shift.status = status;
    
    // Update the timesheet in our local "database"
    return timesheetService.updateTimesheet(date, updatedTimesheet);
  },
  
  clockInShift: async (
    date: string,
    groupId: number,
    subGroupId: number,
    shiftId: string,
    actualStartTime: string
  ): Promise<Timesheet | null> => {
    const timesheet = await timesheetService.getTimesheetByDate(date);
    if (!timesheet) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedTimesheet = JSON.parse(JSON.stringify(timesheet)) as Timesheet;
    
    // Find the shift and update it
    const group = updatedTimesheet.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    const shift = subGroup.shifts.find(s => s.id === shiftId);
    if (!shift) return Promise.resolve(null);
    
    // Only allow clocking in if the shift is assigned
    if (shift.status !== 'Assigned' && shift.status !== 'Swapped') {
      return Promise.resolve(null);
    }
    
    // Update the shift with actual start time
    shift.status = 'Assigned'; // Status remains assigned until clock out
    shift.actualStartTime = actualStartTime;
    
    // Update the timesheet in our local "database"
    return timesheetService.updateTimesheet(date, updatedTimesheet);
  },
  
  clockOutShift: async (
    date: string,
    groupId: number,
    subGroupId: number,
    shiftId: string,
    actualEndTime: string
  ): Promise<Timesheet | null> => {
    const timesheet = await timesheetService.getTimesheetByDate(date);
    if (!timesheet) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedTimesheet = JSON.parse(JSON.stringify(timesheet)) as Timesheet;
    
    // Find the shift and update it
    const group = updatedTimesheet.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    const shift = subGroup.shifts.find(s => s.id === shiftId);
    if (!shift) return Promise.resolve(null);
    
    // Only allow clocking out if the shift has been clocked in
    if (!shift.actualStartTime) {
      return Promise.resolve(null);
    }
    
    // Update the shift with actual end time and mark as completed
    shift.status = 'Completed';
    shift.actualEndTime = actualEndTime;
    
    // Update the timesheet in our local "database"
    return timesheetService.updateTimesheet(date, updatedTimesheet);
  },
  
  swapShift: async (
    date: string,
    groupId: number,
    subGroupId: number,
    shiftId: string,
    newEmployeeId: string
  ): Promise<Timesheet | null> => {
    const timesheet = await timesheetService.getTimesheetByDate(date);
    if (!timesheet) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedTimesheet = JSON.parse(JSON.stringify(timesheet)) as Timesheet;
    
    // Find the shift and update it
    const group = updatedTimesheet.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    const shift = subGroup.shifts.find(s => s.id === shiftId);
    if (!shift) return Promise.resolve(null);
    
    // Update the shift with new employee and mark as swapped
    shift.employeeId = newEmployeeId;
    shift.status = 'Swapped';
    
    // Reset actual times since it's a new employee
    shift.actualStartTime = undefined;
    shift.actualEndTime = undefined;
    
    // Update the timesheet in our local "database"
    return timesheetService.updateTimesheet(date, updatedTimesheet);
  },
  
  cancelShift: async (
    date: string,
    groupId: number,
    subGroupId: number,
    shiftId: string,
    reason?: string
  ): Promise<Timesheet | null> => {
    const timesheet = await timesheetService.getTimesheetByDate(date);
    if (!timesheet) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedTimesheet = JSON.parse(JSON.stringify(timesheet)) as Timesheet;
    
    // Find the shift and update it
    const group = updatedTimesheet.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    const shift = subGroup.shifts.find(s => s.id === shiftId);
    if (!shift) return Promise.resolve(null);
    
    // Mark the shift as cancelled
    shift.status = 'Cancelled';
    shift.notes = reason;
    
    // Update the timesheet in our local "database"
    return timesheetService.updateTimesheet(date, updatedTimesheet);
  }
};
