
import React from 'react';
import { Edit, Trash } from 'lucide-react';

interface ShiftProps {
  role: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  remunerationLevel: string;
}

const ShiftItem: React.FC<ShiftProps> = ({ 
  role, 
  startTime, 
  endTime, 
  breakDuration, 
  remunerationLevel 
}) => {
  return (
    <div className="p-3 bg-black/20 rounded-lg mb-2 border border-white/5 hover:border-white/10 transition-all duration-200">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{role}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-template-action/20 text-white/80">Level {remunerationLevel}</span>
          </div>
          <div className="mt-1 text-white/70 text-sm flex items-center space-x-4">
            <span>{startTime} - {endTime}</span>
            <span className="text-white/50">|</span>
            <span>Break: {breakDuration}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-template-action transition-all duration-200">
            <Edit size={14} />
          </button>
          <button className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-template-delete transition-all duration-200">
            <Trash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftItem;
