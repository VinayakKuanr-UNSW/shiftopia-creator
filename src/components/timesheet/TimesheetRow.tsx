
import React from 'react';
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ShiftStatusBadge } from '@/components/timesheet/ShiftStatusBadge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, Info } from 'lucide-react';

interface TimesheetRowProps {
  timesheet: any;
  onApprove: () => void;
  onReject: () => void;
  onViewHistory: () => void;
}

export const TimesheetRow: React.FC<TimesheetRowProps> = ({
  timesheet,
  onApprove,
  onReject,
  onViewHistory
}) => {
  const hasReplacements = timesheet.replacementEmployees && timesheet.replacementEmployees.length > 0;
  const finalEmployee = hasReplacements 
    ? timesheet.replacementEmployees[timesheet.replacementEmployees.length - 1]
    : timesheet.originalEmployee;
  
  const isCompleted = finalEmployee.status === 'Completed';
  const isActive = finalEmployee.status === 'Active';
  
  // Calculate hours worked
  const calculateHours = (clockIn: string, clockOut: string) => {
    if (!clockIn || !clockOut) return '-';
    
    // This is a simplified calculation for the demo
    // In a real app, you would convert these times properly and calculate the difference
    return '8 hrs';
  };
  
  const renderEmployeeRows = () => {
    return (
      <>
        {/* Original employee */}
        <TableRow className="border-b border-white/10 hover:bg-black/30">
          <TableCell className="font-medium">
            <div className="flex flex-col">
              <span>{timesheet.originalEmployee.name}</span>
              <ShiftStatusBadge status={timesheet.originalEmployee.status} />
            </div>
          </TableCell>
          <TableCell>{timesheet.position}</TableCell>
          <TableCell>
            <div className="flex flex-col">
              <span>{timesheet.location}</span>
              <span className="text-xs text-white/60">{timesheet.subGroup}</span>
            </div>
          </TableCell>
          <TableCell>{timesheet.originalEmployee.clockIn || '-'}</TableCell>
          <TableCell>{timesheet.originalEmployee.clockOut || '-'}</TableCell>
          <TableCell>{timesheet.originalEmployee.breakTime || '-'}</TableCell>
          <TableCell>
            {calculateHours(
              timesheet.originalEmployee.clockIn, 
              timesheet.originalEmployee.clockOut
            )}
          </TableCell>
          <TableCell className="text-right">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onViewHistory}
              className="text-white/60 hover:text-white"
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">View History</span>
            </Button>
          </TableCell>
        </TableRow>
        
        {/* Replacement employees */}
        {timesheet.replacementEmployees.map((replacement: any, index: number) => (
          <TableRow 
            key={replacement.id}
            className={`border-b border-white/10 hover:bg-black/30 ${
              index === timesheet.replacementEmployees.length - 1 ? 'bg-black/20' : ''
            }`}
          >
            <TableCell className="font-medium">
              <div className="flex flex-col pl-6 border-l-2 border-white/20">
                <span>{replacement.name}</span>
                <ShiftStatusBadge status={replacement.status} />
                {replacement.reason && (
                  <span className="text-xs text-white/60 mt-1">
                    Reason: {replacement.reason}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>{timesheet.position}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>{timesheet.location}</span>
                <span className="text-xs text-white/60">{timesheet.subGroup}</span>
              </div>
            </TableCell>
            <TableCell>{replacement.clockIn || '-'}</TableCell>
            <TableCell>{replacement.clockOut || '-'}</TableCell>
            <TableCell>{replacement.breakTime || '-'}</TableCell>
            <TableCell>
              {calculateHours(replacement.clockIn, replacement.clockOut)}
            </TableCell>
            <TableCell className="text-right">
              {index === timesheet.replacementEmployees.length - 1 && (isCompleted || isActive) && (
                <div className="flex justify-end gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onApprove}
                    className="bg-green-500/20 hover:bg-green-500/40 border-green-500/50"
                    disabled={isActive}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Approve</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onReject}
                    className="bg-red-500/20 hover:bg-red-500/40 border-red-500/50"
                    disabled={isActive}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Reject</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onViewHistory}
                    className="text-white/60 hover:text-white"
                  >
                    <Info className="h-4 w-4" />
                    <span className="sr-only">View History</span>
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };
  
  // If there are no replacements, just render the original employee with approval options
  const renderSingleEmployeeRow = () => (
    <TableRow className="border-b border-white/10 hover:bg-black/30 bg-black/20">
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{timesheet.originalEmployee.name}</span>
          <ShiftStatusBadge status={timesheet.originalEmployee.status} />
        </div>
      </TableCell>
      <TableCell>{timesheet.position}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{timesheet.location}</span>
          <span className="text-xs text-white/60">{timesheet.subGroup}</span>
        </div>
      </TableCell>
      <TableCell>{timesheet.originalEmployee.clockIn || '-'}</TableCell>
      <TableCell>{timesheet.originalEmployee.clockOut || '-'}</TableCell>
      <TableCell>{timesheet.originalEmployee.breakTime || '-'}</TableCell>
      <TableCell>
        {calculateHours(
          timesheet.originalEmployee.clockIn, 
          timesheet.originalEmployee.clockOut
        )}
      </TableCell>
      <TableCell className="text-right">
        {(isCompleted || isActive) && (
          <div className="flex justify-end gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onApprove}
              className="bg-green-500/20 hover:bg-green-500/40 border-green-500/50"
              disabled={isActive}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Approve</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReject}
              className="bg-red-500/20 hover:bg-red-500/40 border-red-500/50"
              disabled={isActive}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Reject</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onViewHistory}
              className="text-white/60 hover:text-white"
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">View History</span>
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
  
  return hasReplacements ? renderEmployeeRows() : renderSingleEmployeeRow();
};
