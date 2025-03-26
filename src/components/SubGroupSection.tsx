
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Trash, Copy, Plus } from 'lucide-react';
import ShiftItem from './ShiftItem';

interface SubGroupProps {
  id: number;
  name: string;
  shifts: number;
}

const SubGroupSection: React.FC<SubGroupProps> = ({ id, name, shifts }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Fake data for shifts
  const fakeShifts = Array.from({ length: shifts }, (_, i) => ({
    id: i + 1,
    role: ['Supervisor', 'Assistant', 'Manager', 'Coordinator', 'Operator'][Math.floor(Math.random() * 5)],
    startTime: `${Math.floor(Math.random() * 12) + 7}:00`,
    endTime: `${Math.floor(Math.random() * 12) + 12}:00`,
    breakDuration: `${Math.floor(Math.random() * 60) + 15} min`,
    remunerationLevel: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
  }));
  
  return (
    <div className="ml-4 border-l border-white/10 pl-4 mb-4">
      <div className="glass-panel mb-3">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-white/60 text-sm mt-1">{shifts} Shifts</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-template-action transition-all duration-200">
              <Edit size={16} />
            </button>
            <button className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-template-delete transition-all duration-200">
              <Trash size={16} />
            </button>
            <button className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all duration-200">
              <Copy size={16} />
            </button>
            <button 
              className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all duration-200"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
        
        {expanded && (
          <div className="px-4 pb-4 animate-fade-in">
            <div className="border-t border-white/10 pt-3 mb-3">
              {fakeShifts.map(shift => (
                <ShiftItem 
                  key={shift.id}
                  role={shift.role}
                  startTime={shift.startTime}
                  endTime={shift.endTime}
                  breakDuration={shift.breakDuration}
                  remunerationLevel={shift.remunerationLevel}
                />
              ))}
            </div>
            
            <button className="flex items-center space-x-2 text-white/80 hover:text-white text-sm transition-all duration-200 px-3 py-1.5 rounded-lg glass-panel-hover w-full justify-center">
              <Plus size={14} />
              <span>Add Shift</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubGroupSection;
