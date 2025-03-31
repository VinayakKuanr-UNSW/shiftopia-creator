
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Plus, Trash } from 'lucide-react';
import ShiftItem from '@/components/ShiftItem';
import { SubGroup } from '@/api/models/types';
import AddShiftDialog from './dialogs/AddShiftDialog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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

interface RosterSubGroupProps {
  subGroup: SubGroup;
  groupId: number;
  groupColor: string;
  readOnly?: boolean;
  onAddShift?: (groupId: number, subGroupId: number, shift: any) => void;
  onEditSubGroup?: (groupId: number, subGroupId: number, name: string) => void;
  onDeleteSubGroup?: (groupId: number, subGroupId: number) => void;
}

export const RosterSubGroup: React.FC<RosterSubGroupProps> = ({ 
  subGroup, 
  groupId,
  groupColor,
  readOnly,
  onAddShift,
  onEditSubGroup,
  onDeleteSubGroup
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();
  
  const handleAddShift = (groupId: number, subGroupId: number, shift: any) => {
    if (onAddShift) {
      onAddShift(groupId, subGroupId, shift);
    } else {
      // Mock implementation for demo
      toast({
        title: "Shift Added",
        description: `${shift.role} shift added to ${subGroup.name}`,
      });
    }
  };
  
  const handleEditSubGroup = () => {
    if (onEditSubGroup) {
      onEditSubGroup(groupId, subGroup.id, subGroup.name);
    } else {
      // Mock implementation for demo
      toast({
        title: "Edit Subgroup",
        description: `Editing ${subGroup.name} subgroup`,
      });
    }
  };
  
  const handleDeleteSubGroup = () => {
    if (onDeleteSubGroup) {
      onDeleteSubGroup(groupId, subGroup.id);
    } else {
      // Mock implementation for demo
      toast({
        title: "Delete Subgroup",
        description: `${subGroup.name} subgroup would be deleted`,
      });
    }
  };
  
  return (
    <div className="rounded-lg p-3 bg-black/20 border border-white/10 backdrop-blur-sm">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="text-md font-medium text-white/90 flex items-center">
          {isExpanded ? (
            <ChevronDown className="mr-2 h-4 w-4 text-white/60" />
          ) : (
            <ChevronUp className="mr-2 h-4 w-4 text-white/60" />
          )}
          {subGroup.name}
        </h4>
        
        {!readOnly && (
          <div className="flex items-center space-x-2">
            <AddShiftDialog
              groupId={groupId}
              subGroupId={subGroup.id}
              date={new Date().toISOString().split('T')[0]} // This should come from props in a real app
              onAddShift={handleAddShift}
              trigger={
                <button 
                  className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all duration-200 hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus size={14} />
                </button>
              }
            />
            
            <button 
              className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-blue-400/80 hover:text-blue-400 transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                handleEditSubGroup();
              }}
            >
              <Edit size={14} />
            </button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button 
                  className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-red-400/80 hover:text-red-400 transition-all duration-200 hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash size={14} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Subgroup</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the {subGroup.name} subgroup? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteSubGroup}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {subGroup.shifts.map((shift) => (
            <ShiftItem 
              key={shift.id}
              id={shift.id}
              role={shift.role}
              startTime={shift.startTime}
              endTime={shift.endTime}
              breakDuration={shift.breakDuration}
              remunerationLevel={shift.remunerationLevel}
              employeeId={shift.employeeId}
              employee={shift.employee}
              status={shift.status}
            />
          ))}
          
          {!readOnly && subGroup.shifts.length === 0 && (
            <div className="text-center p-3 bg-black/10 rounded-lg border border-white/5">
              <p className="text-white/60 text-sm mb-2">No shifts in this subgroup</p>
              <AddShiftDialog
                groupId={groupId}
                subGroupId={subGroup.id}
                date={new Date().toISOString().split('T')[0]}
                onAddShift={handleAddShift}
                trigger={
                  <Button variant="outline" size="sm">
                    <Plus size={12} className="mr-1" />
                    Add First Shift
                  </Button>
                }
              />
            </div>
          )}
          
          {!readOnly && subGroup.shifts.length > 0 && (
            <AddShiftDialog
              groupId={groupId}
              subGroupId={subGroup.id}
              date={new Date().toISOString().split('T')[0]}
              onAddShift={handleAddShift}
              trigger={
                <button className="w-full py-1.5 mt-2 rounded-md flex items-center justify-center bg-black/20 hover:bg-black/30 text-white/70 hover:text-white border border-white/5 hover:border-white/10 transition-all duration-200 text-sm">
                  <Plus size={12} className="mr-1" />
                  <span>Add Shift</span>
                </button>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};
