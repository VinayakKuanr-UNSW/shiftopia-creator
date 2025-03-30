
import { Roster, Group, Role, ShiftStatus, Employee, RemunerationLevel } from '../models/types';
import { currentWeekRosters, generatePopulatedRoster } from '../data/mockData';

// Local storage for rosters - in a real app this would be a database
let rosters = [...currentWeekRosters];

export const rosterService = {
  getAllRosters: async (): Promise<Roster[]> => {
    return Promise.resolve([...rosters]);
  },
  
  getRostersByDateRange: async (startDate: string, endDate: string): Promise<Roster[]> => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filteredRosters = rosters.filter(roster => {
      const rosterDate = new Date(roster.date);
      return rosterDate >= start && rosterDate <= end;
    });
    
    return Promise.resolve(filteredRosters);
  },
  
  getRosterByDate: async (date: string): Promise<Roster | null> => {
    const roster = rosters.find(r => r.date.split('T')[0] === date.split('T')[0]);
    return Promise.resolve(roster || null);
  },
  
  createRoster: async (date: string, templateId: number): Promise<Roster> => {
    // Check if roster already exists for this date
    const existingRoster = await rosterService.getRosterByDate(date);
    if (existingRoster) {
      return Promise.resolve(existingRoster);
    }
    
    // Generate a new roster from template
    const newRoster = generatePopulatedRoster(date, templateId);
    rosters.push(newRoster);
    
    return Promise.resolve(newRoster);
  },
  
  updateRoster: async (date: string, updates: Partial<Roster>): Promise<Roster | null> => {
    const index = rosters.findIndex(r => r.date.split('T')[0] === date.split('T')[0]);
    if (index === -1) return Promise.resolve(null);
    
    const updatedRoster = {
      ...rosters[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    rosters[index] = updatedRoster;
    return Promise.resolve(updatedRoster);
  },
  
  assignEmployeeToShift: async (
    date: string, 
    groupId: number, 
    subGroupId: number, 
    shiftId: string, 
    employeeId: string
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Find the shift and update it
    const group = updatedRoster.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    const shift = subGroup.shifts.find(s => s.id === shiftId);
    if (!shift) return Promise.resolve(null);
    
    // Update the shift with the new employee
    shift.employeeId = employeeId;
    shift.status = 'Assigned';
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  },
  
  updateShift: async (
    date: string,
    groupId: number,
    subGroupId: number,
    shiftId: string,
    updates: Partial<{ startTime: string; endTime: string; role: Role; remunerationLevel: RemunerationLevel; breakDuration: string }>
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Find the shift and update it
    const group = updatedRoster.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    const shiftIndex = subGroup.shifts.findIndex(s => s.id === shiftId);
    if (shiftIndex === -1) return Promise.resolve(null);
    
    // Update the shift with the new properties
    subGroup.shifts[shiftIndex] = {
      ...subGroup.shifts[shiftIndex],
      ...updates
    };
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  },
  
  addShiftToRoster: async (
    date: string,
    groupId: number,
    subGroupId: number,
    shift: Omit<Group['subGroups'][0]['shifts'][0], 'id'>
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Find the subgroup to add the shift to
    const group = updatedRoster.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    // Create a new shift with a unique ID
    const newShift = {
      ...shift,
      id: `${groupId}-${subGroupId}-${Date.now()}`
    };
    
    // Add the shift to the subgroup
    subGroup.shifts.push(newShift);
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  },
  
  removeShiftFromRoster: async (
    date: string,
    groupId: number,
    subGroupId: number,
    shiftId: string
  ): Promise<Roster | null> => {
    const roster = await rosterService.getRosterByDate(date);
    if (!roster) return Promise.resolve(null);
    
    // Create a deep copy to avoid reference issues
    const updatedRoster = JSON.parse(JSON.stringify(roster)) as Roster;
    
    // Find the subgroup to remove the shift from
    const group = updatedRoster.groups.find(g => g.id === groupId);
    if (!group) return Promise.resolve(null);
    
    const subGroup = group.subGroups.find(sg => sg.id === subGroupId);
    if (!subGroup) return Promise.resolve(null);
    
    // Remove the shift
    const shiftIndex = subGroup.shifts.findIndex(s => s.id === shiftId);
    if (shiftIndex === -1) return Promise.resolve(null);
    
    subGroup.shifts.splice(shiftIndex, 1);
    
    // Update the roster in our local "database"
    return rosterService.updateRoster(date, updatedRoster);
  }
};
