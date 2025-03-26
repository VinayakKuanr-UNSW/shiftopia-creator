
import React from 'react';
import { Calendar, ClipboardList, Building, Users } from 'lucide-react';

const TemplateForm: React.FC = () => {
  return (
    <div className="animate-float w-full glass-panel p-6 mb-8 border border-purple-500/20 shadow-lg shadow-purple-500/5">
      <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
        <ClipboardList className="text-purple-400" size={20} />
        <span>Create New Template</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-white/80 mb-2">Template Name</label>
          <input 
            type="text" 
            className="custom-input" 
            placeholder="Enter template name"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-white/80 mb-2 flex items-center gap-1">
              <Calendar size={16} className="text-blue-400" />
              <span>Start Date</span>
            </label>
            <input 
              type="date" 
              className="custom-input"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-white/80 mb-2 flex items-center gap-1">
              <Calendar size={16} className="text-green-400" />
              <span>End Date</span>
            </label>
            <input 
              type="date" 
              className="custom-input"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-white/80 mb-2 flex items-center gap-1">
            <Building size={16} className="text-purple-400" />
            <span>Department</span>
          </label>
          <select className="custom-input">
            <option>Select Department</option>
            <option>Operations</option>
            <option>Finance</option>
            <option>Human Resources</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-white/80 mb-2 flex items-center gap-1">
            <Users size={16} className="text-orange-400" />
            <span>Sub-Department</span>
          </label>
          <select className="custom-input">
            <option>Select Sub-Department</option>
            <option>Team Alpha</option>
            <option>Team Beta</option>
            <option>Team Gamma</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;
