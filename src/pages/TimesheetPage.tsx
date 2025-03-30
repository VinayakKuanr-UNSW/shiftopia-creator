
import React, { useState } from 'react';
import { Calendar, Clock, Filter, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { TimesheetHeader } from '@/components/timesheet/TimesheetHeader';
import { TimesheetTable } from '@/components/timesheet/TimesheetTable';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const TimesheetPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="glass-panel p-6 mb-6" style={{ animation: 'none' }}>
          <TimesheetHeader 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          
          <div className="mt-6">
            <TimesheetTable 
              selectedDate={selectedDate} 
              readOnly={!hasPermission('update')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetPage;
