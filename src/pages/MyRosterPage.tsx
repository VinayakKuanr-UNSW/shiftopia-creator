
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import MyRosterCalendar from '@/components/myroster/MyRosterCalendar';
import { useRosterView, CalendarView } from '@/hooks/useRosterView';

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
          <h1 className="text-2xl font-bold text-white mb-4">My Roster</h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-white/80">
              <p>Welcome back, {user.name}</p>
              <p className="text-sm text-white/60">Department: {user.department.charAt(0).toUpperCase() + user.department.slice(1)}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {viewOptions.map(option => (
                <Button
                  key={option.value}
                  onClick={() => setView(option.value as CalendarView)} {/* Cast the string value to CalendarView type */}
                  variant="outline"
                  size="sm"
                  className={`${
                    view === option.value 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/10 shadow-xl p-4">
          <MyRosterCalendar 
            view={view} 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
        </div>
      </div>
    </div>
  );
};

export default MyRosterPage;
