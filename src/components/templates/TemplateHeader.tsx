
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface TemplateHeaderProps {
  currentTemplate: { id: number } | null;
  onSaveAsDraft: () => void;
  onPublish: () => void;
  onExportToPdf: () => void;
  onAddGroup: () => void;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({
  currentTemplate,
  onSaveAsDraft,
  onPublish,
  onExportToPdf,
  onAddGroup
}) => {
  const { theme } = useTheme();
  const isGlassTheme = theme === 'glass';
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Template Management</h1>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={isGlassTheme ? "glass" : "outline"} 
          onClick={onSaveAsDraft} 
          disabled={!currentTemplate}
          className="transition-all duration-300"
        >
          Save as Draft
        </Button>
        <Button 
          variant={isGlassTheme ? "glass" : "outline"} 
          onClick={onPublish} 
          disabled={!currentTemplate}
          className="transition-all duration-300"
        >
          Publish
        </Button>
        <Button 
          variant={isGlassTheme ? "glass" : "outline"} 
          onClick={onExportToPdf} 
          disabled={!currentTemplate}
          className="transition-all duration-300"
        >
          Export to PDF
        </Button>
        <Button 
          variant={isGlassTheme ? "glass" : "default"} 
          onClick={onAddGroup} 
          disabled={!currentTemplate}
          className="transition-all duration-300"
        >
          Add Group
        </Button>
      </div>
    </div>
  );
};

export default TemplateHeader;
