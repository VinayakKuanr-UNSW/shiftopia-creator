
import React, { useState } from 'react';
import { Search, Filter, User, Award, Clock, Briefcase } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  role: string;
  remunerationLevel: number;
  availability: string;
  shift?: string;
}

const employees: Employee[] = [
  { id: 1, name: 'John Doe', role: 'Event Coordinator', remunerationLevel: 5, availability: 'Full-time' },
  { id: 2, name: 'Jane Smith', role: 'AV Technician', remunerationLevel: 4, availability: 'Part-time' },
  { id: 3, name: 'Mike Johnson', role: 'Security Officer', remunerationLevel: 3, availability: 'Full-time' },
  { id: 4, name: 'Emily Brown', role: 'Tour Guide', remunerationLevel: 3, availability: 'Full-time' },
  { id: 5, name: 'Robert Wilson', role: 'Sound Engineer', remunerationLevel: 5, availability: 'Contract' },
  { id: 6, name: 'Sarah Davis', role: 'Information Desk', remunerationLevel: 2, availability: 'Part-time' },
  { id: 7, name: 'David Taylor', role: 'Lighting Technician', remunerationLevel: 4, availability: 'Full-time' },
  { id: 8, name: 'Lisa Anderson', role: 'Ticketing Agent', remunerationLevel: 2, availability: 'Part-time' },
];

export const RosterSidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  
  const filteredEmployees = employees.filter(employee => {
    // Apply search filter
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply level filter
    const matchesLevel = filterLevel === null || employee.remunerationLevel === filterLevel;
    
    return matchesSearch && matchesLevel;
  });
  
  const renderLevelBadge = (level: number) => {
    let bgColor = '';
    
    switch(level) {
      case 5:
        bgColor = 'bg-purple-500/20 border-purple-500/30';
        break;
      case 4:
        bgColor = 'bg-blue-500/20 border-blue-500/30';
        break;
      case 3:
        bgColor = 'bg-green-500/20 border-green-500/30';
        break;
      case 2:
        bgColor = 'bg-orange-500/20 border-orange-500/30';
        break;
      case 1:
      default:
        bgColor = 'bg-gray-500/20 border-gray-500/30';
    }
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${bgColor} border text-white/90`}>
        Level {level}
      </span>
    );
  };
  
  return (
    <div className="w-full md:w-80 p-4 glass-panel animate-fade-in">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <User className="text-purple-400 mr-2" size={18} />
          <span>Employee Roster</span>
        </h3>
        
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-white/80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          <button 
            className={`px-2 py-1 rounded-md text-xs whitespace-nowrap ${filterLevel === null ? 'bg-purple-500/20 text-white border border-purple-500/30' : 'bg-black/20 text-white/60 border border-white/10 hover:bg-black/30 hover:text-white/80'}`}
            onClick={() => setFilterLevel(null)}
          >
            All Levels
          </button>
          {[5, 4, 3, 2, 1].map(level => (
            <button 
              key={level}
              className={`px-2 py-1 rounded-md text-xs whitespace-nowrap ${filterLevel === level ? 'bg-purple-500/20 text-white border border-purple-500/30' : 'bg-black/20 text-white/60 border border-white/10 hover:bg-black/30 hover:text-white/80'}`}
              onClick={() => setFilterLevel(level === filterLevel ? null : level)}
            >
              Level {level}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1 custom-scrollbar">
        {filteredEmployees.map(employee => (
          <div 
            key={employee.id}
            className="p-3 bg-black/20 rounded-lg border border-white/10 hover:border-white/20 hover:bg-black/30 transition-all duration-300 cursor-move"
            draggable
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-white/90 flex items-center">
                  <User size={14} className="text-white/60 mr-2" />
                  {employee.name}
                </div>
                <div className="text-white/60 text-sm mt-1 flex items-center">
                  <Briefcase size={12} className="mr-1" />
                  {employee.role}
                </div>
              </div>
              
              <div>
                {renderLevelBadge(employee.remunerationLevel)}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2 text-xs text-white/60">
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>{employee.availability}</span>
              </div>
              
              {employee.shift && (
                <div className="bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30 text-white/80">
                  {employee.shift}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredEmployees.length === 0 && (
          <div className="text-center py-4 text-white/60">
            No employees match your search criteria
          </div>
        )}
      </div>
    </div>
  );
};
