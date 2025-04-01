import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Template, DepartmentName, DepartmentColor } from '@/api/models/types';
import { useTemplates } from '@/api/hooks';
import RosterGroup from '@/components/roster/RosterGroup';

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
          name: newGroup.name as DepartmentName,
          color: newGroup.color as DepartmentColor,
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
        // In a real app, this would open the PDF in a new tab or download it
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Template Management</h1>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={!currentTemplate}
          >
            Save as Draft
          </Button>
          
          <Button
            variant="outline"
            onClick={handlePublish}
            disabled={!currentTemplate}
          >
            Publish
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExportToPdf}
            disabled={!currentTemplate}
          >
            Export to PDF
          </Button>
          
          <Button
            onClick={() => setIsAddGroupDialogOpen(true)}
            disabled={!currentTemplate}
          >
            Add Group
          </Button>
        </div>
      </div>
      
      {currentTemplate && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>{currentTemplate.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentTemplate.groups.map(group => (
                  <RosterGroup
                    key={group.id}
                    group={group}
                    templateId={currentTemplate.id}
                    onUpdateGroup={(groupId, updates) => {
                      console.log('Update group', groupId, updates);
                    }}
                    onDeleteGroup={(groupId) => {
                      console.log('Delete group', groupId);
                    }}
                    onCloneGroup={(groupId) => {
                      console.log('Clone group', groupId);
                    }}
                    onAddSubGroup={(groupId, name) => {
                      console.log('Add subgroup', groupId, name);
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Dialog open={isAddGroupDialogOpen} onOpenChange={setIsAddGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="groupName">Group Name</label>
              <Input
                id="groupName"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                placeholder="Enter group name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="groupColor">Group Color</label>
              <Select
                value={newGroup.color}
                onValueChange={(value) => setNewGroup({ ...newGroup, color: value })}
              >
                <SelectTrigger id="groupColor">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="sky">Sky Blue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGroupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGroup}>Add Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesPage;
