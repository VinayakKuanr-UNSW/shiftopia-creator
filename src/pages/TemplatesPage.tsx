
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplates } from '@/api/hooks';
import { Template } from '@/api/models/types';
import Navbar from '@/components/Navbar';
import TemplateForm from '@/components/TemplateForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Calendar, ClipboardList, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const TemplatesPage: React.FC = () => {
  const [isNewTemplateFormOpen, setIsNewTemplateFormOpen] = useState(false);
  const navigate = useNavigate();
  
  // Fetch all templates
  const { useAllTemplates, useDeleteTemplate } = useTemplates();
  const { data: templates = [], isLoading } = useAllTemplates();
  const deleteTemplateMutation = useDeleteTemplate();
  
  const handleDeleteTemplate = (id: number) => {
    deleteTemplateMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Template deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete template");
      },
    });
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Template Management</h1>
          
          <Dialog open={isNewTemplateFormOpen} onOpenChange={setIsNewTemplateFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus size={16} className="mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a template for recurring rosters.
                </DialogDescription>
              </DialogHeader>
              <TemplateForm onComplete={() => setIsNewTemplateFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="grid">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-gray-900">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-700 rounded-lg">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-300">No Templates Found</h3>
                <p className="text-gray-500 mt-2 mb-6">Create your first template to get started.</p>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setIsNewTemplateFormOpen(true)}
                >
                  <Plus size={16} className="mr-2" />
                  New Template
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template: Template) => (
                  <Card key={template.id} className="bg-gray-900 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-400" />
                        {template.name}
                      </CardTitle>
                      <CardDescription>
                        {template.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-400">
                        <div className="flex justify-between py-1">
                          <span>Groups:</span>
                          <span className="text-white">{template.groups.length}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Created:</span>
                          <span className="text-white">{getFormattedDate(template.createdAt)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Updated:</span>
                          <span className="text-white">{getFormattedDate(template.updatedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="border-gray-700 hover:bg-gray-800"
                        onClick={() => navigate(`/rostering/templates/${template.id}`)}
                      >
                        View Details
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white hover:bg-gray-800"
                          onClick={() => navigate(`/rostering/templates/${template.id}/edit`)}
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500 hover:bg-gray-800"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="table">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-700 rounded-lg">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-300">No Templates Found</h3>
                <p className="text-gray-500 mt-2 mb-6">Create your first template to get started.</p>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setIsNewTemplateFormOpen(true)}
                >
                  <Plus size={16} className="mr-2" />
                  New Template
                </Button>
              </div>
            ) : (
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-900">
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Groups</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template: Template) => (
                      <TableRow key={template.id} className="border-gray-800 hover:bg-gray-900">
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{template.description || "—"}</TableCell>
                        <TableCell>{template.groups.length}</TableCell>
                        <TableCell>{getFormattedDate(template.createdAt)}</TableCell>
                        <TableCell>{getFormattedDate(template.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-white hover:bg-gray-800"
                              onClick={() => navigate(`/rostering/templates/${template.id}/edit`)}
                            >
                              <Edit size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500 hover:bg-gray-800"
                              onClick={() => handleDeleteTemplate(template.id)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TemplatesPage;
