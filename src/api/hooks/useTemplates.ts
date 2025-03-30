
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templatesService } from '../services/templatesService';
import { Template } from '../models/types';

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
  
  return {
    useAllTemplates,
    useTemplate,
    useCreateTemplate,
    useUpdateTemplate,
    useDeleteTemplate
  };
};
