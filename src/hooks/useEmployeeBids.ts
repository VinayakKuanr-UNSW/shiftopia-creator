
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBids } from '@/api/hooks/useBids';
import { useShifts } from '@/api/hooks/useShifts';
import { Bid, ShiftDetails } from '@/api/models/types';
import { useBidActions } from './useBidActions';

export interface EmployeeBidWithShift extends Bid {
  shiftDetails?: ShiftDetails;
}

export const useEmployeeBids = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myBids, setMyBids] = useState<EmployeeBidWithShift[]>([]);
  const [availableShifts, setAvailableShifts] = useState<ShiftDetails[]>([]);
  const { useBidsByEmployee } = useBids();
  const { useAllShifts } = useShifts();
  const { data: allShifts = [], isLoading: shiftsLoading } = useAllShifts();
  const { submitBid } = useBidActions();

  // Fetch employee's bids
  const { data: employeeBids = [], isLoading: bidsLoading } = useBidsByEmployee(
    user?.id || ''
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!user || bidsLoading || shiftsLoading) {
        return;
      }

      try {
        // Combine bids with shift details
        const bidsWithShifts: EmployeeBidWithShift[] = await Promise.all(
          employeeBids.map(async (bid) => {
            const matchingShift = allShifts.find(shift => shift.id === bid.shiftId);
            return {
              ...bid,
              shiftDetails: matchingShift
            };
          })
        );

        // Get available shifts (not assigned and not already bid on)
        const biddedShiftIds = new Set(employeeBids.map(bid => bid.shiftId));
        const available = allShifts.filter(shift => {
          return (
            shift.status === 'Open' && 
            !shift.assignedEmployee &&
            !biddedShiftIds.has(shift.id) &&
            !shift.isDraft
          );
        });

        setMyBids(bidsWithShifts);
        setAvailableShifts(available);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bid data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, employeeBids, allShifts, bidsLoading, shiftsLoading]);

  const bidForShift = async (shiftId: string, notes?: string) => {
    if (!user) return false;
    const result = await submitBid(shiftId, user.id, notes);
    if (result) {
      // Add the shift to the list of user's bids
      const shift = availableShifts.find(s => s.id === shiftId);
      if (shift) {
        // Remove from available shifts
        setAvailableShifts(prev => prev.filter(s => s.id !== shiftId));
      }
    }
    return result;
  };

  const withdrawBid = async (bidId: string) => {
    // Implement withdraw functionality
    // This would call bidService.withdrawBid
    // And update the local state
  };

  const checkEligibility = (shift: ShiftDetails): { isEligible: boolean; reason?: string } => {
    if (!user) return { isEligible: false, reason: 'User not authenticated' };
    
    // Implement eligibility checks based on user role, department, etc.
    // This is a placeholder implementation
    const isEligible = true;
    const reason = undefined;
    
    return { isEligible, reason };
  };

  return {
    myBids,
    availableShifts,
    loading,
    bidForShift,
    withdrawBid,
    checkEligibility
  };
};
