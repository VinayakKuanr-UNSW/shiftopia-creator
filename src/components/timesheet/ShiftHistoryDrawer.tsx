
import React from 'react';
import { X, User, Calendar, Clock, Info } from 'lucide-react';
import { ShiftStatusBadge } from './ShiftStatusBadge';

interface ShiftHistoryDrawerProps {
  shiftId: string;
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const ShiftHistoryDrawer: React.FC<ShiftHistoryDrawerProps> = ({
  shiftId,
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen || !data) return null;
  
  const hasReplacements = data.replacementEmployees && data.replacementEmployees.length > 0;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}>
        <span className="sr-only">Close</span>
      </div>
      
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] flex flex-col bg-black/80 backdrop-blur-lg border-l border-white/10 overflow-auto animate-slide-in-right">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-medium">Shift History</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        
        <div className="flex-1 p-4 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/70">Shift Details</h3>
            <div className="bg-black/20 rounded-md p-4 border border-white/10 space-y-3">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-white/60 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">ID: {shiftId}</div>
                  <div className="text-xs text-white/60">2023-03-15</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-white/60 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">{data.position}</div>
                  <div className="text-xs text-white/60">
                    {data.location} &bull; {data.subGroup}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-white/60 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">09:00 AM - 05:00 PM</div>
                  <div className="text-xs text-white/60">8 hours shift</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/70">Employee History</h3>
            
            <div className="relative pl-6 border-l-2 border-white/20 space-y-6 py-2">
              {/* Original employee */}
              <div className="relative">
                <div className="absolute -left-[29px] rounded-full w-5 h-5 bg-black border-2 border-white/20 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                </div>
                
                <div className="bg-black/20 rounded-md p-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-8 w-8 text-white/60 bg-black/40 p-1.5 rounded-full" />
                      <div>
                        <div className="text-sm font-medium">{data.originalEmployee.name}</div>
                        <div className="mt-1">
                          <ShiftStatusBadge status={data.originalEmployee.status} />
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-white/60">Originally Assigned</div>
                  </div>
                  
                  {data.originalEmployee.reason && (
                    <div className="mt-3 text-sm text-white/80 bg-black/30 p-2 rounded border border-white/10">
                      <strong>Reason:</strong> {data.originalEmployee.reason}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Replacement employees */}
              {hasReplacements && data.replacementEmployees.map((replacement: any, index: number) => (
                <div className="relative" key={replacement.id}>
                  <div className="absolute -left-[29px] rounded-full w-5 h-5 bg-black border-2 border-white/20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                  </div>
                  
                  <div className={`bg-black/20 rounded-md p-4 border border-white/10 ${
                    index === data.replacementEmployees.length - 1 ? 'border-green-500/30' : ''
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="h-8 w-8 text-white/60 bg-black/40 p-1.5 rounded-full" />
                        <div>
                          <div className="text-sm font-medium">{replacement.name}</div>
                          <div className="mt-1">
                            <ShiftStatusBadge status={replacement.status} />
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-white/60">
                        {index === 0 ? 'First Replacement' : 
                         index === data.replacementEmployees.length - 1 ? 'Final Employee' : 
                         `Replacement #${index + 1}`}
                      </div>
                    </div>
                    
                    {replacement.reason && (
                      <div className="mt-3 text-sm text-white/80 bg-black/30 p-2 rounded border border-white/10">
                        <strong>Reason:</strong> {replacement.reason}
                      </div>
                    )}
                    
                    {replacement.notes && (
                      <div className="mt-2 text-sm text-white/80 bg-black/30 p-2 rounded border border-white/10">
                        <strong>Notes:</strong> {replacement.notes}
                      </div>
                    )}
                    
                    {(replacement.clockIn || replacement.clockOut) && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="bg-black/30 p-2 rounded border border-white/10">
                          <div className="text-xs text-white/60">Clock In</div>
                          <div className="text-sm">{replacement.clockIn || 'N/A'}</div>
                        </div>
                        <div className="bg-black/30 p-2 rounded border border-white/10">
                          <div className="text-xs text-white/60">Clock Out</div>
                          <div className="text-sm">{replacement.clockOut || 'N/A'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
