
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Plus, Trash } from 'lucide-react';
import ShiftItem from '@/components/ShiftItem';
import { SubGroup } from '@/api/models/types';

interface RosterSubGroupProps {
  subGroup: SubGroup;
  readOnly?: boolean;
}

export const RosterSubGroup: React.FC<RosterSubGroupProps> = ({ subGroup, readOnly }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="rounded-lg p-3 bg-black/20 border border-white/10 backdrop-blur-sm">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="text-md font-medium text-white/90 flex items-center">
          {isExpanded ? (
            <ChevronDown className="mr-2 h-4 w-4 text-white/60" />
          ) : (
            <ChevronUp className="mr-2 h-4 w-4 text-white/60" />
          )}
          {subGroup.name}
        </h4>
        
        {!readOnly && (
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all duration-200 hover:scale-110">
              <Plus size={14} />
            </button>
            <button className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-blue-400/80 hover:text-blue-400 transition-all duration-200 hover:scale-110">
              <Edit size={14} />
            </button>
            <button className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-red-400/80 hover:text-red-400 transition-all duration-200 hover:scale-110">
              <Trash size={14} />
            </button>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {subGroup.shifts.map((shift) => (
            <ShiftItem 
              key={shift.id}
              role={shift.role}
              startTime={shift.startTime}
              endTime={shift.endTime}
              breakDuration={shift.breakDuration}
              remunerationLevel={shift.remunerationLevel}
              employeeId={shift.employeeId}
              employee={shift.employee}
              status={shift.status}
            />
          ))}
          
          {!readOnly && (
            <button className="w-full py-1.5 mt-2 rounded-md flex items-center justify-center bg-black/20 hover:bg-black/30 text-white/70 hover:text-white border border-white/5 hover:border-white/10 transition-all duration-200 text-sm">
              <Plus size={12} className="mr-1" />
              <span>Add Shift</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
