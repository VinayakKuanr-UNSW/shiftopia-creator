
import React from 'react';

const TemplateForm: React.FC = () => {
  return (
    <div className="animate-slide-up w-full glass-panel p-6 mb-8">
      <h2 className="text-xl font-medium mb-6">Create New Template</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white/80 mb-2">Template Name</label>
          <input 
            type="text" 
            className="custom-input" 
            placeholder="Enter template name"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 mb-2">Start Date</label>
            <input 
              type="date" 
              className="custom-input"
            />
          </div>
          <div>
            <label className="block text-white/80 mb-2">End Date</label>
            <input 
              type="date" 
              className="custom-input"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-white/80 mb-2">Department</label>
          <select className="custom-input">
            <option>Select Department</option>
            <option>Operations</option>
            <option>Finance</option>
            <option>Human Resources</option>
          </select>
        </div>
        
        <div>
          <label className="block text-white/80 mb-2">Sub-Department</label>
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
