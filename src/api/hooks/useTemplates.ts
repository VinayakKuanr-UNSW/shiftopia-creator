
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templatesService } from '../services/templatesService';
import { Template, Group, SubGroup } from '../models/types';

export const useTemplates = () => {
  const queryClient = useQueryClient();
  
  // Get all templates
  const useAllTemplates = () => {
    return useQuery({
      queryKey: ['templates'],
      queryFn: templatesService.getAllTemplates
    });
  };
  
  // Get template by ID
  const useTemplate = (id: number) => {
    return useQuery({
      queryKey: ['templates', id],
      queryFn: () => templatesService.getTemplateById(id),
      enabled: !!id
    });
  };
  
  // Create template
  const useCreateTemplate = () => {
    return useMutation({
      mutationFn: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => 
        templatesService.createTemplate(template),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['templates'] });
      }
    });
  };
  
  // Update template
  const useUpdateTemplate = () => {
    return useMutation({
      mutationFn: ({ id, updates }: { id: number, updates: Partial<Template> }) => 
        templatesService.updateTemplate(id, updates),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  // Delete template
  const useDeleteTemplate = () => {
    return useMutation({
      mutationFn: (id: number) => templatesService.deleteTemplate(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['templates'] });
      }
    });
  };
  
  // Group operations
  const useAddGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, group }: { templateId: number, group: Omit<Group, 'id'> }) => 
        templatesService.addGroup(templateId, group),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  const useUpdateGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, updates }: { templateId: number, groupId: number, updates: Partial<Group> }) => 
        templatesService.updateGroup(templateId, groupId, updates),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  const useDeleteGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId }: { templateId: number, groupId: number }) => 
        templatesService.deleteGroup(templateId, groupId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  const useCloneGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId }: { templateId: number, groupId: number }) => 
        templatesService.cloneGroup(templateId, groupId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  // SubGroup operations
  const useAddSubGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroup }: { templateId: number, groupId: number, subGroup: Omit<SubGroup, 'id'> }) => 
        templatesService.addSubGroup(templateId, groupId, subGroup),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  const useUpdateSubGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId, updates }: 
      { templateId: number, groupId: number, subGroupId: number, updates: Partial<SubGroup> }) => 
        templatesService.updateSubGroup(templateId, groupId, subGroupId, updates),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  const useDeleteSubGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId }: { templateId: number, groupId: number, subGroupId: number }) => 
        templatesService.deleteSubGroup(templateId, groupId, subGroupId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  const useCloneSubGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId }: { templateId: number, groupId: number, subGroupId: number }) => 
        templatesService.cloneSubGroup(templateId, groupId, subGroupId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  // Shift operations
  const useAddShift = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId, shift }: 
      { templateId: number, groupId: number, subGroupId: number, shift: any }) => 
        templatesService.addShift(templateId, groupId, subGroupId, shift),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  const useUpdateShift = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId, shiftId, updates }: 
      { templateId: number, groupId: number, subGroupId: number, shiftId: string, updates: any }) => 
        templatesService.updateShift(templateId, groupId, subGroupId, shiftId, updates),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  const useDeleteShift = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId, shiftId }: 
      { templateId: number, groupId: number, subGroupId: number, shiftId: string }) => 
        templatesService.deleteShift(templateId, groupId, subGroupId, shiftId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };
  
  // Additional operations
  const useSaveAsDraft = () => {
    return useMutation({
      mutationFn: (template: Partial<Template>) => 
        templatesService.saveTemplateAsDraft(template),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['templates'] });
        queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
      }
    });
  };
  
  return {
    useAllTemplates,
    useTemplate,
    useCreateTemplate,
    useUpdateTemplate,
    useDeleteTemplate,
    useAddGroup,
    useUpdateGroup,
    useDeleteGroup,
    useCloneGroup,
    useAddSubGroup,
    useUpdateSubGroup,
    useDeleteSubGroup,
    useCloneSubGroup,
    useAddShift,
    useUpdateShift,
    useDeleteShift,
    useSaveAsDraft
  };
};
