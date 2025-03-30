import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplates } from '@/api/hooks';
import { Template } from '@/api/models/types';
import Navbar from '@/components/Navbar';
import TemplateForm from '@/components/TemplateForm';
import GroupSection from '@/components/GroupSection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Calendar, ClipboardList, Edit, Trash2, Save, FileDown, Play, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const TemplateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { useAllTemplates, useDeleteTemplate } = useTemplates();
  const { data: templates = [], isLoading } = useAllTemplates();
  const deleteTemplateMutation = useDeleteTemplate();

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
      onSuccess: () => toast.success('Template deleted successfully'),
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

  // Sample groups data
  const groups = [
    { id: 1, name: 'Convention Centre', subGroups: 3, color: 'blue' as const },
    { id: 2, name: 'Exhibition Centre', subGroups: 2, color: 'green' as const },
    { id: 3, name: 'Theatre', subGroups: 4, color: 'red' as const },
  ];

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
          {/* Inline template creation form */}
          <TemplateForm />

          {/* Groups Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
                  Groups
                </h2>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">
                  {groups.length}
                </span>
              </div>
              <Button className="flex items-center space-x-2">
                <span>Add Group</span>
                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              </Button>
            </div>
            {groups.map((group, index) => (
              <div key={group.id} className="reveal-on-scroll" style={{ transitionDelay: `${index * 150}ms` }}>
                <GroupSection id={group.id} name={group.name} subGroups={group.subGroups} color={group.color} />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-white/10 mt-8 reveal-on-scroll">
            <div className="flex items-center space-x-4 flex-wrap gap-2">
              <Button className="flex items-center space-x-2">
                <Save size={16} className="group-hover:scale-110 transition-transform duration-300" />
                <span>Save as Draft</span>
              </Button>
              <Button className="flex items-center space-x-2">
                <Play size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                <span>Preview</span>
              </Button>
              <Button className="flex items-center space-x-2">
                <FileDown size={16} className="group-hover:translate-y-1 transition-transform duration-300" />
                <span>Export to PDF</span>
              </Button>
            </div>
            <Button className="button-blue">
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
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => window.scrollTo(0, 0)}>
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
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => window.scrollTo(0, 0)}>
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
        </div>
      </main>
    </div>
  );
};

export default TemplateDashboard;