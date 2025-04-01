
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Template, Group } from '@/api/models/types';
import { useTemplates } from '@/api/hooks';
import TemplateHeader from '@/components/templates/TemplateHeader';
import TemplateContent from '@/components/templates/TemplateContent';
import AddGroupDialog from '@/components/templates/AddGroupDialog';

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState<{ name: string; color: string }>({
    name: '',
    color: 'blue'
  });
  const { toast } = useToast();
  const {
    getAllTemplates,
    createTemplate,
    updateTemplate,
    addGroup,
    cloneGroup,
    saveAsDraft,
    publishTemplate,
    exportTemplateToPdf
  } = useTemplates();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getAllTemplates();
      setTemplates(data);
      if (data.length > 0 && !currentTemplate) {
        setCurrentTemplate(data[0]);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load templates',
        variant: 'destructive'
      });
    }
  };

  const handleAddGroup = async () => {
    if (!currentTemplate) return;
    
    if (!newGroup.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a group name',
        variant: 'destructive'
      });
      return;
    }

    try {
      const updatedTemplate = await addGroup(
        currentTemplate.id,
        {
          name: newGroup.name as any,
          color: newGroup.color as any,
          subGroups: []
        }
      );

      if (updatedTemplate) {
        setCurrentTemplate(updatedTemplate);
        toast({
          title: 'Success',
          description: `Added group "${newGroup.name}" to template`
        });
      }
    } catch (error) {
      console.error('Error adding group:', error);
      toast({
        title: 'Error',
        description: 'Failed to add group',
        variant: 'destructive'
      });
    }

    setIsAddGroupDialogOpen(false);
    setNewGroup({ name: '', color: 'blue' });
  };

  const handleSaveAsDraft = async () => {
    if (!currentTemplate) return;
    
    try {
      const updatedTemplate = await saveAsDraft(currentTemplate.id);
      
      if (updatedTemplate) {
        setCurrentTemplate(updatedTemplate);
        toast({
          title: 'Success',
          description: 'Template saved as draft'
        });
      }
    } catch (error) {
      console.error('Error saving as draft:', error);
      toast({
        title: 'Error',
        description: 'Failed to save as draft',
        variant: 'destructive'
      });
    }
  };
  
  const handlePublish = async () => {
    if (!currentTemplate) return;
    
    try {
      const updatedTemplate = await publishTemplate(currentTemplate.id);
      
      if (updatedTemplate) {
        setCurrentTemplate(updatedTemplate);
        toast({
          title: 'Success',
          description: 'Template published successfully'
        });
      }
    } catch (error) {
      console.error('Error publishing template:', error);
      toast({
        title: 'Error',
        description: 'Failed to publish template',
        variant: 'destructive'
      });
    }
  };
  
  const handleExportToPdf = async () => {
    if (!currentTemplate) return;
    
    try {
      const pdfUrl = await exportTemplateToPdf(currentTemplate.id);
      
      if (pdfUrl) {
        toast({
          title: 'Success',
          description: 'Template exported to PDF'
        });
      }
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to export template to PDF',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateGroup = (groupId: number, updates: Partial<Group>) => {
    console.log('Update group', groupId, updates);
  };

  const handleDeleteGroup = (groupId: number) => {
    console.log('Delete group', groupId);
  };

  const handleCloneGroup = (groupId: number) => {
    console.log('Clone group', groupId);
  };

  const handleAddSubGroup = (groupId: number, name: string) => {
    console.log('Add subgroup', groupId, name);
  };

  return (
    <div className="container mx-auto p-6">
      <TemplateHeader 
        currentTemplate={currentTemplate}
        onSaveAsDraft={handleSaveAsDraft}
        onPublish={handlePublish}
        onExportToPdf={handleExportToPdf}
        onAddGroup={() => setIsAddGroupDialogOpen(true)}
      />
      
      {currentTemplate && (
        <TemplateContent 
          template={currentTemplate}
          onUpdateGroup={handleUpdateGroup}
          onDeleteGroup={handleDeleteGroup}
          onCloneGroup={handleCloneGroup}
          onAddSubGroup={handleAddSubGroup}
        />
      )}
      
      <AddGroupDialog
        isOpen={isAddGroupDialogOpen}
        onOpenChange={setIsAddGroupDialogOpen}
        newGroup={newGroup}
        setNewGroup={setNewGroup}
        onAddGroup={handleAddGroup}
      />
    </div>
  );
};

export default TemplatesPage;
