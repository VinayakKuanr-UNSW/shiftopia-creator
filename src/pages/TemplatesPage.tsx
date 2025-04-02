import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Template, Group } from '@/api/models/types';
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

  useEffect(() => {
    loadTemplates();
  }, []);

  // Load mock data with multiple templates, groups, and sub-groups.
  const loadTemplates = () => {
    const mockTemplates: Template[] = [
      {
        id: 1,
        name: 'Morning Shift Template',
        description: 'Covers all morning duties',
        start_date: '2025-01-01',
        end_date: '2025-01-31',
        createdAt: '2025-01-01T08:00:00Z',
        updatedAt: '2025-01-01T08:00:00Z',
        // Optional fields like department_id, sub_department_id, status are omitted here
        groups: [
          {
            id: 101,
            name: 'Reception',
            color: 'blue',
            subGroups: [
              { id: 1001, name: 'Morning Reception A', shifts: [] },
              { id: 1002, name: 'Morning Reception B', shifts: [] }
            ]
          },
          {
            id: 102,
            name: 'Security',
            color: 'red',
            subGroups: [
              { id: 1003, name: 'Entrance Security', shifts: [] },
              { id: 1004, name: 'VIP Security', shifts: [] }
            ]
          },
          {
            id: 103,
            name: 'Customer Service',
            color: 'purple',
            subGroups: [
              { id: 1005, name: 'Service Desk', shifts: [] }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Evening Shift Template',
        description: 'Covers all evening duties',
        start_date: '2025-02-01',
        end_date: '2025-02-28',
        createdAt: '2025-02-01T08:00:00Z',
        updatedAt: '2025-02-01T08:00:00Z',
        groups: [
          {
            id: 201,
            name: 'Catering',
            color: 'green',
            subGroups: [
              { id: 2001, name: 'Evening Catering A', shifts: [] },
              { id: 2002, name: 'Evening Catering B', shifts: [] }
            ]
          },
          {
            id: 202,
            name: 'Housekeeping',
            color: 'sky',
            subGroups: [
              { id: 2003, name: 'Evening Housekeeping', shifts: [] },
              { id: 2004, name: 'Room Service', shifts: [] }
            ]
          }
        ]
      }
    ];

    setTemplates(mockTemplates);
    if (mockTemplates.length > 0 && !currentTemplate) {
      setCurrentTemplate(mockTemplates[0]);
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
      // Simulate API call: create a new group and update the current template
      const newGroupData = {
        id: Date.now(), // generate a new unique ID
        name: newGroup.name,
        color: newGroup.color,
        subGroups: []
      };
      const updatedTemplate = {
        ...currentTemplate,
        updatedAt: new Date().toISOString(),
        groups: [...currentTemplate.groups, newGroupData]
      };
      setCurrentTemplate(updatedTemplate);
      toast({
        title: 'Success',
        description: `Added group "${newGroup.name}" to template`
      });
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
      // For mock testing, just display a success toast.
      toast({
        title: 'Success',
        description: 'Template saved as draft'
      });
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
      toast({
        title: 'Success',
        description: 'Template published successfully'
      });
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
      toast({
        title: 'Success',
        description: 'Template exported to PDF'
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to export template to PDF',
        variant: 'destructive'
      });
    }
  };

  // Inline update: update a group’s properties
  const handleUpdateGroup = (groupId: number, updates: Partial<Group>) => {
    if (!currentTemplate) return;
    const updatedGroups = currentTemplate.groups.map((group) =>
      group.id === groupId ? { ...group, ...updates } : group
    );
    const updatedTemplate = { ...currentTemplate, groups: updatedGroups };
    setCurrentTemplate(updatedTemplate);
    toast({ title: 'Success', description: 'Group updated' });
  };

  // Delete group with confirmation
  const handleDeleteGroup = (groupId: number) => {
    if (!currentTemplate) return;
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    const updatedGroups = currentTemplate.groups.filter((group) => group.id !== groupId);
    const updatedTemplate = { ...currentTemplate, groups: updatedGroups };
    setCurrentTemplate(updatedTemplate);
    toast({ title: 'Success', description: 'Group deleted' });
  };

  // Clone the entire group (with sub-groups and shifts)
  const handleCloneGroup = (groupId: number) => {
    if (!currentTemplate) return;
    const groupToClone = currentTemplate.groups.find((group) => group.id === groupId);
    if (!groupToClone) return;
    const clonedGroup = {
      ...groupToClone,
      id: Date.now(), // simulate new ID
      name: `${groupToClone.name} (Copy)`,
      subGroups: groupToClone.subGroups.map((sub) => ({ ...sub, id: Date.now() + Math.random() }))
    };
    const updatedTemplate = {
      ...currentTemplate,
      groups: [...currentTemplate.groups, clonedGroup]
    };
    setCurrentTemplate(updatedTemplate);
    toast({ title: 'Success', description: 'Group cloned' });
  };

  // Inline addition of sub-group
  const handleAddSubGroup = (groupId: number, subGroupName: string) => {
    if (!currentTemplate) return;
    if (!subGroupName.trim()) {
      toast({ title: 'Error', description: 'Sub-group name cannot be empty', variant: 'destructive' });
      return;
    }
    const updatedGroups = currentTemplate.groups.map((group) => {
      if (group.id === groupId) {
        const newSubGroup = {
          id: Date.now(), // generate a new id
          name: subGroupName,
          shifts: [] // empty shifts array
        };
        return { ...group, subGroups: [...group.subGroups, newSubGroup] };
      }
      return group;
    });
    const updatedTemplate = { ...currentTemplate, groups: updatedGroups };
    setCurrentTemplate(updatedTemplate);
    toast({ title: 'Success', description: 'Sub-group added' });
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
