
// Fix the specific type errors in TemplatesPage.tsx
// First, ensure the newGroup object has proper types

const newGroup = {
  name: newGroupName || 'New Group' as DepartmentName,
  color: newGroupColor,
  subGroups: [] 
};

// And update the saveAsDraft mutation to not use status property directly

const handleSaveAsDraft = () => {
  if (!currentTemplateId) {
    toast.error('No template selected');
    return;
  }
  
  const currentTemplate = templates.find(t => t.id === currentTemplateId);
  if (!currentTemplate) {
    toast.error('Template not found');
    return;
  }
  
  saveAsDraftMutation.mutate(currentTemplate, {
    onSuccess: () => toast.success('Template saved as draft'),
    onError: () => toast.error('Failed to save as draft')
  });
};
