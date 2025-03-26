
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import TemplateForm from '../components/TemplateForm';
import GroupSection from '../components/GroupSection';
import { Save, FileDown, Play, Plus, Sparkles } from 'lucide-react';

const Index: React.FC = () => {
  // Sample groups data with correct color assignments
  const groups = [
    { id: 1, name: 'Convention Centre', subGroups: 3, color: 'blue' as const },
    { id: 2, name: 'Exhibition Centre', subGroups: 2, color: 'green' as const },
    { id: 3, name: 'Theatre', subGroups: 4, color: 'red' as const }
  ];

  // Effect for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(element => {
      observer.observe(element);
    });

    return () => {
      document.querySelectorAll('.reveal-on-scroll').forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Improved background with animated particles would go here if we had a custom component */}
      
      {/* Improved top gradient */}
      <div className="top-gradient"></div>
      
      {/* Content */}
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="mb-8 reveal-on-scroll">
          <div className="flex items-center mb-2">
            <Sparkles className="mr-2 text-purple-400" size={20} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 text-transparent bg-clip-text">Create Shift Template</h1>
          </div>
          <p className="text-white/60 max-w-3xl">Design your complete shift structure with groups, sub-groups, and individual shift assignments in this intuitive template builder.</p>
        </div>
        
        <TemplateForm />
        
        <div className="mb-8 reveal-on-scroll">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">Groups</h2>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">{groups.length}</span>
            </div>
            <button className="button-blue flex items-center space-x-2 btn-with-icon group">
              <span>Add Group</span>
              <Plus size={16} className="btn-icon group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
          
          {groups.map((group, index) => (
            <div key={group.id} className="reveal-on-scroll" style={{ transitionDelay: `${index * 150}ms` }}>
              <GroupSection 
                id={group.id}
                name={group.name}
                subGroups={group.subGroups}
                color={group.color}
              />
            </div>
          ))}
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-white/10 reveal-on-scroll">
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <button className="button-outline flex items-center space-x-2 group">
              <Save size={16} className="group-hover:scale-110 transition-transform duration-300" />
              <span>Save as Draft</span>
            </button>
            <button className="button-outline flex items-center space-x-2 group">
              <Play size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              <span>Preview</span>
            </button>
            <button className="button-outline flex items-center space-x-2 group">
              <FileDown size={16} className="group-hover:translate-y-1 transition-transform duration-300" />
              <span>Export to PDF</span>
            </button>
          </div>
          
          <button className="button-blue group">
            <span className="relative inline-block">
              Create Template
              <span className="absolute inset-0 animate-shimmer"></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
