
import { Template } from '../models/types';
import { templates } from '../data/mockData';

export const templatesService = {
  getAllTemplates: async (): Promise<Template[]> => {
    // In a real app, this would be an API call
    return Promise.resolve([...templates]);
  },
  
  getTemplateById: async (id: number): Promise<Template | null> => {
    const template = templates.find(t => t.id === id);
    return Promise.resolve(template || null);
  },
  
  createTemplate: async (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> => {
    const newTemplate: Template = {
      ...template,
      id: Math.max(...templates.map(t => t.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    templates.push(newTemplate);
    return Promise.resolve(newTemplate);
  },
  
  updateTemplate: async (id: number, updates: Partial<Template>): Promise<Template | null> => {
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedTemplate = {
      ...templates[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    
    templates[index] = updatedTemplate;
    return Promise.resolve(updatedTemplate);
  },
  
  deleteTemplate: async (id: number): Promise<boolean> => {
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(false);
    
    templates.splice(index, 1);
    return Promise.resolve(true);
  }
};
