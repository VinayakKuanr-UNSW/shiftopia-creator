
import React from 'react';
import { RosterGroup } from './RosterGroup';
import { Clock, Plus } from 'lucide-react';

interface RosterCalendarProps {
  selectedDate: Date;
  readOnly?: boolean;
}

// Sample data for demonstration
const rosterGroups = [
  {
    id: 1,
    name: 'Convention Centre',
    color: 'blue',
    subGroups: [
      {
        id: 101,
        name: 'Main Hall',
        shifts: [
          { id: 1001, role: 'Event Coordinator', startTime: '08:00', endTime: '16:00', breakDuration: '30 min', remunerationLevel: '4' },
          { id: 1002, role: 'Security Officer', startTime: '09:00', endTime: '17:00', breakDuration: '45 min', remunerationLevel: '3' },
        ]
      },
      {
        id: 102,
        name: 'Conference Room A',
        shifts: [
          { id: 1003, role: 'AV Technician', startTime: '10:00', endTime: '18:00', breakDuration: '30 min', remunerationLevel: '3' },
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Exhibition Centre',
    color: 'green',
    subGroups: [
      {
        id: 201,
        name: 'Gallery',
        shifts: [
          { id: 2001, role: 'Tour Guide', startTime: '09:00', endTime: '17:00', breakDuration: '45 min', remunerationLevel: '2' },
          { id: 2002, role: 'Information Desk', startTime: '08:30', endTime: '16:30', breakDuration: '30 min', remunerationLevel: '1' },
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Theatre',
    color: 'red',
    subGroups: [
      {
        id: 301,
        name: 'Main Stage',
        shifts: [
          { id: 3001, role: 'Sound Engineer', startTime: '14:00', endTime: '22:00', breakDuration: '60 min', remunerationLevel: '5' },
          { id: 3002, role: 'Lighting Technician', startTime: '14:00', endTime: '22:00', breakDuration: '45 min', remunerationLevel: '4' },
        ]
      },
      {
        id: 302,
        name: 'Box Office',
        shifts: [
          { id: 3003, role: 'Ticketing Agent', startTime: '10:00', endTime: '18:00', breakDuration: '30 min', remunerationLevel: '2' },
        ]
      }
    ]
  }
];

export const RosterCalendar: React.FC<RosterCalendarProps> = ({ selectedDate, readOnly }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-white/80 text-sm">
          <Clock size={14} className="mr-2 text-blue-400" />
          <span>Showing roster for {selectedDate.toLocaleDateString()}</span>
        </div>
        
        {!readOnly && (
          <button className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-purple-500/30 hover:bg-purple-500/40 text-white text-sm transition-all duration-200 border border-purple-500/30 hover:border-purple-500/50">
            <Plus size={16} />
            <span>Add Group</span>
          </button>
        )}
      </div>
      
      {rosterGroups.map((group) => (
        <RosterGroup key={group.id} group={group} />
      ))}
    </div>
  );
};
