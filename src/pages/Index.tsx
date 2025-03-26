
import React from 'react';
import Navbar from '../components/Navbar';
import TemplateForm from '../components/TemplateForm';
import GroupSection from '../components/GroupSection';
import { Save, FileDown, Play, Plus } from 'lucide-react';

const Index: React.FC = () => {
  // Sample groups data
  const groups = [
    { id: 1, name: 'Convention Centre', subGroups: 3, color: 'blue' as const },
    { id: 2, name: 'Exhibition Centre', subGroups: 2, color: 'green' as const },
    { id: 3, name: 'Theatre', subGroups: 4, color: 'red' as const }
  ];

  return (
    <div className="min-h-screen bg-black relative">
      {/* Top gradient */}
      <div className="top-gradient"></div>
      
      {/* Content */}
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-medium mb-8">Create Shift Template</h1>
          
          <TemplateForm />
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Groups</h2>
              <button className="button-blue flex items-center space-x-2">
                <span>Add Group</span>
                <Plus size={16} />
              </button>
            </div>
            
            {groups.map(group => (
              <GroupSection 
                key={group.id}
                id={group.id}
                name={group.name}
                subGroups={group.subGroups}
                color={group.color}
              />
            ))}
          </div>
          
          <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-white/10">
            <div className="flex items-center space-x-4">
              <button className="button-outline flex items-center space-x-2">
                <Save size={16} />
                <span>Save as Draft</span>
              </button>
              <button className="button-outline flex items-center space-x-2">
                <Play size={16} />
                <span>Preview</span>
              </button>
              <button className="button-outline flex items-center space-x-2">
                <FileDown size={16} />
                <span>Export to PDF</span>
              </button>
            </div>
            
            <button className="button-blue">Create Template</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
