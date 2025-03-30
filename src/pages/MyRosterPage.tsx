
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import MyRosterCalendar from '@/components/myroster/MyRosterCalendar';
import { useRosterView, CalendarView } from '@/hooks/useRosterView';
import { CalendarDays, Info } from 'lucide-react';

const MyRosterPage: React.FC = () => {
  const { user } = useAuth();
  const { view, setView, selectedDate, setSelectedDate, viewOptions } = useRosterView();
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">Please log in to view your roster</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
            <CalendarDays className="mr-2 text-blue-400" size={28} />
            My Roster
          </h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-white/80">
              <p className="text-lg">Welcome back, {user.name}</p>
              <p className="text-sm text-white/60">Department: {user.department.charAt(0).toUpperCase() + user.department.slice(1)}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {viewOptions.map(option => (
                <Button
                  key={option.value}
                  onClick={() => setView(option.value as CalendarView)} 
                  variant="outline"
                  size="sm"
                  className={`${
                    view === option.value 
                      ? 'bg-blue-600 text-white border-blue-500' 
                      : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                  } transition-all duration-200`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/10 shadow-xl p-4 mb-4">
          <MyRosterCalendar 
            view={view} 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
        </div>
        
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-white/80 flex items-start">
          <Info className="text-blue-400 mr-3 mt-0.5 flex-shrink-0" size={18} />
          <div>
            <h3 className="text-blue-300 font-medium mb-1">Viewing Your Roster</h3>
            <p>
              Use the view options above to switch between Day, 3-Day, Week, and Month views. Click on a date to see your shifts for that specific day.
              Shifts are color-coded based on department: blue for Convention, green for Exhibition, and red for Theatre.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRosterPage;
