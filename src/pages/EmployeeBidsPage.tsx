
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, DollarSign, Users, Filter, Search, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { BidStatusBadge } from '@/components/bids/BidStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const EmployeeBidsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'available' | 'myBids'>('available');
  
  // Dummy data for available shifts
  const availableShifts = [
    {
      id: 1,
      role: 'Event Coordinator',
      department: 'Convention',
      subDepartment: 'Main Hall',
      date: 'June 15, 2023',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      location: 'Hall A',
      payRate: '$22/hr',
      bidDeadline: 'June 10, 2023',
      totalBids: 5,
      status: 'open',
      isEligible: true
    },
    {
      id: 2,
      role: 'Tour Guide',
      department: 'Exhibition',
      subDepartment: 'East Wing',
      date: 'June 16, 2023',
      startTime: '10:00 AM',
      endTime: '06:00 PM',
      location: 'Gallery 3',
      payRate: '$20/hr',
      bidDeadline: 'June 11, 2023',
      totalBids: 3,
      status: 'open',
      isEligible: true
    },
    {
      id: 3,
      role: 'Security Officer',
      department: 'Convention',
      subDepartment: 'Entrance',
      date: 'June 17, 2023',
      startTime: '08:00 AM',
      endTime: '04:00 PM',
      location: 'Main Entrance',
      payRate: '$25/hr',
      bidDeadline: 'June 12, 2023',
      totalBids: 8,
      status: 'open',
      isEligible: false,
      ineligibilityReason: 'Role requirements not met'
    },
  ];
  
  // Dummy data for my bids
  const myBids = [
    {
      id: 101,
      shiftId: 5,
      role: 'Information Desk',
      department: 'Exhibition',
      date: 'June 20, 2023',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      location: 'Main Lobby',
      payRate: '$21/hr',
      bidStatus: 'pending',
      bidDate: 'June 5, 2023',
      notes: 'Waiting for manager approval'
    },
    {
      id: 102,
      shiftId: 8,
      role: 'Sound Engineer',
      department: 'Theatre',
      date: 'June 22, 2023',
      startTime: '02:00 PM',
      endTime: '10:00 PM',
      location: 'Main Stage',
      payRate: '$28/hr',
      bidStatus: 'approved',
      bidDate: 'June 4, 2023',
      notes: 'Approved by Sarah Johnson'
    },
    {
      id: 103,
      shiftId: 12,
      role: 'Event Coordinator',
      department: 'Convention',
      date: 'June 25, 2023',
      startTime: '08:00 AM',
      endTime: '04:00 PM',
      location: 'Hall B',
      payRate: '$22/hr',
      bidStatus: 'rejected',
      bidDate: 'June 3, 2023',
      notes: 'Another candidate was selected'
    },
  ];

  // Handle bid submission
  const handleBidSubmit = (shiftId: number) => {
    // In a real app, this would make an API call to submit the bid
    toast({
      title: "Bid Submitted",
      description: "Your bid has been submitted successfully. You can track its status in 'My Bids'.",
    });
    setActiveTab('myBids');
  };

  // Function to get color classes based on department
  const getDepartmentColor = (department: string) => {
    switch (department.toLowerCase()) {
      case 'convention':
        return 'bg-blue-900/20 border-blue-500/20';
      case 'exhibition':
        return 'bg-green-900/20 border-green-500/20';
      case 'theatre':
        return 'bg-red-900/20 border-red-500/20';
      default:
        return 'bg-gray-900/20 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="glass-panel p-6 mb-6" style={{ animation: 'none' }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Open Shifts</h1>
            <p className="text-white/60">
              View available shifts and submit bids for shifts you're interested in working.
            </p>
          </div>
          
          {/* Tabs for switching between available shifts and my bids */}
          <div className="flex space-x-2 mb-6">
            <Button 
              variant={activeTab === 'available' ? "outline" : "ghost"} 
              size="sm" 
              className={activeTab === 'available' ? "bg-white/5 border-white/10" : ""}
              onClick={() => setActiveTab('available')}
            >
              Available Shifts
            </Button>
            <Button 
              variant={activeTab === 'myBids' ? "outline" : "ghost"} 
              size="sm"
              className={activeTab === 'myBids' ? "bg-white/5 border-white/10" : ""}
              onClick={() => setActiveTab('myBids')}
            >
              My Bids
            </Button>
          </div>
          
          {/* Filter & Search Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="bg-white/5">
                <Filter className="mr-1 h-4 w-4" />
                Filter
              </Button>
              <Button variant="ghost" size="sm" className="bg-white/5">
                All Departments
              </Button>
              <Button variant="ghost" size="sm" className="bg-white/5">
                Next 7 Days
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search shifts..."
                className="bg-white/5 border border-white/10 rounded-md pl-8 pr-4 py-1 text-sm w-full"
              />
            </div>
          </div>
          
          {/* Available Shifts Tab Content */}
          {activeTab === 'available' && (
            <div className="space-y-4">
              {availableShifts.length > 0 ? (
                availableShifts.map((shift) => (
                  <Card 
                    key={shift.id} 
                    className={`${getDepartmentColor(shift.department)} border ${!shift.isEligible ? 'opacity-75' : ''}`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-lg font-medium">{shift.role}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-white/70">{shift.department}</span>
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-sm text-white/70">{shift.subDepartment}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-white/10">
                        {shift.status === 'open' ? 'Open for Bids' : shift.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mt-2">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-white/60" />
                          <span className="text-sm">{shift.date}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-white/60" />
                          <span className="text-sm">{shift.startTime} - {shift.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-white/60" />
                          <span className="text-sm">{shift.location}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-4 w-4 text-white/60" />
                          <span className="text-sm">{shift.payRate}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/10 mt-4 pt-4">
                        <div className="flex items-center mb-3 sm:mb-0">
                          <div className="bg-white/10 px-3 py-1.5 rounded-md flex items-center mr-3">
                            <Users className="h-4 w-4 mr-2 text-white/60" />
                            <span className="text-sm">{shift.totalBids} Bids</span>
                          </div>
                          <div className="text-sm text-white/60">
                            Deadline: {shift.bidDeadline}
                          </div>
                        </div>
                        
                        {shift.isEligible ? (
                          <Button 
                            onClick={() => handleBidSubmit(shift.id)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                          >
                            Express Interest
                          </Button>
                        ) : (
                          <div className="flex items-center text-yellow-500">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">{shift.ineligibilityReason}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-white/60">
                  No available shifts found. Check back later!
                </div>
              )}
            </div>
          )}
          
          {/* My Bids Tab Content */}
          {activeTab === 'myBids' && (
            <div className="space-y-4">
              {myBids.length > 0 ? (
                myBids.map((bid) => (
                  <Card 
                    key={bid.id} 
                    className={`${getDepartmentColor(bid.department)} border`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-lg font-medium">{bid.role}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-white/70">{bid.department}</span>
                        </div>
                      </div>
                      <BidStatusBadge status={bid.bidStatus} />
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mt-2">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-white/60" />
                          <span className="text-sm">{bid.date}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-white/60" />
                          <span className="text-sm">{bid.startTime} - {bid.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-white/60" />
                          <span className="text-sm">{bid.location}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-4 w-4 text-white/60" />
                          <span className="text-sm">{bid.payRate}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex flex-col sm:flex-row justify-between mb-2">
                          <div className="text-sm">
                            <span className="text-white/60">Bid submitted on: </span>
                            <span>{bid.bidDate}</span>
                          </div>
                          
                          {bid.bidStatus === 'approved' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-white/5 border-white/10 mt-2 sm:mt-0"
                              onClick={() => navigate('/rostering/rosters')}
                            >
                              View in Roster
                            </Button>
                          )}
                        </div>
                        
                        {bid.notes && (
                          <div className="bg-black/20 rounded-md p-3 mt-2 text-sm">
                            <span className="text-white/80">{bid.notes}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-white/60">
                  You haven't submitted any bids yet.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeBidsPage;
