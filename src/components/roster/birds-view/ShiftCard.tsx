
import React, { useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import { Group, SubGroup } from '@/api/models/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRosters } from '@/api/hooks';
import { format } from 'date-fns';

interface ShiftCardProps {
  shift: any; // Using any here as it's a mix of types plus additional fields
  group: Group;
  subGroup: SubGroup;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({ shift, group, subGroup }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Setup form state for editing
  const [formData, setFormData] = useState({
    startTime: shift.startTime,
    endTime: shift.endTime,
    breakDuration: shift.breakDuration || '00:30',
    role: shift.role,
    remunerationLevel: shift.remunerationLevel
  });
  
  // Calculate shift duration and net duration
  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    let hours = endHour - startHour;
    let minutes = endMinute - startMinute;
    
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }
    
    return `${hours}h ${minutes}m`;
  };
  
  const calculateNetDuration = (start: string, end: string, breakDuration: string) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const [breakHour, breakMinute] = (breakDuration || '00:00').split(':').map(Number);
    
    let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute) - (breakHour * 60 + breakMinute);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };
  
  const shiftDuration = calculateDuration(shift.startTime, shift.endTime);
  const netDuration = calculateNetDuration(shift.startTime, shift.endTime, shift.breakDuration);
  
  // Get update shift mutation
  const { useUpdateShift, useRemoveShift } = useRosters();
  const updateShiftMutation = useUpdateShift();
  const removeShiftMutation = useRemoveShift();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleUpdateShift = () => {
    const dateStr = format(shift.date, 'yyyy-MM-dd');
    
    updateShiftMutation.mutate({
      date: dateStr,
      groupId: group.id,
      subGroupId: subGroup.id,
      shiftId: shift.id,
      updates: formData
    }, {
      onSuccess: () => {
        toast({
          title: "Shift Updated",
          description: "The shift has been updated successfully."
        });
        setIsEditDialogOpen(false);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update shift. Please try again.",
          variant: "destructive"
        });
      }
    });
  };
  
  const handleDeleteShift = () => {
    const dateStr = format(shift.date, 'yyyy-MM-dd');
    
    removeShiftMutation.mutate({
      date: dateStr,
      groupId: group.id,
      subGroupId: subGroup.id,
      shiftId: shift.id
    }, {
      onSuccess: () => {
        toast({
          title: "Shift Deleted",
          description: "The shift has been deleted successfully."
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete shift. Please try again.",
          variant: "destructive"
        });
      }
    });
  };
  
  // Determine background color based on group color
  const getCardBgClass = () => {
    switch (group.color) {
      case 'blue': return 'bg-blue-900/40 hover:bg-blue-900/60 border-blue-700/30';
      case 'green': return 'bg-green-900/40 hover:bg-green-900/60 border-green-700/30';
      case 'red': return 'bg-red-900/40 hover:bg-red-900/60 border-red-700/30';
      case 'purple': return 'bg-purple-900/40 hover:bg-purple-900/60 border-purple-700/30';
      default: return 'bg-blue-900/40 hover:bg-blue-900/60 border-blue-700/30';
    }
  };
  
  return (
    <>
      <div className={`p-2 rounded-md border ${getCardBgClass()} transition-colors duration-200 text-xs`}>
        <div className="flex justify-between items-start mb-1">
          <div className="font-semibold">{shift.role}</div>
          <div className="text-white/70">{shift.remunerationLevel}</div>
        </div>
        
        <div className="text-white/80">
          {shift.startTime} - {shift.endTime} ({shiftDuration})
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <div className="text-white/60">
            Break: {shift.breakDuration || '00:00'} | Net: {netDuration}
          </div>
          
          <div className="flex space-x-1">
            <button 
              onClick={() => setIsEditDialogOpen(true)}
              className="p-1 rounded hover:bg-white/10 text-blue-400"
            >
              <Edit size={14} />
            </button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="p-1 rounded hover:bg-white/10 text-red-400">
                  <Trash size={14} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Shift</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this shift? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteShift}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="breakDuration">Break Duration</Label>
              <Input
                id="breakDuration"
                name="breakDuration"
                type="time"
                value={formData.breakDuration}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange('role', value)}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                  <SelectItem value="Tour Guide">Tour Guide</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Information Desk">Information Desk</SelectItem>
                  <SelectItem value="Event Coordinator">Event Coordinator</SelectItem>
                  <SelectItem value="Sound Engineer">Sound Engineer</SelectItem>
                  <SelectItem value="Lighting Technician">Lighting Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="remunerationLevel">Level</Label>
              <Select
                value={formData.remunerationLevel}
                onValueChange={(value) => handleSelectChange('remunerationLevel', value)}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-white/5 border-white/10"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateShift}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
