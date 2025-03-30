import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { RosterGroup } from './RosterGroup';
import { Clock, Filter, Plus, Calendar as CalendarIcon, List, Grid2X2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Roster, Group } from '@/api/models/types';
import { Skeleton } from '@/components/ui/skeleton';

interface RosterCalendarProps {
  selectedDate: Date;
  readOnly?: boolean;
  roster?: Roster;
  isLoading?: boolean;
}

export const RosterCalendar: React.FC<RosterCalendarProps> = ({ 
  selectedDate, 
  readOnly,
  roster,
  isLoading 
}) => {
  const [viewMode, setViewMode] = useState('day');

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'EMPLOYEE',
    drop: (item: { id: string, name: string }, monitor) => {
      // Handle employee drop
      console.log('Dropped employee:', item);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" ref={drop}>
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
            
            <TabsContent value="day" className="mt-0">
              {roster?.groups.map((group) => (
                <RosterGroup 
                  key={group.id} 
                  group={group}
                  readOnly={readOnly}
                  isOver={isOver}
                />
              ))}
            </TabsContent>
            
            {/* Other view modes */}
            {['3day', 'week', 'month', 'list'].map((mode) => (
              <TabsContent key={mode} value={mode} className="mt-0">
                <div className="p-4 bg-black/20 rounded-lg border border-white/10 backdrop-blur-md">
                  <h3 className="text-lg font-medium mb-2">{mode.charAt(0).toUpperCase() + mode.slice(1)} View</h3>
                  <p className="text-white/70">
                    This view is under development. Please use the Day view for now.
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};