
import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  isSameDay
} from 'date-fns';
import { Shift } from '@/api/models/types';
import MyRosterShift from './MyRosterShift';
import ShiftDetailsDialog from './ShiftDetailsDialog';

interface MonthViewProps {
  date: Date;
  getShiftsForDate: (date: Date) => Array<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  }>;
}

const MonthView: React.FC<MonthViewProps> = ({ date, getShiftsForDate }) => {
  const [selectedShift, setSelectedShift] = useState<{
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  } | null>(null);
  
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group days into weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach(day => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  // Get shifts for the selected day
  const handleDayClick = (day: Date) => {
    const shifts = getShiftsForDate(day);
    if (shifts.length > 0) {
      setSelectedShift(shifts[0]);
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800">
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 border-b border-gray-800 p-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-sm font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="p-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
            {week.map((day, dayIndex) => {
              const isCurrentMonth = isSameMonth(day, date);
              const shifts = getShiftsForDate(day);
              
              return (
                <div
                  key={dayIndex}
                  onClick={() => handleDayClick(day)}
                  className={`
                    p-1 min-h-[90px] rounded border
                    ${isCurrentMonth ? 'bg-black/20' : 'bg-black/40'} 
                    ${isToday(day) ? 'border-blue-500' : 'border-gray-800'}
                    ${shifts.length > 0 ? 'cursor-pointer' : ''}
                  `}
                >
                  <div className="text-right mb-1">
                    <span 
                      className={`
                        inline-flex items-center justify-center rounded-full w-6 h-6 text-xs
                        ${isToday(day) ? 'bg-blue-500 text-white' : ''}
                        ${!isCurrentMonth && !isToday(day) ? 'text-gray-600' : ''}
                      `}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>
                  
                  <div className="space-y-1 overflow-y-auto max-h-[60px]">
                    {shifts.slice(0, 3).map((shiftData, idx) => (
                      <MyRosterShift
                        key={idx}
                        shift={shiftData.shift}
                        groupName={shiftData.groupName}
                        groupColor={shiftData.groupColor}
                        subGroupName={shiftData.subGroupName}
                        compact={true}
                        onClick={() => {
                          // Modified this line to remove the event parameter
                          setSelectedShift(shiftData);
                        }}
                      />
                    ))}
                    
                    {shifts.length > 3 && (
                      <div className="text-xs text-center text-gray-400">
                        +{shifts.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <ShiftDetailsDialog
        isOpen={!!selectedShift}
        onClose={() => setSelectedShift(null)}
        shift={selectedShift || undefined}
      />
    </div>
  );
};

export default MonthView;
