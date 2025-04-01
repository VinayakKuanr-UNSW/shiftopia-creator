import { Template, Group, SubGroup, DBTemplate } from '../models/types';
import { supabase } from '@/integrations/supabase/client';

// Helper function to convert from DB format to our app format
const dbToAppTemplate = (dbTemplate: DBTemplate): Template => {
  return {
    id: dbTemplate.template_id,
    name: dbTemplate.name,
    description: dbTemplate.description,
    groups: dbTemplate.groups || [],
    createdAt: dbTemplate.created_at,
    updatedAt: dbTemplate.updated_at,
    department_id: dbTemplate.department_id,
    sub_department_id: dbTemplate.sub_department_id,
    start_date: dbTemplate.start_date,
    end_date: dbTemplate.end_date
  };
};

export const templatesService = {
  getAllTemplates: async (): Promise<Template[]> => {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
    
    // Convert from DB format to our app format
    return (data || []).map(dbToAppTemplate);
  },
  
  getTemplateById: async (id: number): Promise<Template | null> => {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('template_id', id)
      .single();
    
    if (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return dbToAppTemplate(data as DBTemplate);
  },
  
  createTemplate: async (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> => {
    // Default values for required fields
    const now = new Date().toISOString();
    const dbTemplate = {
      name: template.name,
      description: template.description,
      department_id: template.department_id || 1,
      sub_department_id: template.sub_department_id || 1,
      start_date: template.start_date || now.split('T')[0],
      end_date: template.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: now,
      updated_at: now,
      groups: JSON.stringify(template.groups || [])
    };
    
    const { data, error } = await supabase
      .from('templates')
      .insert([dbTemplate])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating template:', error);
      throw error;
    }
    
    // Transform the response data to match our expected format
    const createdTemplate = dbToAppTemplate(data as unknown as DBTemplate);
    
    // If groups were stored as JSON string, parse them back
    if (typeof createdTemplate.groups === 'string') {
      try {
        createdTemplate.groups = JSON.parse(createdTemplate.groups);
      } catch (e) {
        createdTemplate.groups = [];
      }
    }
    
    return createdTemplate;
  },
  
  updateTemplate: async (id: number, updates: Partial<Template>): Promise<Template | null> => {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Handle properties that need to be remapped for the database
    if (updates.id !== undefined) {
      delete updateData.id;
    }
    
    if (updates.createdAt !== undefined) {
      updateData.created_at = updates.createdAt;
      delete updateData.createdAt;
    }
    
    if (updates.updatedAt !== undefined) {
      updateData.updated_at = updates.updatedAt;
      delete updateData.updatedAt;
    }
    
    if (updates.groups !== undefined) {
      updateData.groups = JSON.stringify(updates.groups);
    }
    
    const { data, error } = await supabase
      .from('templates')
      .update(updateData)
      .eq('template_id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating template:', error);
      throw error;
    }
    
    if (!data) return null;
    
    // Transform the response data to match our expected format
    const updatedTemplate = dbToAppTemplate(data as unknown as DBTemplate);
    
    // If groups were stored as JSON string, parse them back
    if (typeof updatedTemplate.groups === 'string') {
      try {
        updatedTemplate.groups = JSON.parse(updatedTemplate.groups);
      } catch (e) {
        updatedTemplate.groups = [];
      }
    }
    
    return updatedTemplate;
  },
  
  deleteTemplate: async (id: number): Promise<boolean> => {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('template_id', id);
    
    if (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
    
    return true;
  },
  
  addGroup: async (templateId: number, group: Omit<Group, 'id'>): Promise<Template | null> => {
    // First get the current template
    const template = await templatesService.getTemplateById(templateId);
    
    if (!template) return null;
    
    // Create a new group with a generated ID
    const groups = [...template.groups];
    const newGroupId = Math.max(0, ...groups.map(g => g.id)) + 1;
    const newGroup = {
      id: newGroupId,
      ...group
    };
    
    groups.push(newGroup);
    
    // Update the template with the new group
    return templatesService.updateTemplate(templateId, { groups });
  },
  
  updateGroup: async (templateId: number, groupId: number, updates: Partial<Group>): Promise<Template | null> => {
    // First get the current template
    const template = await templatesService.getTemplateById(templateId);
    
    if (!template) return null;
    
    // Find and update the group
    const groups = [...template.groups];
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      throw new Error(`Group with ID ${groupId} not found in template ${templateId}`);
    }
    
    groups[groupIndex] = {
      ...groups[groupIndex],
      ...updates
    };
    
    // Update the template with the modified groups
    return templatesService.updateTemplate(templateId, { groups });
  },
  
  deleteGroup: async (templateId: number, groupId: number): Promise<Template | null> => {
    // First get the current template
    const template = await templatesService.getTemplateById(templateId);
    
    if (!template) return null;
    
    // Filter out the group to delete
    const groups = template.groups.filter(g => g.id !== groupId);
    
    // Update the template without the deleted group
    return templatesService.updateTemplate(templateId, { groups });
  },
  
  cloneGroup: async (templateId: number, groupId: number): Promise<Template | null> => {
    const template = await templatesService.getTemplateById(templateId);
    
    if (!template) return null;
    
    const groupToClone = template.groups.find(g => g.id === groupId);
    
    if (!groupToClone) {
      throw new Error(`Group with ID ${groupId} not found in template ${templateId}`);
    }
    
    // Create a deep clone of the group with a new ID
    const newGroupId = Math.max(0, ...template.groups.map(g => g.id)) + 1;
    const clonedGroup = JSON.parse(JSON.stringify(groupToClone));
    clonedGroup.id = newGroupId;
    clonedGroup.name = `${clonedGroup.name} (Copy)`;
    
    const groups = [...template.groups, clonedGroup];
    
    // Update the template with the cloned group
    return templatesService.updateTemplate(templateId, { groups });
  },
  
  addSubGroup: async (templateId: number, groupId: number, subGroup: Omit<SubGroup, 'id'>): Promise<Template | null> => {
    const template = await templatesService.getTemplateById(templateId);
    
    if (!template) return null;
    
    // Find the group
    const groups = [...template.groups];
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      throw new Error(`Group with ID ${groupId} not found in template ${templateId}`);
    }
    
    // Create a new subgroup with a generated ID
    const subGroups = [...groups[groupIndex].subGroups];
    const newSubGroupId = Math.max(0, ...subGroups.map(sg => sg.id)) + 1;
    const newSubGroup = {
      id: newSubGroupId,
      ...subGroup
    };
    
    subGroups.push(newSubGroup);
    groups[groupIndex].subGroups = subGroups;
    
    // Update the template with the modified groups
    return templatesService.updateTemplate(templateId, { groups });
  },
  
  updateSubGroup: async (templateId: number, groupId: number, subGroupId: number, updates: Partial<SubGroup>): Promise<Template | null> => {
    // First get the current template
    const template = await templatesService.getTemplateById(templateId);
    
    if (!template) return null;
    
    // Find the group and subgroup
    const groups = [...template.groups];
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      throw new Error(`Group with ID ${groupId} not found in template ${templateId}`);
    }
    
    const subGroups = [...groups[groupIndex].subGroups];
    const subGroupIndex = subGroups.findIndex(sg => sg.id === subGroupId);
    
    if (subGroupIndex === -1) {
      throw new Error(`SubGroup with ID ${subGroupId} not found in group ${groupId}`);
    }
    
    // Update the subgroup
    subGroups[subGroupIndex] = {
      ...subGroups[subGroupIndex],
      ...updates
    };
    
    groups[groupIndex].subGroups = subGroups;
    
    // Update the template with the modified groups
    return templatesService.updateTemplate(templateId, { groups });
  },
  
  deleteSubGroup: async (templateId: number, groupId: number, subGroupId: number): Promise<Template | null> => {
    // First get the current template
    const template = await templatesService.getTemplateById(templateId);
    
    if (!template) return null;
    
    // Find the group
    const groups = [...template.groups];
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      throw new Error(`Group with ID ${groupId} not found in template ${templateId}`);
    }
    
    // Filter out the subgroup to delete
    groups[groupIndex].subGroups = groups[groupIndex].subGroups.filter(sg => sg.id !== subGroupId);
    
    // Update the template with the modified groups
    return templatesService.updateTemplate(templateId, { groups });
  },
  
  addShift: async (templateId: number, groupId: number, subGroupId: number, shift: any): Promise<Template | null> => {
    // First get the current template
    const { data: currentTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching template for shift addition:', fetchError);
      throw fetchError;
    }
    
    if (!currentTemplate) return null;
    
    // Find the group and subgroup
    const groups = [...currentTemplate.groups];
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      throw new Error(`Group with ID ${groupId} not found in template ${templateId}`);
    }
    
    const subGroups = [...groups[groupIndex].subGroups];
    const subGroupIndex = subGroups.findIndex(sg => sg.id === subGroupId);
    
    if (subGroupIndex === -1) {
      throw new Error(`SubGroup with ID ${subGroupId} not found in group ${groupId}`);
    }
    
    // Add the new shift
    const shifts = [...subGroups[subGroupIndex].shifts];
    const newShift = {
      id: crypto.randomUUID(), // Generate a UUID for the shift
      ...shift
    };
    
    shifts.push(newShift);
    subGroups[subGroupIndex].shifts = shifts;
    groups[groupIndex].subGroups = subGroups;
    
    // Update the template with the modified groups
    const { data, error } = await supabase
      .from('templates')
      .update({
        groups,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding shift to template:', error);
      throw error;
    }
    
    // Transform the response data
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      groups: data.groups,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  updateShift: async (templateId: number, groupId: number, subGroupId: number, shiftId: string, updates: any): Promise<Template | null> => {
    // Implementation similar to other update methods
    const { data: currentTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (fetchError || !currentTemplate) {
      console.error('Error fetching template for shift update:', fetchError);
      throw fetchError || new Error('Template not found');
    }
    
    const groups = [...currentTemplate.groups];
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      throw new Error(`Group with ID ${groupId} not found`);
    }
    
    const subGroups = [...groups[groupIndex].subGroups];
    const subGroupIndex = subGroups.findIndex(sg => sg.id === subGroupId);
    
    if (subGroupIndex === -1) {
      throw new Error(`SubGroup with ID ${subGroupId} not found`);
    }
    
    const shifts = [...subGroups[subGroupIndex].shifts];
    const shiftIndex = shifts.findIndex(s => s.id === shiftId);
    
    if (shiftIndex === -1) {
      throw new Error(`Shift with ID ${shiftId} not found`);
    }
    
    shifts[shiftIndex] = { ...shifts[shiftIndex], ...updates };
    subGroups[subGroupIndex].shifts = shifts;
    groups[groupIndex].subGroups = subGroups;
    
    const { data, error } = await supabase
      .from('templates')
      .update({ 
        groups,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating shift:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      groups: data.groups,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  deleteShift: async (templateId: number, groupId: number, subGroupId: number, shiftId: string): Promise<Template | null> => {
    // Implementation similar to other delete methods
    const { data: currentTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (fetchError || !currentTemplate) {
      console.error('Error fetching template for shift deletion:', fetchError);
      throw fetchError || new Error('Template not found');
    }
    
    const groups = [...currentTemplate.groups];
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      throw new Error(`Group with ID ${groupId} not found`);
    }
    
    const subGroups = [...groups[groupIndex].subGroups];
    const subGroupIndex = subGroups.findIndex(sg => sg.id === subGroupId);
    
    if (subGroupIndex === -1) {
      throw new Error(`SubGroup with ID ${subGroupId} not found`);
    }
    
    // Filter out the shift to delete
    subGroups[subGroupIndex].shifts = subGroups[subGroupIndex].shifts.filter(s => s.id !== shiftId);
    groups[groupIndex].subGroups = subGroups;
    
    const { data, error } = await supabase
      .from('templates')
      .update({
        groups,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) {
      console.error('Error deleting shift:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      groups: data.groups,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  cloneGroup: async (templateId: number, groupId: number): Promise<Template | null> => {
    const { data: currentTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (fetchError || !currentTemplate) {
      console.error('Error fetching template for group cloning:', fetchError);
      throw fetchError || new Error('Template not found');
    }
    
    const groups = [...currentTemplate.groups];
    const groupToClone = groups.find(g => g.id === groupId);
    
    if (!groupToClone) {
      throw new Error(`Group with ID ${groupId} not found`);
    }
    
    // Create a deep clone of the group with a new ID
    const newGroupId = Math.max(0, ...groups.map(g => g.id)) + 1;
    const clonedGroup = JSON.parse(JSON.stringify(groupToClone));
    clonedGroup.id = newGroupId;
    clonedGroup.name = `${clonedGroup.name} (Copy)`;
    
    groups.push(clonedGroup);
    
    const { data, error } = await supabase
      .from('templates')
      .update({
        groups,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) {
      console.error('Error cloning group:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      groups: data.groups,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  cloneSubGroup: async (templateId: number, groupId: number, subGroupId: number): Promise<Template | null> => {
    const { data: currentTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (fetchError || !currentTemplate) {
      console.error('Error fetching template for subgroup cloning:', fetchError);
      throw fetchError || new Error('Template not found');
    }
    
    const groups = [...currentTemplate.groups];
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      throw new Error(`Group with ID ${groupId} not found`);
    }
    
    const subGroups = [...groups[groupIndex].subGroups];
    const subGroupToClone = subGroups.find(sg => sg.id === subGroupId);
    
    if (!subGroupToClone) {
      throw new Error(`SubGroup with ID ${subGroupId} not found`);
    }
    
    // Create a deep clone of the subgroup with a new ID
    const newSubGroupId = Math.max(0, ...subGroups.map(sg => sg.id)) + 1;
    const clonedSubGroup = JSON.parse(JSON.stringify(subGroupToClone));
    clonedSubGroup.id = newSubGroupId;
    clonedSubGroup.name = `${clonedSubGroup.name} (Copy)`;
    
    subGroups.push(clonedSubGroup);
    groups[groupIndex].subGroups = subGroups;
    
    const { data, error } = await supabase
      .from('templates')
      .update({
        groups,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) {
      console.error('Error cloning subgroup:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      groups: data.groups,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  exportTemplateToPdf: async (templateId: number): Promise<Blob> => {
    // This would typically be handled on the frontend
    // But we'll implement a stub here that could be expanded later
    const template = await templatesService.getTemplateById(templateId);
    
    if (!template) {
      throw new Error('Template not found');
    }
    
    // In a real implementation, you might generate the PDF on a server
    // and return a URL or a blob
    throw new Error('PDF export is not implemented on the backend yet');
  },
  
  saveTemplateAsDraft: async (template: Partial<Template>): Promise<Template> => {
    // Save the template with a draft status
    const templateToSave = {
      ...template,
      status: 'draft' // You might need to add this field to your model
    };
    
    // If it's a new draft
    if (!templateToSave.id) {
      return templatesService.createTemplate(templateToSave as Omit<Template, 'id' | 'createdAt' | 'updatedAt'>);
    }
    
    // If updating an existing draft
    const updated = await templatesService.updateTemplate(templateToSave.id as number, templateToSave);
    
    if (!updated) {
      throw new Error('Failed to update template draft');
    }
    
    return updated;
  }
};
