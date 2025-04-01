
import React from 'react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Template Management</h1>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onSaveAsDraft}
          disabled={!currentTemplate}
        >
          Save as Draft
        </Button>
        
        <Button
          variant="outline"
          onClick={onPublish}
          disabled={!currentTemplate}
        >
          Publish
        </Button>
        
        <Button
          variant="outline"
          onClick={onExportToPdf}
          disabled={!currentTemplate}
        >
          Export to PDF
        </Button>
        
        <Button
          onClick={onAddGroup}
          disabled={!currentTemplate}
        >
          Add Group
        </Button>
      </div>
    </div>
  );
};

export default TemplateHeader;
