
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bidService } from '../services/bidService';
import { Bid } from '../models/types';

export const useBids = () => {
  const queryClient = useQueryClient();
  
  // Get all bids
  const useAllBids = () => {
    return useQuery({
      queryKey: ['bids'],
      queryFn: bidService.getAllBids
    });
  };
  
  // Get bid by ID
  const useBid = (id: string) => {
    return useQuery({
      queryKey: ['bids', id],
      queryFn: () => bidService.getBidById(id),
      enabled: !!id
    });
  };
  
  // Get bids by employee
  const useBidsByEmployee = (employeeId: string) => {
    return useQuery({
      queryKey: ['bids', 'employee', employeeId],
      queryFn: () => bidService.getBidsByEmployee(employeeId),
      enabled: !!employeeId
    });
  };
  
  // Get bids for shift
  const useBidsForShift = (shiftId: string) => {
    return useQuery({
      queryKey: ['bids', 'shift', shiftId],
      queryFn: () => bidService.getBidsForShift(shiftId),
      enabled: !!shiftId
    });
  };
  
  // Create bid
  const useCreateBid = () => {
    return useMutation({
      mutationFn: (bid: Omit<Bid, 'id' | 'createdAt'>) => bidService.createBid(bid),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['bids'] });
        queryClient.invalidateQueries({ queryKey: ['bids', 'employee', data.employeeId] });
        queryClient.invalidateQueries({ queryKey: ['bids', 'shift', data.shiftId] });
      }
    });
  };
  
  // Update bid status
  const useUpdateBidStatus = () => {
    return useMutation({
      mutationFn: ({ id, status }: { id: string, status: 'Pending' | 'Approved' | 'Rejected' }) => 
        bidService.updateBidStatus(id, status),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['bids'] });
          queryClient.invalidateQueries({ queryKey: ['bids', data.id] });
          queryClient.invalidateQueries({ queryKey: ['bids', 'employee', data.employeeId] });
          queryClient.invalidateQueries({ queryKey: ['bids', 'shift', data.shiftId] });
        }
      }
    });
  };
  
  return {
    useAllBids,
    useBid,
    useBidsByEmployee,
    useBidsForShift,
    useCreateBid,
    useUpdateBidStatus
  };
};
