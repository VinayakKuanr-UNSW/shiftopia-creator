
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { CalendarDays, Clock, MapPin, User } from 'lucide-react';
import { Shift } from '@/api/models/types';
import { formatTime } from '@/lib/utils';

interface ShiftDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shift?: {
    shift: Shift;
    groupName: string;
    groupColor: string;
    subGroupName: string;
  };
}

const ShiftDetailsDialog: React.FC<ShiftDetailsDialogProps> = ({
  isOpen,
  onClose,
  shift
}) => {
  if (!shift) return null;
  
  const getBgColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-purple-500';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md bg-gray-900 border border-gray-800">
        <DialogHeader>
          <div className={`${getBgColorClass(shift.groupColor)} text-white py-1 px-3 rounded-full text-xs mb-2 inline-block`}>
            {shift.groupName}
          </div>
          <DialogTitle className="text-xl font-bold">{shift.shift.role}</DialogTitle>
          <DialogDescription className="text-gray-400">{shift.subGroupName}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <Clock className="text-gray-400" size={18} />
            <div>
              <div className="font-medium">{shift.shift.startTime} - {shift.shift.endTime}</div>
              <div className="text-sm text-gray-400">Break: {shift.shift.breakDuration}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CalendarDays className="text-gray-400" size={18} />
            <div className="font-medium">
              {shift.shift.status || 'Scheduled'}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <User className="text-gray-400" size={18} />
            <div className="font-medium">
              Level {shift.shift.remunerationLevel}
            </div>
          </div>
          
          {shift.shift.notes && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-sm font-medium mb-2">Notes</h4>
              <p className="text-sm text-gray-400">{shift.shift.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftDetailsDialog;
