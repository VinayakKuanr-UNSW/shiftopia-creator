
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Plus, Trash } from 'lucide-react';
import { RosterSubGroup } from './RosterSubGroup';
import { Group } from '@/api/models/types';

interface RosterGroupProps {
  group: Group;
  readOnly?: boolean;
  isOver?: boolean;
}

export const RosterGroup: React.FC<RosterGroupProps> = ({ group, readOnly, isOver }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const getGroupCardClass = () => {
    switch (group.color) {
      case 'blue':
        return 'group-card-blue';
      case 'green':
        return 'group-card-green';
      case 'red':
        return 'group-card-red';
      case 'purple':
        return 'group-card-purple';
      default:
        return 'group-card-blue';
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className={`rounded-lg p-4 ${getGroupCardClass()} hover-scale transition-all duration-300 ${isOver ? 'border-2 border-dashed border-white/50' : ''}`}>
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="text-lg font-medium text-white flex items-center">
            {isExpanded ? (
              <ChevronDown className="mr-2 h-5 w-5 text-white/80" />
            ) : (
              <ChevronUp className="mr-2 h-5 w-5 text-white/80" />
            )}
            {group.name}
          </h3>
          
          {!readOnly && (
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all duration-200 hover:scale-110">
                <Plus size={16} />
              </button>
              <button className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-blue-400/80 hover:text-blue-400 transition-all duration-200 hover:scale-110">
                <Edit size={16} />
              </button>
              <button className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-red-400/80 hover:text-red-400 transition-all duration-200 hover:scale-110">
                <Trash size={16} />
              </button>
            </div>
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {group.subGroups.map((subGroup) => (
              <RosterSubGroup key={subGroup.id} subGroup={subGroup} readOnly={readOnly} />
            ))}
            
            {!readOnly && (
              <button className="w-full py-2 mt-2 rounded-md flex items-center justify-center bg-black/20 hover:bg-black/30 text-white/70 hover:text-white border border-white/5 hover:border-white/10 transition-all duration-200">
                <Plus size={14} className="mr-2" />
                <span>Add Sub-Group</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
