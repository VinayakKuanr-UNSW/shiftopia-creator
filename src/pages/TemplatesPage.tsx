
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplates } from '@/api/hooks';
import { Template } from '@/api/models/types';
import Navbar from '@/components/Navbar';
import TemplateForm from '@/components/TemplateForm';
import { RosterGroup } from '@/components/roster/RosterGroup';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Calendar, 
  ClipboardList, 
  Edit, 
  Trash2, 
  Save, 
  FileDown, 
  Play, 
  Sparkles,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import jsPDF from 'jspdf';

const TemplateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentTemplateId, setCurrentTemplateId] = useState<number | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState<'blue' | 'green' | 'red' | 'purple'>('blue');
  
  const { 
    useAllTemplates, 
    useDeleteTemplate, 
    useCreateTemplate, 
    useAddGroup,
    useSaveAsDraft
  } = useTemplates();
  
  const { data: templates = [], isLoading } = useAllTemplates();
  const deleteTemplateMutation = useDeleteTemplate();
  const createTemplateMutation = useCreateTemplate();
  const addGroupMutation = useAddGroup();
  const saveAsDraftMutation = useSaveAsDraft();
  
  // Create a new working template if none exists
  useEffect(() => {
    if (!isLoading && templates.length === 0 && !currentTemplateId) {
      createNewTemplate();
    } else if (!isLoading && templates.length > 0 && !currentTemplateId) {
      // Set the most recent template as the current one if none is selected
      const latestTemplate = [...templates].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      setCurrentTemplateId(latestTemplate.id);
      setTemplateName(latestTemplate.name);
      setTemplateDescription(latestTemplate.description || '');
    }
  }, [isLoading, templates, currentTemplateId]);
  
  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleDeleteTemplate = (id: number) => {
    deleteTemplateMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Template deleted successfully');
        // If the deleted template was the current one, reset the current template
        if (id === currentTemplateId) {
          setCurrentTemplateId(null);
          setTemplateName('');
          setTemplateDescription('');
        }
      },
      onError: () => toast.error('Failed to delete template'),
    });
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const createNewTemplate = () => {
    const newTemplate = {
      name: `New Template ${new Date().toLocaleTimeString()}`,
      description: 'New template description',
      groups: []
    };
    
    createTemplateMutation.mutate(newTemplate, {
      onSuccess: (data) => {
        toast.success('New template created');
        setCurrentTemplateId(data.id);
        setTemplateName(data.name);
        setTemplateDescription(data.description || '');
      },
      onError: () => toast.error('Failed to create new template')
    });
  };
  
  const handleAddGroup = () => {
    if (!currentTemplateId) {
      toast.error('No template selected');
      return;
    }
    
    const newGroup = {
      name: newGroupName || 'New Group',
      color: newGroupColor,
      subGroups: [] 
    };
    
    addGroupMutation.mutate({
      templateId: currentTemplateId,
      group: newGroup
    }, {
      onSuccess: () => {
        toast.success(`Group "${newGroup.name}" added successfully`);
        setIsAddGroupDialogOpen(false);
        setNewGroupName('');
      },
      onError: () => toast.error('Failed to add group')
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
  
  const handlePreview = () => {
    // In a real app, this might open a modal with a preview
    // For now, just show a toast
    toast.success('Preview functionality will be implemented in a future update');
  };
  
  const handleExportToPdf = () => {
    const template = templates.find(t => t.id === currentTemplateId);
    if (!template) {
      toast.error('No template selected for export');
      return;
    }
    
    try {
      // Initialize PDF
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(template.name, 20, 20);
      
      // Add description if exists
      if (template.description) {
        doc.setFontSize(12);
        doc.text(`Description: ${template.description}`, 20, 30);
      }
      
      let yPos = 40;
      
      // Add groups and subgroups
      template.groups.forEach((group, gIndex) => {
        // Group header
        doc.setFontSize(16);
        doc.text(`${group.name}`, 20, yPos);
        yPos += 10;
        
        // Subgroups
        group.subGroups.forEach((subGroup, sgIndex) => {
          doc.setFontSize(14);
          doc.text(`  ${subGroup.name}`, 20, yPos);
          yPos += 8;
          
          // Shifts
          subGroup.shifts.forEach((shift, sIndex) => {
            doc.setFontSize(10);
            doc.text(`    • ${shift.role}: ${shift.startTime} - ${shift.endTime} (${shift.remunerationLevel})`, 20, yPos);
            yPos += 6;
            
            // Add new page if needed
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
          });
          
          // Add space between subgroups
          yPos += 5;
          
          // Add new page if needed
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
        
        // Add space between groups
        yPos += 10;
        
        // Add new page if needed
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      // Save PDF
      doc.save(`template-${template.id}.pdf`);
      toast.success('Template exported to PDF successfully');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export template to PDF');
    }
  };
  
  const handleCreateTemplate = () => {
    if (!currentTemplateId) {
      toast.error('No template selected');
      return;
    }
    
    const currentTemplate = templates.find(t => t.id === currentTemplateId);
    if (!currentTemplate) {
      toast.error('Template not found');
      return;
    }
    
    // In a real app, you might change the status or copy to a different collection
    toast.success('Template created successfully');
  };
  
  // Get the current template from the templates array
  const currentTemplate = templates.find(t => t.id === currentTemplateId);

  return (
    <div className="min-h-screen relative bg-black text-white">
      {/* Top gradient background (if you have custom CSS/animation) */}
      <div className="top-gradient"></div>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* --- Creation Section --- */}
        <div className="mb-12 reveal-on-scroll">
          <div className="flex items-center mb-2">
            <Sparkles className="mr-2 text-purple-400" size={20} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 text-transparent bg-clip-text">
              Create Shift Template
            </h1>
          </div>
          <p className="text-white/60 max-w-3xl mb-6">
            Design your complete shift structure with groups, sub-groups, and individual shift assignments.
          </p>
          
          {/* Current template info */}
          {currentTemplate && (
            <div className="mb-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{currentTemplate.name}</h2>
                  <p className="text-white/60">{currentTemplate.description || 'No description'}</p>
                </div>
                <div className="text-white/60 text-sm">
                  Last updated: {getFormattedDate(currentTemplate.updatedAt)}
                </div>
              </div>
            </div>
          )}
          
          {/* New template button */}
          <Button 
            className="mb-6 bg-purple-600 hover:bg-purple-700"
            onClick={createNewTemplate}
          >
            <Plus size={16} className="mr-2" />
            Create New Template
          </Button>

          {/* Groups Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
                  Groups
                </h2>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">
                  {currentTemplate?.groups.length || 0}
                </span>
              </div>
              
              <Dialog open={isAddGroupDialogOpen} onOpenChange={setIsAddGroupDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <span>Add Group</span>
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Add New Group</DialogTitle>
                    <DialogDescription>
                      Create a new department group for your template.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="group-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="group-name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="e.g. Convention Centre"
                        className="col-span-3 bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="group-color" className="text-right">
                        Color
                      </Label>
                      <Select
                        value={newGroupColor}
                        onValueChange={(value) => setNewGroupColor(value as any)}
                      >
                        <SelectTrigger id="group-color" className="col-span-3 bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddGroupDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleAddGroup}>
                      Add Group
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {currentTemplate && currentTemplate.groups.map((group, index) => (
              <div key={group.id} className="reveal-on-scroll mb-6" style={{ transitionDelay: `${index * 150}ms` }}>
                <RosterGroup 
                  templateId={currentTemplateId || undefined}
                  group={group} 
                />
              </div>
            ))}
            
            {currentTemplate && currentTemplate.groups.length === 0 && (
              <div className="text-center p-6 bg-black/20 rounded-lg border border-white/10 mb-6">
                <p className="text-white/60 mb-4">No groups added yet</p>
                <Button
                  onClick={() => setIsAddGroupDialogOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus size={16} className="mr-2" />
                  Add First Group
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-white/10 mt-8 reveal-on-scroll">
            <div className="flex items-center space-x-4 flex-wrap gap-2">
              <Button 
                className="flex items-center space-x-2"
                onClick={handleSaveAsDraft}
              >
                <Save size={16} className="group-hover:scale-110 transition-transform duration-300" />
                <span>Save as Draft</span>
              </Button>
              <Button 
                className="flex items-center space-x-2"
                onClick={handlePreview}
              >
                <Play size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                <span>Preview</span>
              </Button>
              <Button 
                className="flex items-center space-x-2"
                onClick={handleExportToPdf}
              >
                <FileDown size={16} className="group-hover:translate-y-1 transition-transform duration-300" />
                <span>Export to PDF</span>
              </Button>
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleCreateTemplate}
            >
              <span className="relative inline-block">
                Create Template
                <span className="absolute inset-0 animate-shimmer"></span>
              </span>
            </Button>
          </div>
        </div>

        {/* --- Management Section --- */}
        <div className="mb-12 reveal-on-scroll">
          <h2 className="text-2xl font-bold mb-6">Template Management</h2>
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
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={createNewTemplate}>
                    <Plus size={16} className="mr-2" />
                    New Template
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template: Template) => (
                    <Card
                      key={template.id}
                      className="bg-gray-900 border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-purple-400" />
                          {template.name}
                        </CardTitle>
                        <CardDescription>
                          {template.description || 'No description provided'}
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
                          onClick={() => {
                            setCurrentTemplateId(template.id);
                            setTemplateName(template.name);
                            setTemplateDescription(template.description || '');
                            window.scrollTo(0, 0);
                          }}
                        >
                          View Details
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
                            onClick={() => {
                              // Clone functionality would be implemented here
                              toast.success('Clone functionality will be implemented in a future update');
                            }}
                          >
                            <Copy size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                            onClick={() => {
                              setCurrentTemplateId(template.id);
                              setTemplateName(template.name);
                              setTemplateDescription(template.description || '');
                              window.scrollTo(0, 0);
                            }}
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
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={createNewTemplate}>
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
                          <TableCell>{template.description || '—'}</TableCell>
                          <TableCell>{template.groups.length}</TableCell>
                          <TableCell>{getFormattedDate(template.createdAt)}</TableCell>
                          <TableCell>{getFormattedDate(template.updatedAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
                                onClick={() => {
                                  // Clone functionality would be implemented here
                                  toast.success('Clone functionality will be implemented in a future update');
                                }}
                              >
                                <Copy size={18} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white hover:bg-gray-800"
                                onClick={() => {
                                  setCurrentTemplateId(template.id);
                                  setTemplateName(template.name);
                                  setTemplateDescription(template.description || '');
                                  window.scrollTo(0, 0);
                                }}
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
        </div>
      </main>
    </div>
  );
};

export default TemplateDashboard;
