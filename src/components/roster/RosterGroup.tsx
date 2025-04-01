import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Plus, Trash, Copy } from 'lucide-react';
import { RosterSubGroup } from './RosterSubGroup';
import { Group } from '@/api/models/types';
import AddSubGroupDialog from './dialogs/AddSubGroupDialog';
import { useTemplates } from '@/api/hooks';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RosterGroupProps {
  templateId?: number;
  group: Group;
  readOnly?: boolean;
  isOver?: boolean;
  onAddSubGroup?: (groupId: number, subGroupName: string) => void;
  onEditGroup?: (groupId: number, updates: Partial<Group>) => void;
  onDeleteGroup?: (groupId: number) => void;
  onCloneGroup?: (groupId: number) => void;
}

export const RosterGroup: React.FC<RosterGroupProps> = ({ 
  templateId,
  group, 
  readOnly, 
  isOver,
  onAddSubGroup,
  onEditGroup,
  onDeleteGroup,
  onCloneGroup
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [name, setName] = useState<DepartmentName>(group.name);
  const [color, setColor] = useState<DepartmentColor>(group.color);
  const { toast } = useToast();
  
  const { useCloneGroup, useAddSubGroup, useUpdateGroup, useDeleteGroup } = useTemplates();
  const cloneGroupMutation = useCloneGroup();
  const addSubGroupMutation = useAddSubGroup();
  const updateGroupMutation = useUpdateGroup();
  const deleteGroupMutation = useDeleteGroup();
  
  const getGroupCardClass = () => {
    switch (group.color) {
      case 'blue':
        return 'bg-blue-900/20 border-blue-500/30 hover:bg-blue-900/30 hover:border-blue-500/50';
      case 'green':
        return 'bg-green-900/20 border-green-500/30 hover:bg-green-900/30 hover:border-green-500/50';
      case 'red':
        return 'bg-red-900/20 border-red-500/30 hover:bg-red-900/30 hover:border-red-500/50';
      case 'purple':
        return 'bg-purple-900/20 border-purple-500/30 hover:bg-purple-900/30 hover:border-purple-500/50';
      default:
        return 'bg-blue-900/20 border-blue-500/30 hover:bg-blue-900/30 hover:border-blue-500/50';
    }
  };
  
  const handleAddSubGroup = (groupId: number, name: string) => {
    if (onAddSubGroup) {
      onAddSubGroup(groupId, name);
    } else if (templateId) {
      addSubGroupMutation.mutate({
        templateId,
        groupId,
        subGroup: { name, shifts: [] }
      }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Subgroup "${name}" added to ${group.name}`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to add subgroup: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    } else {
      // Mock implementation for demo
      toast({
        title: "Subgroup Added",
        description: `Subgroup "${name}" would be added to ${group.name}`,
      });
    }
  };
  
  const handleSaveEdit = () => {
    if (onEditGroup) {
      onEditGroup(group.id, { name, color });
    } else if (templateId) {
      updateGroupMutation.mutate({
        templateId,
        groupId: group.id,
        updates: { name, color }
      }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Group updated successfully`,
          });
          setIsEditDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to update group: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    } else {
      // Mock implementation for demo
      toast({
        title: "Group Updated",
        description: `${group.name} would be updated to ${name}`,
      });
      setIsEditDialogOpen(false);
    }
  };
  
  const handleDeleteGroup = () => {
    if (onDeleteGroup) {
      onDeleteGroup(group.id);
    } else if (templateId) {
      deleteGroupMutation.mutate({
        templateId,
        groupId: group.id
      }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Group deleted successfully`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete group: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    } else {
      // Mock implementation for demo
      toast({
        title: "Group Deleted",
        description: `${group.name} would be deleted`,
      });
    }
  };
  
  const handleCloneGroup = () => {
    if (onCloneGroup) {
      onCloneGroup(group.id);
    } else if (templateId) {
      cloneGroupMutation.mutate({
        templateId,
        groupId: group.id
      }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Group cloned successfully`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to clone group: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    } else {
      // Mock implementation for demo
      toast({
        title: "Group Cloned",
        description: `A copy of ${group.name} would be created`,
      });
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className={`rounded-lg p-4 border ${getGroupCardClass()} transition-all duration-300 ${isOver ? 'border-2 border-dashed border-white/50' : ''}`}>
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="text-lg font-medium text-white flex items-center">
            {isExpanded ? (
              <ChevronDown className="mr-2 h-5 w-5 text-white/80" />
            ) : (
              <ChevronUp className="mr-2 h-5 w-5 text-white/80" />
            )}
            {group.name}
            <span className="ml-2 text-sm text-white/60">
              {group.subGroups.length} sub-groups
            </span>
          </h3>
          
          {!readOnly && (
            <div className="flex items-center space-x-2">
              <AddSubGroupDialog
                groupId={group.id}
                groupName={group.name}
                onAddSubGroup={handleAddSubGroup}
                trigger={
                  <button 
                    className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all duration-200 hover:scale-110"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Plus size={16} />
                  </button>
                }
              />
              
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-blue-400/80 hover:text-blue-400 transition-all duration-200 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setName(group.name);
                      setColor(group.color);
                    }}
                  >
                    <Edit size={16} />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Edit Group</DialogTitle>
                    <DialogDescription>
                      Make changes to the department group here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="group-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="group-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="col-span-3 bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="group-color" className="text-right">
                        Color
                      </Label>
                      <Select
                        value={color}
                        onValueChange={handleColorChange}
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
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleSaveEdit}>
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <button 
                className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-indigo-400/80 hover:text-indigo-400 transition-all duration-200 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloneGroup();
                }}
              >
                <Copy size={16} />
              </button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button 
                    className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-red-400/80 hover:text-red-400 transition-all duration-200 hover:scale-110"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash size={16} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Department</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the {group.name} department? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteGroup}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {group.subGroups.map((subGroup) => (
              <RosterSubGroup 
                key={subGroup.id} 
                templateId={templateId}
                subGroup={subGroup} 
                groupId={group.id}
                groupColor={group.color}
                readOnly={readOnly} 
              />
            ))}
            
            {!readOnly && group.subGroups.length === 0 && (
              <div className="text-center p-4 bg-black/20 rounded-lg border border-white/10">
                <p className="text-white/60 mb-2">No subgroups in this department</p>
                <AddSubGroupDialog
                  groupId={group.id}
                  groupName={group.name}
                  onAddSubGroup={handleAddSubGroup}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Plus size={14} className="mr-2" />
                      Add First Sub-Group
                    </Button>
                  }
                />
              </div>
            )}
            
            {!readOnly && group.subGroups.length > 0 && (
              <AddSubGroupDialog
                groupId={group.id}
                groupName={group.name}
                onAddSubGroup={handleAddSubGroup}
                trigger={
                  <button className="w-full py-2 mt-2 rounded-md flex items-center justify-center bg-black/20 hover:bg-black/30 text-white/70 hover:text-white border border-white/5 hover:border-white/10 transition-all duration-200">
                    <Plus size={14} className="mr-2" />
                    <span>Add Sub-Group</span>
                  </button>
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
