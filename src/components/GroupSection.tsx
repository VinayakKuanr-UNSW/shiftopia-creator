
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Trash, Copy, Plus } from 'lucide-react';
import SubGroupSection from './SubGroupSection';

type GroupColor = 'blue' | 'green' | 'red';

interface GroupProps {
  id: number;
  name: string;
  subGroups: number;
  color: GroupColor;
}

const GroupSection: React.FC<GroupProps> = ({ id, name, subGroups, color }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Fake data for subgroups
  const fakeSubGroups = Array.from({ length: subGroups }, (_, i) => ({
    id: i + 1,
    name: `${name} Sub-Group ${i + 1}`,
    shifts: Math.floor(Math.random() * 5) + 1
  }));
  
  return (
    <div className={`animate-scale-in mb-6 glass-panel group-card-${color} overflow-hidden`}>
      <div className="p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="text-white/60 text-sm mt-1">{subGroups} Sub-Groups</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg bg-black/30 hover:bg-black/50 text-template-action transition-all duration-200">
            <Edit size={18} />
          </button>
          <button className="p-2 rounded-lg bg-black/30 hover:bg-black/50 text-template-delete transition-all duration-200">
            <Trash size={18} />
          </button>
          <button className="p-2 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all duration-200">
            <Copy size={18} />
          </button>
          <button 
            className="p-2 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all duration-200"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-6 pb-6 animate-fade-in">
          <div className="border-t border-white/10 pt-4 mb-4">
            {fakeSubGroups.map(subGroup => (
              <SubGroupSection 
                key={subGroup.id}
                id={subGroup.id}
                name={subGroup.name}
                shifts={subGroup.shifts}
              />
            ))}
          </div>
          
          <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-200 px-4 py-2 rounded-lg glass-panel-hover">
            <Plus size={16} />
            <span>Add Sub-Group</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupSection;
