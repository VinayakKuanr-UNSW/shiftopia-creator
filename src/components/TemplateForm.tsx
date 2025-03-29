
import React, { useState } from 'react';
import { useTemplates } from '@/api/hooks';
import { Calendar, ClipboardList, Building, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface TemplateFormProps {
  onComplete?: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { useCreateTemplate } = useTemplates();
  const createTemplateMutation = useCreateTemplate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Template name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    // Create empty template structure with the basic info
    createTemplateMutation.mutate({
      name,
      description,
      groups: [
        {
          id: 1,
          name: department as any || 'Convention Centre', // Default department
          color: 'blue',
          subGroups: [
            {
              id: 1,
              name: 'Team A',
              shifts: []
            }
          ]
        }
      ]
    }, {
      onSuccess: () => {
        toast.success("Template created successfully");
        setName('');
        setDescription('');
        setDepartment('');
        setIsSubmitting(false);
        if (onComplete) onComplete();
      },
      onError: () => {
        toast.error("Failed to create template");
        setIsSubmitting(false);
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter template name"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter template description"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="department">Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger id="department" className="mt-1">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Convention Centre">Convention Centre</SelectItem>
              <SelectItem value="Exhibition Centre">Exhibition Centre</SelectItem>
              <SelectItem value="Theatre">Theatre</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">Creating...</span>
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
            </>
          ) : (
            <>Create Template</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;
