
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BirdsViewHeader } from '@/components/roster/birds-view/BirdsViewHeader';
import { BirdsViewGrid } from '@/components/roster/birds-view/BirdsViewGrid';
import { addDays, format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { useRosters } from '@/api/hooks';
import { useToast } from '@/hooks/use-toast';

const BirdsViewPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(() => {
    const today = new Date();
    return startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const today = new Date();
    return endOfWeek(today, { weekStartsOn: 1 }); // End on Sunday
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  const { useRostersByDateRange } = useRosters();
  const { toast } = useToast();
  
  // Format dates for API call
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  
  // Fetch rosters for the selected date range
  const { data: rosters, isLoading } = useRostersByDateRange(formattedStartDate, formattedEndDate);
  
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
          <div className="glass-panel p-4 md:p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 flex-grow overflow-auto" style={{ animation: 'none' }}>
            <BirdsViewHeader 
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={handleDateRangeChange}
              onSearch={handleSearch}
            />
            
            <div className="mt-6 overflow-auto">
              <BirdsViewGrid 
                startDate={startDate}
                endDate={endDate}
                rosters={rosters || []}
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default BirdsViewPage;
