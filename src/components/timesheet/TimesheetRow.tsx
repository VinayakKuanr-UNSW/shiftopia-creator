
import React, { useState } from 'react';
import { Check, Clock, Eye, MoreHorizontal, Pencil, Trash, X } from 'lucide-react';
import { ShiftStatusBadge } from './ShiftStatusBadge';
import { ShiftHistoryDrawer } from './ShiftHistoryDrawer';

interface TimesheetEntry {
  id: number;
  date: Date;
  employee: string;
  role: string;
  department: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  totalHours: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface TimesheetRowProps {
  entry: TimesheetEntry;
  readOnly?: boolean;
}

export const TimesheetRow: React.FC<TimesheetRowProps> = ({ entry, readOnly }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  
  return (
    <tr className="border-b border-white/10 hover:bg-white/5">
      <td className="p-3 text-sm">{entry.employee}</td>
      <td className="p-3 text-sm">{entry.department}</td>
      <td className="p-3 text-sm">{entry.role}</td>
      
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
          </td>
          <td className="p-3 text-sm">
            <div className="flex space-x-1">
              <button 
                onClick={() => setHistoryOpen(true)}
                className="p-1 rounded-full hover:bg-blue-500/20 text-blue-400"
              >
                <Clock size={16} />
              </button>
              
              {!readOnly && entry.status !== 'approved' && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded-full hover:bg-purple-500/20 text-purple-400"
                >
                  <Pencil size={16} />
                </button>
              )}
              
              {!readOnly && entry.status === 'pending' && (
                <>
                  <button className="p-1 rounded-full hover:bg-green-500/20 text-green-400">
                    <Check size={16} />
                  </button>
                  <button className="p-1 rounded-full hover:bg-red-500/20 text-red-400">
                    <X size={16} />
                  </button>
                </>
              )}
            </div>
          </td>
        </>
      )}
      
      {/* Shift History Drawer */}
      <ShiftHistoryDrawer 
        isOpen={historyOpen} 
        onClose={() => setHistoryOpen(false)} 
        shiftId={entry.id} 
      />
    </tr>
  );
};
