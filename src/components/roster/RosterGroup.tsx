
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Plus, Trash } from 'lucide-react';
import { RosterSubGroup } from './RosterSubGroup';
import { Group } from '@/api/models/types';
import AddSubGroupDialog from './dialogs/AddSubGroupDialog';
import { useToast } from '@/hooks/use-toast';
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

interface RosterGroupProps {
  group: Group;
  readOnly?: boolean;
  isOver?: boolean;
  onAddSubGroup?: (groupId: number, subGroupName: string) => void;
  onEditGroup?: (groupId: number, updates: Partial<Group>) => void;
  onDeleteGroup?: (groupId: number) => void;
}

export const RosterGroup: React.FC<RosterGroupProps> = ({ 
  group, 
  readOnly, 
  isOver,
  onAddSubGroup,
  onEditGroup,
  onDeleteGroup
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();
  
  const getGroupCardClass = () => {
    switch (group.color) {
      case 'blue':
        return 'group-card-blue';
      case 'green':
        return 'group-card-green';
      case 'red':
        return 'group-card-red';
      case 'purple':
        return 'group-card-purple';
      default:
        return 'group-card-blue';
    }
  };
  
  const handleAddSubGroup = (groupId: number, name: string) => {
    if (onAddSubGroup) {
      onAddSubGroup(groupId, name);
    } else {
      // Mock implementation for demo
      toast({
        title: "Subgroup Added",
        description: `Subgroup "${name}" would be added to ${group.name}`,
      });
    }
  };
  
  const handleEditGroup = () => {
    if (onEditGroup) {
      // In a real app, you'd open a dialog to edit the group
      onEditGroup(group.id, { name: group.name });
    } else {
      // Mock implementation for demo
      toast({
        title: "Edit Group",
        description: `Editing ${group.name} department`,
      });
    }
  };
  
  const handleDeleteGroup = () => {
    if (onDeleteGroup) {
      onDeleteGroup(group.id);
    } else {
      // Mock implementation for demo
      toast({
        title: "Delete Group",
        description: `${group.name} department would be deleted`,
      });
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className={`rounded-lg p-4 ${getGroupCardClass()} hover-scale transition-all duration-300 ${isOver ? 'border-2 border-dashed border-white/50' : ''}`}>
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
          </h3>
          
          {!readOnly && (
            <div className="flex items-center space-x-2">
              <AddSubGroupDialog
                groupId={group.id}
                groupName={group.name}
                onAddSubGroup={handleAddSubGroup}
                trigger={
                  <button className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all duration-200 hover:scale-110">
                    <Plus size={16} />
                  </button>
                }
              />
              
              <button 
                className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-blue-400/80 hover:text-blue-400 transition-all duration-200 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditGroup();
                }}
              >
                <Edit size={16} />
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
