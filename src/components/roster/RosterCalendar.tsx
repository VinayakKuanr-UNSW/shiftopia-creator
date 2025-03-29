
import React, { useState } from 'react';
import { RosterGroup } from './RosterGroup';
import { Clock, Filter, Plus, Calendar as CalendarIcon, List, Grid2X2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RosterCalendarProps {
  selectedDate: Date;
  readOnly?: boolean;
}

// Enhanced sample data based on the template structure provided
const rosterGroups = [
  {
    id: 1,
    name: 'Convention Centre',
    color: 'blue',
    subGroups: [
      {
        id: 101,
        name: 'AM Base',
        shifts: [
          { id: 1001, role: 'Team Leader', startTime: '05:45', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: 1002, role: 'TM3', startTime: '06:15', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: 1003, role: 'TM2', startTime: '06:30', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: 1004, role: 'TM2', startTime: '06:30', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: 1005, role: 'TM2', startTime: '06:30', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'SILVER' },
          { id: 1006, role: 'TM2', startTime: '06:30', endTime: '14:00', breakDuration: '30 min', remunerationLevel: 'BRONZE' },
        ]
      },
      {
        id: 102,
        name: 'AM Assist',
        shifts: [
          { id: 1007, role: 'TM2', startTime: '11:30', endTime: '16:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
          { id: 1008, role: 'TM2', startTime: '11:30', endTime: '16:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
        ]
      },
      {
        id: 103,
        name: 'PM Base',
        shifts: [
          { id: 1009, role: 'Team Leader', startTime: '13:15', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: 1010, role: 'TM3', startTime: '13:45', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: 1011, role: 'TM2', startTime: '14:00', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: 1012, role: 'TM2', startTime: '14:00', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: 1013, role: 'TM2', startTime: '14:00', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
          { id: 1014, role: 'TM2', startTime: '14:00', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'BRONZE' },
        ]
      },
      {
        id: 104,
        name: 'PM Assist',
        shifts: [
          { id: 1015, role: 'TM2', startTime: '16:30', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
          { id: 1016, role: 'TM2', startTime: '16:30', endTime: '21:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
        ]
      },
      {
        id: 105,
        name: 'Late',
        shifts: [
          { id: 1017, role: 'TM3', startTime: '16:30', endTime: '23:00', breakDuration: '30 min', remunerationLevel: 'GOLD' },
          { id: 1018, role: 'TM2', startTime: '16:30', endTime: '23:00', breakDuration: '30 min', remunerationLevel: 'SILVER' },
        ]
      },
    ]
  },
  {
    id: 2,
    name: 'Exhibition Centre',
    color: 'green',
    subGroups: [
      {
        id: 201,
        name: 'Bump-In',
        shifts: [
          { id: 2001, role: 'Coordinator', startTime: '09:00', endTime: '17:00', breakDuration: '45 min', remunerationLevel: 'GOLD' },
          { id: 2002, role: 'Assistant', startTime: '08:30', endTime: '16:30', breakDuration: '30 min', remunerationLevel: 'SILVER' },
        ]
      },
      {
        id: 202,
        name: 'Bump-Out',
        shifts: [
          { id: 2003, role: 'Coordinator', startTime: '10:00', endTime: '18:00', breakDuration: '45 min', remunerationLevel: 'GOLD' },
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
        name: 'AM Floaters',
        shifts: [
          { id: 3001, role: 'Supervisor', startTime: '08:00', endTime: '16:00', breakDuration: '60 min', remunerationLevel: 'GOLD' },
          { id: 3002, role: 'Operator', startTime: '08:00', endTime: '16:00', breakDuration: '45 min', remunerationLevel: 'SILVER' },
        ]
      },
      {
        id: 302,
        name: 'PM Floaters',
        shifts: [
          { id: 3003, role: 'Supervisor', startTime: '15:00', endTime: '23:00', breakDuration: '60 min', remunerationLevel: 'GOLD' },
          { id: 3004, role: 'Operator', startTime: '15:00', endTime: '23:00', breakDuration: '45 min', remunerationLevel: 'SILVER' },
        ]
      }
    ]
  }
];

export const RosterCalendar: React.FC<RosterCalendarProps> = ({ selectedDate, readOnly }) => {
  const [viewMode, setViewMode] = useState('day');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-white/80 text-sm">
          <Clock size={14} className="mr-2 text-blue-400" />
          <span>Showing roster for {selectedDate.toLocaleDateString()}</span>
        </div>
        
        <div className="flex space-x-2">
          <Tabs defaultValue="day" className="w-auto">
            <TabsList className="bg-black/20 border border-white/10">
              <TabsTrigger 
                value="day" 
                className="data-[state=active]:bg-white/10"
                onClick={() => setViewMode('day')}
              >
                Day
              </TabsTrigger>
              <TabsTrigger 
                value="3day" 
                className="data-[state=active]:bg-white/10"
                onClick={() => setViewMode('3day')}
              >
                3-Day
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                className="data-[state=active]:bg-white/10"
                onClick={() => setViewMode('week')}
              >
                Week
              </TabsTrigger>
              <TabsTrigger 
                value="month" 
                className="data-[state=active]:bg-white/10"
                onClick={() => setViewMode('month')}
              >
                Month
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                className="data-[state=active]:bg-white/10"
                onClick={() => setViewMode('list')}
              >
                <List size={14} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {!readOnly && (
            <button className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-purple-500/30 hover:bg-purple-500/40 text-white text-sm transition-all duration-200 border border-purple-500/30 hover:border-purple-500/50">
              <Plus size={16} />
              <span>Add Group</span>
            </button>
          )}
        </div>
      </div>
      
      <TabsContent value={viewMode === 'list' ? 'list' : 'day'} className="mt-0">
        {rosterGroups.map((group) => (
          <RosterGroup key={group.id} group={group} />
        ))}
      </TabsContent>
      
      <TabsContent value="3day" className="mt-0">
        <div className="p-4 bg-black/20 rounded-lg border border-white/10 backdrop-blur-md">
          <h3 className="text-lg font-medium mb-2">3-Day View</h3>
          <p className="text-white/70">
            The 3-day view would display shifts across a 3-day period here.
            In a real implementation, this would show the groups and shifts organized in a 3-day calendar format.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="week" className="mt-0">
        <div className="p-4 bg-black/20 rounded-lg border border-white/10 backdrop-blur-md">
          <h3 className="text-lg font-medium mb-2">Week View</h3>
          <p className="text-white/70">
            The week view would display shifts across a week period here.
            In a real implementation, this would show the groups and shifts organized in a weekly calendar format.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="month" className="mt-0">
        <div className="p-4 bg-black/20 rounded-lg border border-white/10 backdrop-blur-md">
          <h3 className="text-lg font-medium mb-2">Month View</h3>
          <p className="text-white/70">
            The month view would display shifts across a month period here.
            In a real implementation, this would show the groups and shifts organized in a monthly calendar format.
          </p>
        </div>
      </TabsContent>
    </div>
  );
};
