
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { 
  CircleAlert, 
  Clock, 
  Filter, 
  Info, 
  Calendar,
  CheckCircle, 
  X, 
  ShieldAlert, 
  Award, 
  User, 
  Building,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BidStatusBadge } from '@/components/bids/BidStatusBadge';
import { useToast } from '@/hooks/use-toast';

const EmployeeBidsPage: React.FC = () => {
  const { user, isEligibleForShift, checkWorkHourCompliance } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('available');
  
  // Sample data for available shifts
  const availableShifts = [
    {
      id: 1,
      role: 'Team Leader',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      date: '2023-04-10',
      startTime: '05:45',
      endTime: '14:00',
      breakDuration: '30 min',
      remunerationLevel: 'GOLD',
      assignedTo: null,
      isEligible: true,
      openForBids: true
    },
    {
      id: 2,
      role: 'TM3',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      date: '2023-04-10',
      startTime: '06:15',
      endTime: '14:00',
      breakDuration: '30 min',
      remunerationLevel: 'GOLD',
      assignedTo: null,
      isEligible: true,
      openForBids: true
    },
    {
      id: 3,
      role: 'TM2',
      department: 'Convention Centre',
      subGroup: 'AM Assist',
      date: '2023-04-10',
      startTime: '11:30',
      endTime: '16:30',
      breakDuration: '30 min',
      remunerationLevel: 'SILVER',
      assignedTo: null,
      isEligible: false,
      openForBids: true,
      ineligibilityReason: 'Role requirements not met'
    },
    {
      id: 4,
      role: 'Team Leader',
      department: 'Exhibition Centre',
      subGroup: 'Bump-In',
      date: '2023-04-11',
      startTime: '08:00',
      endTime: '16:00',
      breakDuration: '45 min',
      remunerationLevel: 'GOLD',
      assignedTo: null,
      isEligible: false,
      openForBids: true,
      ineligibilityReason: 'Department mismatch'
    },
    {
      id: 5,
      role: 'Supervisor',
      department: 'Theatre',
      subGroup: 'AM Floaters',
      date: '2023-04-12',
      startTime: '08:00',
      endTime: '16:00',
      breakDuration: '45 min',
      remunerationLevel: 'GOLD',
      assignedTo: null,
      isEligible: true,
      openForBids: true
    }
  ];
  
  // Sample data for my bids
  const myBids = [
    {
      id: 101,
      shiftId: 5,
      role: 'Supervisor',
      department: 'Theatre',
      subGroup: 'AM Floaters',
      date: '2023-04-12',
      startTime: '08:00',
      endTime: '16:00',
      breakDuration: '45 min',
      remunerationLevel: 'GOLD',
      status: 'pending' as const,
      bidTime: '2023-04-02 14:30',
      notes: null
    },
    {
      id: 102,
      shiftId: 1,
      role: 'Team Leader',
      department: 'Convention Centre',
      subGroup: 'AM Base',
      date: '2023-04-03',
      startTime: '05:45',
      endTime: '14:00',
      breakDuration: '30 min',
      remunerationLevel: 'GOLD',
      status: 'approved' as const,
      bidTime: '2023-04-01 09:15',
      notes: 'Assigned on manager approval'
    },
    {
      id: 103,
      shiftId: 3,
      role: 'TM2',
      department: 'Convention Centre',
      subGroup: 'PM Base',
      date: '2023-04-02',
      startTime: '14:00',
      endTime: '21:30',
      breakDuration: '30 min',
      remunerationLevel: 'SILVER',
      status: 'rejected' as const,
      bidTime: '2023-03-29 16:45',
      notes: 'Shift assigned to employee with higher seniority'
    }
  ];
  
  const handleBidForShift = (shiftId: number) => {
    toast({
      title: 'Bid Submitted',
      description: 'Your bid has been submitted successfully. You can track its status in My Bids.',
    });
  };
  
  const handleCancelBid = (bidId: number) => {
    toast({
      title: 'Bid Cancelled',
      description: 'Your bid has been cancelled.',
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="glass-panel p-6 mb-6" style={{ animation: 'none' }}>
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            <User className="mr-2 text-purple-400" size={24} />
            Shift Bidding
          </h1>
          
          <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-black/20 border border-white/10 mb-6">
              <TabsTrigger 
                value="available" 
                className="data-[state=active]:bg-white/10"
              >
                Available Shifts
              </TabsTrigger>
              <TabsTrigger 
                value="myBids" 
                className="data-[state=active]:bg-white/10"
              >
                My Bids
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="space-y-6">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 flex items-start">
                <Info className="text-blue-400 mr-3 mt-1" size={20} />
                <div>
                  <h3 className="text-blue-300 font-medium mb-1">Bidding Information</h3>
                  <p className="text-white/80 text-sm">
                    You can bid on shifts that match your role, department, and tier. 
                    The system will check your eligibility and work hour compliance before submitting your bid.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableShifts.map(shift => (
                  <div 
                    key={shift.id} 
                    className={`p-4 rounded-lg border ${
                      shift.isEligible ? 'bg-black/20 border-white/10 hover:border-white/20' : 'bg-black/10 border-white/5'
                    } transition-all duration-300`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-white">{shift.role}</h3>
                        <div className="flex items-center mt-1">
                          <Building size={14} className="text-white/60 mr-1" />
                          <span className="text-sm text-white/80">{shift.department} - {shift.subGroup}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        shift.remunerationLevel === 'GOLD' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30' :
                        shift.remunerationLevel === 'SILVER' ? 'bg-slate-400/30 text-slate-300 border border-slate-400/30' :
                        'bg-orange-600/30 text-orange-300 border border-orange-600/30'
                      }`}>
                        {shift.remunerationLevel}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar size={14} className="text-white/60 mr-2" />
                        <span className="text-white/80">{shift.date}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Clock size={14} className="text-white/60 mr-2" />
                        <span className="text-white/80">{shift.startTime} - {shift.endTime}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Award size={14} className="text-white/60 mr-2" />
                        <span className="text-white/80">Break: {shift.breakDuration}</span>
                      </div>
                    </div>
                    
                    {shift.isEligible ? (
                      <Button 
                        onClick={() => handleBidForShift(shift.id)}
                        className="w-full bg-purple-500/30 hover:bg-purple-500/40 border border-purple-500/30 hover:border-purple-500/50"
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Express Interest
                      </Button>
                    ) : (
                      <div className="bg-red-900/20 border border-red-500/30 rounded-md p-3 text-sm">
                        <div className="flex items-center text-red-300 mb-1">
                          <ShieldAlert size={14} className="mr-1" />
                          <span className="font-medium">Not Eligible</span>
                        </div>
                        <p className="text-white/70">{shift.ineligibilityReason}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {availableShifts.length === 0 && (
                <div className="text-center py-8 text-white/60">
                  No shifts are currently available for bidding.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="myBids" className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="text-left p-3 text-sm font-medium text-white/80">Role</th>
                      <th className="text-left p-3 text-sm font-medium text-white/80">Department</th>
                      <th className="text-left p-3 text-sm font-medium text-white/80">Date</th>
                      <th className="text-left p-3 text-sm font-medium text-white/80">Time</th>
                      <th className="text-left p-3 text-sm font-medium text-white/80">Tier</th>
                      <th className="text-left p-3 text-sm font-medium text-white/80">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-white/80">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBids.map(bid => (
                      <tr key={bid.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-3 text-sm">{bid.role}</td>
                        <td className="p-3 text-sm">{bid.department} - {bid.subGroup}</td>
                        <td className="p-3 text-sm">{bid.date}</td>
                        <td className="p-3 text-sm">{bid.startTime} - {bid.endTime}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            bid.remunerationLevel === 'GOLD' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30' :
                            bid.remunerationLevel === 'SILVER' ? 'bg-slate-400/30 text-slate-300 border border-slate-400/30' :
                            'bg-orange-600/30 text-orange-300 border border-orange-600/30'
                          }`}>
                            {bid.remunerationLevel}
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          <BidStatusBadge status={bid.status} />
                          {bid.notes && (
                            <div className="text-xs text-white/60 mt-1">{bid.notes}</div>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {bid.status === 'pending' && (
                            <button 
                              onClick={() => handleCancelBid(bid.id)}
                              className="p-1.5 rounded-full hover:bg-red-500/20 text-red-400"
                              title="Cancel Bid"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {myBids.length === 0 && (
                <div className="text-center py-8 text-white/60">
                  You have not placed any bids yet.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmployeeBidsPage;
