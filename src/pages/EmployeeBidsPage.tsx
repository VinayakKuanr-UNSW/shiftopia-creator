import React, { useState } from 'react';
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
import { useEmployeeBids } from '@/hooks/useEmployeeBids';

const EmployeeBidsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('available');
  const { toast } = useToast();
  const { 
    myBids, 
    availableShifts, 
    loading, 
    bidForShift, 
    withdrawBid,
    checkEligibility 
  } = useEmployeeBids();

  const handleBidForShift = async (shiftId: number) => {
    const result = await bidForShift(shiftId.toString());
    if (result) {
      toast({
        title: 'Bid Submitted',
        description: 'Your bid has been submitted successfully. You can track its status in My Bids.',
      });
    }
  };
  
  const handleCancelBid = async (bidId: number) => {
    // Implement when withdrawBid is fully implemented
    toast({
      title: 'Bid Cancelled',
      description: 'Your bid has been cancelled.',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 mb-6" style={{ animation: 'none' }}>
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <User className="mr-2 text-purple-400" size={24} />
          Shift Bidding
        </h1>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
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
              {availableShifts.map(shift => {
                const { isEligible, reason } = checkEligibility(shift);
                return (
                  <div 
                    key={shift.id} 
                    className={`p-4 rounded-lg border ${
                      isEligible ? 'bg-black/20 border-white/10 hover:border-white/20' : 'bg-black/10 border-white/5'
                    } transition-all duration-300`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-white">{shift.role}</h3>
                        <div className="flex items-center mt-1">
                          <Building size={14} className="text-white/60 mr-1" />
                          <span className="text-sm text-white/80">{shift.department} - {shift.subDepartment}</span>
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
                        <span className="text-white/80">Break: {shift.paidBreakDuration}</span>
                      </div>
                    </div>
                    
                    {isEligible ? (
                      <Button 
                        onClick={() => handleBidForShift(parseInt(shift.id))}
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
                        <p className="text-white/70">{reason || "You don't meet the requirements for this shift"}</p>
                      </div>
                    )}
                  </div>
                );
              })}
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
                  {myBids.map(bid => {
                    const shift = bid.shiftDetails;
                    if (!shift) return null;
                    
                    return (
                      <tr key={bid.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-3 text-sm">{shift.role}</td>
                        <td className="p-3 text-sm">{shift.department} - {shift.subDepartment}</td>
                        <td className="p-3 text-sm">{shift.date}</td>
                        <td className="p-3 text-sm">{shift.startTime} - {shift.endTime}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            shift.remunerationLevel === 'GOLD' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30' :
                            shift.remunerationLevel === 'SILVER' ? 'bg-slate-400/30 text-slate-300 border border-slate-400/30' :
                            'bg-orange-600/30 text-orange-300 border border-orange-600/30'
                          }`}>
                            {shift.remunerationLevel}
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          <BidStatusBadge status={bid.status.toLowerCase() as any} />
                          {bid.notes && (
                            <div className="text-xs text-white/60 mt-1">{bid.notes}</div>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {bid.status === 'Pending' && (
                            <button 
                              onClick={() => handleCancelBid(parseInt(bid.id))}
                              className="p-1.5 rounded-full hover:bg-red-500/20 text-red-400"
                              title="Cancel Bid"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
  );
};

export default EmployeeBidsPage;
