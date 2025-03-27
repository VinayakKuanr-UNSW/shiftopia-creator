
import React, { useState } from 'react';
import { Calendar, Clock, Filter, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { TimesheetHeader } from '@/components/timesheet/TimesheetHeader';
import { TimesheetTable } from '@/components/timesheet/TimesheetTable';
import { useToast } from '@/hooks/use-toast';

const TimesheetPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="animate-float glass-panel p-6 mb-6">
          <TimesheetHeader 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          
          <div className="mt-6">
            <TimesheetTable selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetPage;
