
import React, { useState } from 'react';
import { Check, Clock, Eye, MoreHorizontal, Pencil, Trash, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { ShiftStatusBadge } from './ShiftStatusBadge';
import { ShiftHistoryDrawer } from './ShiftHistoryDrawer';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface TimesheetEntry {
  id: number;
  date: Date;
  employee: string;
  role: string;
  department: string;
  subGroup: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  totalHours: string;
  status: 'Completed' | 'Cancelled' | 'Active' | 'No-Show' | 'Swapped';
  bidId?: number;
  assignedTime?: string;
  originalEmployee?: string | null;
  replacementEmployee?: string | null;
  cancellationReason?: string | null;
  remunerationLevel?: string;
}

interface TimesheetRowProps {
  entry: TimesheetEntry;
  readOnly?: boolean;
}

export const TimesheetRow: React.FC<TimesheetRowProps> = ({ entry, readOnly }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { toast } = useToast();
  
  const handleStatusUpdate = (newStatus: 'Completed' | 'Cancelled' | 'No-Show') => {
    // In a real app, this would make an API call to update the status
    toast({
      title: "Status Updated",
      description: `Shift status has been updated to ${newStatus}.`,
    });
  };
  
  const handleCancelShift = () => {
    // In a real app, this would open a modal to confirm cancellation and record reason
    toast({
      title: "Shift Cancelled",
      description: "This shift has been cancelled and will be available for re-assignment.",
    });
  };
  
  const handleCompleteShift = () => {
    // In a real app, this would update the shift status to completed
    toast({
      title: "Shift Completed",
      description: "This shift has been marked as completed.",
    });
  };
  
  const handleSwapRequest = () => {
    // In a real app, this would open a modal to select swap options
    toast({
      title: "Swap Request",
      description: "Your swap request has been submitted for approval.",
    });
  };
  
  const getRemunerationBadge = () => {
    if (!entry.remunerationLevel) return null;
    
    switch(entry.remunerationLevel) {
      case 'GOLD':
        return <Badge className="bg-yellow-500/30 text-yellow-300 border border-yellow-500/30">GOLD</Badge>;
      case 'SILVER':
        return <Badge className="bg-slate-400/30 text-slate-300 border border-slate-400/30">SILVER</Badge>;
      case 'BRONZE':
        return <Badge className="bg-orange-600/30 text-orange-300 border border-orange-600/30">BRONZE</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-white/80 border border-blue-500/20">Level {entry.remunerationLevel}</Badge>;
    }
  };
  
  return (
    <tr className="border-b border-white/10 hover:bg-white/5">
      <td className="p-3 text-sm">{entry.employee}</td>
      <td className="p-3 text-sm">{entry.department}</td>
      <td className="p-3 text-sm">{entry.subGroup}</td>
      <td className="p-3 text-sm flex items-center gap-2">
        {entry.role}
        {getRemunerationBadge()}
      </td>
      
      {isEditing ? (
        <>
          <td className="p-3 text-sm">
            <input 
              type="time" 
              defaultValue={entry.startTime} 
              className="bg-white/10 border border-white/20 rounded p-1 w-20"
            />
          </td>
          <td className="p-3 text-sm">
            <input 
              type="time" 
              defaultValue={entry.endTime} 
              className="bg-white/10 border border-white/20 rounded p-1 w-20"
            />
          </td>
          <td className="p-3 text-sm">
            <select className="bg-white/10 border border-white/20 rounded p-1 w-20">
              <option value="15 min">15 min</option>
              <option value="30 min" selected={entry.breakDuration === '30 min'}>30 min</option>
              <option value="45 min" selected={entry.breakDuration === '45 min'}>45 min</option>
              <option value="60 min" selected={entry.breakDuration === '60 min'}>60 min</option>
            </select>
          </td>
          <td className="p-3 text-sm">{entry.totalHours}</td>
          <td className="p-3 text-sm">
            <ShiftStatusBadge status={entry.status} />
          </td>
          <td className="p-3 text-sm">
            <div className="flex space-x-1">
              <button 
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full hover:bg-green-500/20 text-green-400"
              >
                <Check size={16} />
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full hover:bg-red-500/20 text-red-400"
              >
                <X size={16} />
              </button>
            </div>
          </td>
        </>
      ) : (
        <>
          <td className="p-3 text-sm">{entry.startTime}</td>
          <td className="p-3 text-sm">{entry.endTime}</td>
          <td className="p-3 text-sm">{entry.breakDuration}</td>
          <td className="p-3 text-sm">{entry.totalHours}</td>
          <td className="p-3 text-sm">
            <ShiftStatusBadge status={entry.status} />
            
            {/* Show additional info for special statuses */}
            {entry.status === 'Swapped' && entry.originalEmployee && (
              <div className="text-xs text-white/60 mt-1">
                Swapped from: {entry.originalEmployee}
              </div>
            )}
            
            {entry.status === 'Cancelled' && entry.cancellationReason && (
              <div className="text-xs text-white/60 mt-1">
                Reason: {entry.cancellationReason}
              </div>
            )}
          </td>
          <td className="p-3 text-sm">
            <div className="flex space-x-1">
              <button 
                onClick={() => setHistoryOpen(true)}
                className="p-1 rounded-full hover:bg-blue-500/20 text-blue-400"
                title="View Shift History"
              >
                <Clock size={16} />
              </button>
              
              {!readOnly && entry.status !== 'Completed' && entry.status !== 'Cancelled' && entry.status !== 'No-Show' && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded-full hover:bg-purple-500/20 text-purple-400"
                  title="Edit Shift"
                >
                  <Pencil size={16} />
                </button>
              )}
              
              {!readOnly && entry.status === 'Active' && (
                <>
                  <button 
                    onClick={() => handleCompleteShift()}
                    className="p-1 rounded-full hover:bg-green-500/20 text-green-400"
                    title="Mark as Completed"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => handleCancelShift()}
                    className="p-1 rounded-full hover:bg-red-500/20 text-red-400"
                    title="Cancel Shift"
                  >
                    <X size={16} />
                  </button>
                  <button 
                    onClick={() => handleSwapRequest()}
                    className="p-1 rounded-full hover:bg-yellow-500/20 text-yellow-400"
                    title="Request Swap"
                  >
                    <RefreshCw size={16} />
                  </button>
                </>
              )}
              
              {!readOnly && entry.status === 'No-Show' && (
                <button 
                  className="p-1 rounded-full hover:bg-yellow-500/20 text-yellow-400"
                  title="Report Details"
                >
                  <AlertTriangle size={16} />
                </button>
              )}
            </div>
          </td>
        </>
      )}
      
      {/* Shift History Drawer */}
      <ShiftHistoryDrawer 
        isOpen={historyOpen} 
        onClose={() => setHistoryOpen(false)} 
        shiftId={entry.id.toString()} 
        data={{
          position: entry.role,
          location: entry.department,
          subGroup: entry.subGroup,
          originalEmployee: {
            name: entry.employee,
            status: entry.status
          },
          replacementEmployees: entry.originalEmployee ? [
            {
              id: 1,
              name: entry.originalEmployee,
              status: 'Cancelled',
              reason: 'Requested swap',
              clockIn: null,
              clockOut: null
            },
            {
              id: 2,
              name: entry.employee,
              status: entry.status,
              reason: 'Accepted swap request',
              clockIn: entry.status === 'Completed' ? '08:00 AM' : null,
              clockOut: entry.status === 'Completed' ? '04:00 PM' : null
            }
          ] : []
        }}
      />
    </tr>
  );
};
