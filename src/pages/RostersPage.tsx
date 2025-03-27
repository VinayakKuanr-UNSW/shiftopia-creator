
import React, { useState } from 'react';
import { Calendar, Clock, Filter, Search, User, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { RosterSidebar } from '@/components/roster/RosterSidebar';
import { RosterCalendar } from '@/components/roster/RosterCalendar';
import { RosterHeader } from '@/components/roster/RosterHeader';

const RostersPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Main content */}
        <div className="flex-1 p-4 md:p-8">
          <div className="animate-float glass-panel p-6 mb-6">
            <RosterHeader 
              sidebarOpen={sidebarOpen} 
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            
            <div className="mt-6">
              <RosterCalendar selectedDate={selectedDate} />
            </div>
          </div>
        </div>
        
        {/* Employee sidebar */}
        {sidebarOpen && (
          <RosterSidebar />
        )}
      </div>
    </div>
  );
};

export default RostersPage;
