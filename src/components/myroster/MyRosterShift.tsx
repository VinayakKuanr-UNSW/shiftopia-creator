
import React from 'react';
import { Clock, User, CalendarDays, MapPin } from 'lucide-react';
import { Shift } from '@/api/models/types';

interface MyRosterShiftProps {
  shift: Shift;
  groupName: string;
  groupColor: string;
  subGroupName: string;
  compact?: boolean;
}

const MyRosterShift: React.FC<MyRosterShiftProps> = ({
  shift,
  groupName,
  groupColor,
  subGroupName,
  compact = false
}) => {
  const getColorClass = () => {
    switch (groupColor) {
      case 'blue':
        return 'bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30';
      case 'green':
        return 'bg-green-500/20 border-green-500/30 hover:bg-green-500/30';
      case 'red':
        return 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30';
      case 'purple':
        return 'bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30';
      default:
        return 'bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30';
    }
  };
  
  if (compact) {
    return (
      <div className={`p-2 rounded border ${getColorClass()} transition-colors duration-200 cursor-pointer`}>
        <div className="flex justify-between items-center">
          <div className="text-xs font-medium">
            {shift.role}
          </div>
          <div className="text-xs text-white/70">
            {shift.startTime.split(':').slice(0, 2).join(':')} - {shift.endTime.split(':').slice(0, 2).join(':')}
          </div>
        </div>
        <div className="text-[10px] text-white/60 mt-1">
          {groupName} - {subGroupName}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`p-4 rounded border ${getColorClass()} transition-colors duration-200 cursor-pointer group`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-white group-hover:text-white/90 flex items-center">
            <User className="mr-2 h-4 w-4 text-white/60" />
            {shift.role}
          </h4>
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-white/70">
              <Clock className="mr-2 h-3.5 w-3.5 text-white/50" />
              {shift.startTime} - {shift.endTime}
              <span className="mx-2 text-white/40">|</span>
              Break: {shift.breakDuration}
            </div>
            <div className="flex items-center text-sm text-white/70">
              <CalendarDays className="mr-2 h-3.5 w-3.5 text-white/50" />
              {groupName}
              <span className="mx-2 text-white/40">•</span>
              {subGroupName}
            </div>
            <div className="flex items-center text-sm text-white/70">
              <MapPin className="mr-2 h-3.5 w-3.5 text-white/50" />
              Level {shift.remunerationLevel}
            </div>
          </div>
        </div>
        
        {shift.status && (
          <div className={`px-2 py-1 rounded text-xs ${
            shift.status === 'Assigned' ? 'bg-green-500/20 text-green-200' :
            shift.status === 'Completed' ? 'bg-blue-500/20 text-blue-200' :
            shift.status === 'Cancelled' ? 'bg-red-500/20 text-red-200' :
            shift.status === 'Swapped' ? 'bg-purple-500/20 text-purple-200' :
            shift.status === 'No-Show' ? 'bg-yellow-500/20 text-yellow-200' :
            'bg-gray-500/20 text-gray-200'
          }`}>
            {shift.status}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRosterShift;
