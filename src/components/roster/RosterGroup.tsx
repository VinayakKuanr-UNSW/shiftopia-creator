
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Copy } from 'lucide-react';
import RosterSubGroup from './RosterSubGroup';
import { Group, DepartmentName, DepartmentColor } from '@/api/models/types';

interface RosterGroupProps {
  group: Group;
  onAddSubGroup?: (groupId: number, name: string) => void;
  onUpdateGroup?: (groupId: number, updates: Partial<Group>) => void;
  onDeleteGroup?: (groupId: number) => void;
  onCloneGroup?: (groupId: number) => void;
  readOnly?: boolean;
}

const RosterGroup: React.FC<RosterGroupProps> = ({
  group,
  onAddSubGroup,
  onUpdateGroup,
  onDeleteGroup,
  onCloneGroup,
  readOnly = false
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddSubGroupDialogOpen, setIsAddSubGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState<DepartmentName>(group.name);
  const [newGroupColor, setNewGroupColor] = useState<DepartmentColor>(group.color);
  const [newSubGroupName, setNewSubGroupName] = useState('');

  const getGroupColorClass = (color: DepartmentColor) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 border-blue-300';
      case 'green':
        return 'bg-green-100 border-green-300';
      case 'red':
        return 'bg-red-100 border-red-300';
      case 'purple':
        return 'bg-purple-100 border-purple-300';
      case 'sky':
        return 'bg-sky-100 border-sky-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const handleEditGroup = () => {
    if (onUpdateGroup) {
      onUpdateGroup(group.id, {
        name: newGroupName,
        color: newGroupColor
      });
    }
    setIsEditDialogOpen(false);
  };

  const handleAddSubGroup = () => {
    if (onAddSubGroup && newSubGroupName.trim()) {
      onAddSubGroup(group.id, newSubGroupName.trim());
      setNewSubGroupName('');
    }
    setIsAddSubGroupDialogOpen(false);
  };

  const handleDeleteGroup = () => {
    if (onDeleteGroup) {
      onDeleteGroup(group.id);
    }
  };

  const handleCloneGroup = () => {
    if (onCloneGroup) {
      onCloneGroup(group.id);
    }
  };

  const handleColorChange = (value: DepartmentColor) => {
    setNewGroupColor(value);
  };

  return (
    <Card className={`mb-6 border-2 ${getGroupColorClass(group.color)}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{group.name}</CardTitle>
          {!readOnly && (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewGroupName(group.name);
                  setNewGroupColor(group.color);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloneGroup}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800"
                onClick={handleDeleteGroup}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {group.subGroups.length > 0 ? (
          <div className="space-y-4">
            {group.subGroups.map(subGroup => (
              <RosterSubGroup
                key={subGroup.id}
                groupId={group.id}
                subGroup={subGroup}
                readOnly={readOnly}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No sub-groups defined
          </div>
        )}

        {!readOnly && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            onClick={() => setIsAddSubGroupDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Sub-Group
          </Button>
        )}
      </CardContent>

      {/* Edit Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="groupName">Group Name</label>
              <Input
                id="groupName"
                value={newGroupName as string}
                onChange={(e) => setNewGroupName(e.target.value as DepartmentName)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="groupColor">Group Color</label>
              <Select
                value={newGroupColor}
                onValueChange={(value) => handleColorChange(value as DepartmentColor)}
              >
                <SelectTrigger id="groupColor">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="sky">Sky Blue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditGroup}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Sub-Group Dialog */}
      <Dialog open={isAddSubGroupDialogOpen} onOpenChange={setIsAddSubGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sub-Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="subGroupName">Sub-Group Name</label>
              <Input
                id="subGroupName"
                value={newSubGroupName}
                onChange={(e) => setNewSubGroupName(e.target.value)}
                placeholder="Enter sub-group name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSubGroupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubGroup}>Add Sub-Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RosterGroup;
