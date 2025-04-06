
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { BidWithEmployee } from './types/bid-types';
import { Badge } from '@/components/ui/badge';
import { getStatusColor } from './utils/bidUtils';

interface BidCalendarViewProps {
  bids: BidWithEmployee[];
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

const BidCalendarView: React.FC<BidCalendarViewProps> = ({ bids, onDateSelect, selectedDate }) => {
  // Group bids by date for highlighting in calendar
  const bidsByDate: Record<string, BidWithEmployee[]> = bids.reduce((acc, bid) => {
    const dateStr = bid.shiftDetails?.date || '';
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(bid);
    return acc;
  }, {} as Record<string, BidWithEmployee[]>);

  // For rendering date cell content and highlights
  const renderDay = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    const dayBids = bidsByDate[dateStr] || [];
    
    // Count bids by status
    const statusCounts: Record<string, number> = {};
    dayBids.forEach(bid => {
      const status = bid.shiftDetails?.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return (
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between">
          <div className="pt-1 text-center">{day.getDate()}</div>
          {dayBids.length > 0 && (
            <div className="pb-1 flex flex-wrap gap-1 justify-center">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Badge 
                  key={status}
                  variant="secondary"
                  className={`${getStatusColor(status)} text-[0.6rem] h-3 px-1 flex items-center`}
                >
                  {count}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Find min and max dates across bids to set calendar range
  let minDate: Date | undefined;
  let maxDate: Date | undefined;
  
  bids.forEach(bid => {
    const dateStr = bid.shiftDetails?.date;
    if (dateStr) {
      const date = new Date(dateStr);
      if (!minDate || date < minDate) minDate = date;
      if (!maxDate || date > maxDate) maxDate = date;
    }
  });
  
  // Set defaults if no dates found
  if (!minDate) {
    minDate = new Date();
    minDate.setMonth(minDate.getMonth() - 1);
  }
  
  if (!maxDate) {
    maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
  }
  
  // Bids for selected date
  const selectedDateStr = selectedDate?.toISOString().split('T')[0];
  const selectedBids = selectedDateStr ? (bidsByDate[selectedDateStr] || []) : [];

  return (
    <div className="flex flex-col">
      <div className="p-4 bg-gray-800 rounded-lg mb-4">
        <Calendar 
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="w-full rounded-md bg-gray-800"
          day={{render: renderDay}}
          fromDate={new Date(minDate.setDate(minDate.getDate() - 14))} // 2 weeks before earliest bid
          toDate={new Date(maxDate.setDate(maxDate.getDate() + 14))}   // 2 weeks after latest bid
        />
      </div>
      
      {selectedDate && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            Shifts for {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          
          {selectedBids.length === 0 ? (
            <p className="text-white/70 italic">No shifts on this date.</p>
          ) : (
            <div className="space-y-2">
              {selectedBids.map(bid => (
                <div key={bid.id} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{bid.shiftDetails?.role} - {bid.shiftDetails?.department}</h4>
                      <div className="text-sm text-white/70">
                        {bid.shiftDetails?.startTime}-{bid.shiftDetails?.endTime} • {bid.shiftDetails?.netLength}h
                      </div>
                    </div>
                    <Badge className={getStatusColor(bid.shiftDetails?.status || 'Unknown')}>
                      {bid.shiftDetails?.status || 'Unknown'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            className="mt-3"
            onClick={() => onDateSelect(undefined)}
          >
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default BidCalendarView;
