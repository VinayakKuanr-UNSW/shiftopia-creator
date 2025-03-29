
import React, { useState } from 'react';
import { Edit, Trash, Clock, User, Award, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ShiftProps {
  role: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  remunerationLevel: string;
  assignedEmployee?: string;
}

const ShiftItem: React.FC<ShiftProps> = ({ 
  role, 
  startTime, 
  endTime, 
  breakDuration, 
  remunerationLevel,
  assignedEmployee
}) => {
  const [isAssigning, setIsAssigning] = useState(false);
  
  const getRemunerationBadge = () => {
    switch(remunerationLevel) {
      case 'GOLD':
        return <Badge className="bg-yellow-500/30 text-yellow-300 border border-yellow-500/30">GOLD</Badge>;
      case 'SILVER':
        return <Badge className="bg-slate-400/30 text-slate-300 border border-slate-400/30">SILVER</Badge>;
      case 'BRONZE':
        return <Badge className="bg-orange-600/30 text-orange-300 border border-orange-600/30">BRONZE</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-white/80 border border-blue-500/20">Level {remunerationLevel}</Badge>;
    }
  };
  
  return (
    <div className="p-3 bg-black/20 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-md hover:bg-black/30 group">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <User size={14} className="text-white/60 group-hover:text-white/80 transition-colors duration-300" />
            <span className="font-medium group-hover:text-white transition-colors duration-300">{role}</span>
            {getRemunerationBadge()}
          </div>
          <div className="mt-1 text-white/70 group-hover:text-white/80 text-sm flex items-center space-x-4 transition-colors duration-300">
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{startTime} - {endTime}</span>
            </div>
            <span className="text-white/40">|</span>
            <span className="flex items-center space-x-1">
              <Award size={12} />
              <span>Break: {breakDuration}</span>
            </span>
          </div>
          
          {assignedEmployee && (
            <div className="mt-2 text-sm">
              <span className="text-green-400 flex items-center">
                <User size={12} className="mr-1" />
                Assigned to: {assignedEmployee}
              </span>
            </div>
          )}
          
          {isAssigning && (
            <div className="mt-2">
              <select className="bg-black/30 border border-white/20 rounded text-sm p-1 w-full">
                <option value="">Select Employee</option>
                <option value="1">Vinayak Singh</option>
                <option value="2">John Smith</option>
                <option value="3">Emma Watson</option>
                <option value="4">David Miller</option>
                <option value="5">Sarah Johnson</option>
              </select>
              <div className="flex space-x-2 mt-1">
                <button 
                  className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30"
                  onClick={() => setIsAssigning(false)}
                >
                  Assign
                </button>
                <button 
                  className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30"
                  onClick={() => setIsAssigning(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          {!assignedEmployee && !isAssigning && (
            <button 
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-green-400/80 hover:text-green-400 transition-all duration-200 hover:scale-110"
              onClick={() => setIsAssigning(true)}
            >
              <UserPlus size={14} />
            </button>
          )}
          <button className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-blue-400/80 hover:text-blue-400 transition-all duration-200 hover:scale-110">
            <Edit size={14} />
          </button>
          <button className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-red-400/80 hover:text-red-400 transition-all duration-200 hover:scale-110">
            <Trash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftItem;
