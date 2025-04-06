
import { useState } from 'react';
import { useBids } from '@/api/hooks/useBids';
import { useShifts } from '@/api/hooks/useShifts';
import { useToast } from '@/hooks/use-toast';
import { Bid } from '@/api/models/types';

export const useBidActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { useCreateBid, useUpdateBidStatus, useAddNotesToBid, useBulkUpdateBidStatus } = useBids();
  const { mutateAsync: createBid } = useCreateBid();
  const { mutateAsync: updateBidStatus } = useUpdateBidStatus();
  const { mutateAsync: addNotesToBid } = useAddNotesToBid();
  const { mutateAsync: bulkUpdateBidStatus } = useBulkUpdateBidStatus();
  const { useUpdateShiftStatus } = useShifts();
  const { mutateAsync: updateShiftStatus } = useUpdateShiftStatus();
  const { toast } = useToast();

  const submitBid = async (shiftId: string, employeeId: string, notes?: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      await createBid({
        shiftId,
        employeeId,
        status: 'Pending',
        notes
      });
      
      toast({
        title: "Bid Submitted",
        description: "Your bid has been successfully submitted.",
      });
      setIsProcessing(false);
      return true;
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your bid. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return false;
    }
  };

  const approveBid = async (bidId: string, employeeId: string, shiftId: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      // Update bid status to Approved
      await updateBidStatus({
        id: bidId,
        status: 'Approved'
      });
      
      // Update shift status to Filled and assign employee
      await updateShiftStatus({
        id: shiftId,
        status: 'Filled',
        assignedEmployee: employeeId
      });
      
      toast({
        title: "Bid Approved",
        description: "The bid has been approved and the shift has been assigned.",
      });
      setIsProcessing(false);
      return true;
    } catch (error) {
      console.error('Error approving bid:', error);
      toast({
        title: "Approval Failed",
        description: "There was an error approving this bid. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return false;
    }
  };

  const rejectBid = async (bidId: string, reason?: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      await updateBidStatus({
        id: bidId,
        status: 'Rejected'
      });
      
      if (reason) {
        await addNotesToBid({
          id: bidId,
          notes: reason
        });
      }
      
      toast({
        title: "Bid Rejected",
        description: "The bid has been rejected.",
      });
      setIsProcessing(false);
      return true;
    } catch (error) {
      console.error('Error rejecting bid:', error);
      toast({
        title: "Rejection Failed",
        description: "There was an error rejecting this bid. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return false;
    }
  };

  const bulkProcessBids = async (
    bidIds: string[], 
    status: 'Approved' | 'Rejected' | 'Pending' | 'Confirmed',
    shiftIds?: Record<string, string>,
    employeeIds?: Record<string, string>
  ): Promise<boolean> => {
    setIsProcessing(true);
    try {
      // Update all bids at once
      await bulkUpdateBidStatus({
        ids: bidIds,
        status
      });
      
      // If approved, also update shifts
      if (status === 'Approved' && shiftIds && employeeIds) {
        const updatePromises = bidIds.map(bidId => {
          const shiftId = shiftIds[bidId];
          const employeeId = employeeIds[bidId];
          
          if (shiftId && employeeId) {
            return updateShiftStatus({
              id: shiftId,
              status: 'Filled',
              assignedEmployee: employeeId
            });
          }
          return Promise.resolve();
        });
        
        await Promise.all(updatePromises);
      }
      
      toast({
        title: `Bids ${status}`,
        description: `${bidIds.length} bids have been ${status.toLowerCase()}.`,
      });
      setIsProcessing(false);
      return true;
    } catch (error) {
      console.error(`Error bulk processing bids to ${status}:`, error);
      toast({
        title: "Processing Failed",
        description: "There was an error processing these bids. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return false;
    }
  };

  return {
    submitBid,
    approveBid,
    rejectBid,
    bulkProcessBids,
    isProcessing
  };
};
