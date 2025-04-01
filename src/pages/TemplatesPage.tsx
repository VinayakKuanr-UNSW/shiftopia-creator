
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTemplates } from '@/api/hooks';
import { Template, Group, DepartmentName, DepartmentColor } from '@/api/models/types';
import TemplateForm from '@/components/TemplateForm';
import { PlusCircle, FileText, Download, Eye, Copy, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

const TemplatesPage = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplateId, setCurrentTemplateId] = useState<number | null>(null);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupColor, setNewGroupColor] = useState<DepartmentColor>('blue');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const { 
    useAllTemplates, 
    useCreateTemplate, 
    useUpdateTemplate, 
    useDeleteTemplate,
    useAddGroup,
    useCloneGroup,
    useSaveAsDraft
  } = useTemplates();
  
  const templatesQuery = useAllTemplates();
  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();
  const addGroupMutation = useAddGroup();
  const cloneGroupMutation = useCloneGroup();
  const saveAsDraftMutation = useSaveAsDraft();
  
  useEffect(() => {
    if (templatesQuery.data) {
      setTemplates(templatesQuery.data);
    }
  }, [templatesQuery.data]);
  
  const handleAddGroup = () => {
    if (!currentTemplateId) {
      toast.error('No template selected');
      return;
    }
    
    const newGroup = {
      name: newGroupName || 'New Group' as DepartmentName,
      color: newGroupColor,
      subGroups: [] 
    };
    
    addGroupMutation.mutate({ templateId: currentTemplateId, group: newGroup }, {
      onSuccess: () => {
        toast.success('Group added successfully');
        templatesQuery.refetch();
      },
      onError: () => {
        toast.error('Failed to add group');
      }
    });
  };
  
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
    
    saveAsDraftMutation.mutate({
      ...currentTemplate,
      status: 'draft'
    }, {
      onSuccess: () => toast.success('Template saved as draft'),
      onError: () => toast.error('Failed to save as draft')
    });
  };
  
  const handleDeleteTemplate = (id: number) => {
    deleteTemplateMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Template deleted');
        templatesQuery.refetch();
      },
      onError: () => {
        toast.error('Failed to delete template');
      }
    });
  };
  
  const handleCloneTemplate = (template: Template) => {
    const clonedTemplate = {
      ...template,
      name: `${template.name} (Copy)`,
    };
    
    delete (clonedTemplate as any).id;
    
    createTemplateMutation.mutate(clonedTemplate as any, {
      onSuccess: () => {
        toast.success('Template cloned successfully');
        templatesQuery.refetch();
      },
      onError: () => {
        toast.error('Failed to clone template');
      }
    });
  };
  
  const handleExportToPdf = (template: Template) => {
    // This would typically call a PDF generation service
    toast.success('Template exported to PDF');
  };
  
  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Template Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="create">Create Template</TabsTrigger>
          <TabsTrigger value="manage">Template Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Template</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateForm onComplete={() => {
                templatesQuery.refetch();
                setActiveTab('manage');
              }} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <div className="flex justify-between mb-4">
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}
              >
                Grid View
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'bg-primary text-primary-foreground' : ''}
              >
                Table View
              </Button>
            </div>
          </div>
          
          {templatesQuery.isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {templates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No templates found</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setActiveTab('create')}
                  >
                    Create Your First Template
                  </Button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map(template => (
                    <Card key={template.id} className="relative">
                      <CardHeader>
                        <CardTitle>{template.name}</CardTitle>
                        {template.status === 'draft' && (
                          <span className="absolute top-3 right-3 bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                            Draft
                          </span>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2 text-gray-600">{template.description || 'No description'}</p>
                        <p className="text-sm text-gray-500 mb-4">
                          {template.groups?.length || 0} Groups • Created {new Date(template.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setCurrentTemplateId(template.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCloneTemplate(template)}
                          >
                            <Copy className="h-4 w-4 mr-1" /> Clone
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleExportToPdf(template)}
                          >
                            <Download className="h-4 w-4 mr-1" /> Export
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Created</th>
                        <th className="px-4 py-2 text-left">Updated</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map(template => (
                        <tr key={template.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{template.name}</td>
                          <td className="px-4 py-3">{new Date(template.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">{new Date(template.updatedAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            {template.status === 'draft' ? (
                              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                Draft
                              </span>
                            ) : (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => setCurrentTemplateId(template.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleCloneTemplate(template)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleExportToPdf(template)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteTemplate(template.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          
          {currentTemplateId && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Template Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 flex-wrap">
                  <Button onClick={handleAddGroup} className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Group
                  </Button>
                  <Button variant="outline" onClick={handleSaveAsDraft} className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export to PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplatesPage;
