
import { useState, useEffect } from 'react';
import { useBids } from '@/api/hooks/useBids';
import { useEmployees } from '@/api/hooks/useEmployees';
import { useShifts } from '@/api/hooks/useShifts';
import { processBidsWithDetails } from '@/components/management/utils/bidUtils';
import { BidWithEmployee } from '@/components/management/types/bid-types';
import { useBidActions } from './useBidActions';

export const useManageBids = () => {
  const [processedBids, setProcessedBids] = useState<BidWithEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [sortOption, setSortOption] = useState({
    id: 'date',
    name: 'Date',
    value: 'date' as keyof BidWithEmployee['shiftDetails'] | 'timestamp' | 'suitabilityScore',
    direction: 'asc' as 'asc' | 'desc'
  });
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { useAllBids } = useBids();
  const { useAllEmployees } = useEmployees();
  const { data: bids = [], isLoading: bidsLoading } = useAllBids();
  const { data: employees = [], isLoading: employeesLoading } = useAllEmployees();
  const { approveBid, rejectBid, bulkProcessBids, isProcessing } = useBidActions();

  // Process bids on load
  useEffect(() => {
    const fetchAndProcessBids = async () => {
      if (!bidsLoading && !employeesLoading && bids.length > 0 && employees.length > 0) {
        try {
          const processed = await processBidsWithDetails(bids, employees);
          setProcessedBids(processed);
          setLoading(false);
        } catch (error) {
          console.error('Error processing bids:', error);
          setLoading(false);
        }
      } else if (!bidsLoading && !employeesLoading) {
        setLoading(false);
      }
    };
    
    fetchAndProcessBids();
  }, [bids, employees, bidsLoading, employeesLoading]);

  // Load filter state from localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('bidFilters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        
        // Convert date strings back to Date objects
        if (parsedFilters.startDate) {
          parsedFilters.startDate = new Date(parsedFilters.startDate);
        }
        if (parsedFilters.endDate) {
          parsedFilters.endDate = new Date(parsedFilters.endDate);
        }
        
        setFilterOptions(parsedFilters);
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
    
    const savedSortOption = localStorage.getItem('bidSortOption');
    if (savedSortOption) {
      try {
        setSortOption(JSON.parse(savedSortOption));
      } catch (error) {
        console.error('Error loading saved sort option:', error);
      }
    }
    
    const savedViewMode = localStorage.getItem('bidViewMode');
    if (savedViewMode === 'list' || savedViewMode === 'calendar') {
      setViewMode(savedViewMode as 'list' | 'calendar');
    }
  }, []);
  
  // Save filter state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('bidFilters', JSON.stringify(filterOptions));
  }, [filterOptions]);
  
  // Save sort option to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('bidSortOption', JSON.stringify(sortOption));
  }, [sortOption]);
  
  // Save view mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('bidViewMode', viewMode);
  }, [viewMode]);

  // Filter bids
  const filteredBids = processedBids.filter(bid => {
    const { 
      startDate, endDate, department, subDepartment, role, 
      status, isAssigned, isDraft, minHours, maxHours, remunerationLevel 
    } = filterOptions;
    
    // Date filter
    if (startDate && bid.shiftDetails?.date && new Date(bid.shiftDetails.date) < startDate) {
      return false;
    }
    
    if (endDate && bid.shiftDetails?.date && new Date(bid.shiftDetails.date) > endDate) {
      return false;
    }
    
    // Department filter
    if (department && bid.shiftDetails?.department !== department) {
      return false;
    }
    
    // Sub-department filter
    if (subDepartment && bid.shiftDetails?.subDepartment !== subDepartment) {
      return false;
    }
    
    // Role filter
    if (role && bid.shiftDetails?.role !== role) {
      return false;
    }
    
    // Status filter
    if (status && bid.shiftDetails?.status !== status) {
      return false;
    }
    
    // Assigned filter
    if (isAssigned !== undefined) {
      const hasAssignee = !!bid.shiftDetails?.assignedEmployee;
      if (isAssigned !== hasAssignee) {
        return false;
      }
    }
    
    // Draft filter
    if (isDraft !== undefined && bid.shiftDetails?.isDraft !== isDraft) {
      return false;
    }
    
    // Hours filter
    if (minHours !== undefined || maxHours !== undefined) {
      const hours = Number(bid.shiftDetails?.netLength || 0);
      if ((minHours !== undefined && hours < minHours) || 
          (maxHours !== undefined && hours > maxHours)) {
        return false;
      }
    }
    
    // Remuneration level filter
    if (remunerationLevel && bid.shiftDetails?.remunerationLevel !== remunerationLevel) {
      return false;
    }
    
    // Calendar date filter
    if (selectedDate && viewMode === 'calendar') {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      if (bid.shiftDetails?.date !== selectedDateStr) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort bids
  const sortedBids = [...filteredBids].sort((a, b) => {
    const { value, direction } = sortOption;
    const modifier = direction === 'asc' ? 1 : -1;
    
    if (value === 'timestamp') {
      // Sort by timestamp
      return modifier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (value === 'suitabilityScore') {
      // Sort by suitability score (using tier as a proxy)
      const scoreA = Number(a.employee?.tier || 0);
      const scoreB = Number(b.employee?.tier || 0);
      return modifier * (scoreB - scoreA);
    } else if (a.shiftDetails && b.shiftDetails) {
      // Sort by shift details
      const aValue = a.shiftDetails[value];
      const bValue = b.shiftDetails[value];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return modifier * aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return modifier * (aValue - bValue);
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return modifier * (aValue === bValue ? 0 : aValue ? 1 : -1);
      }
    }
    
    return 0;
  });

  // Group bids by shift
  const bidsByShift: Record<string, BidWithEmployee[]> = {};
  sortedBids.forEach(bid => {
    if (!bidsByShift[bid.shiftId]) {
      bidsByShift[bid.shiftId] = [];
    }
    bidsByShift[bid.shiftId].push(bid);
  });
  
  // Get unique shift IDs from processed bids
  const shiftIds = [...new Set(sortedBids.map(bid => bid.shiftId))];
  
  // Get one representative bid for each shift
  const shiftBids = shiftIds.map(shiftId => 
    sortedBids.find(bid => bid.shiftId === shiftId)
  ).filter(Boolean) as BidWithEmployee[];

  // Handle bid approval
  const handleApprove = async (bid: BidWithEmployee) => {
    return await approveBid(bid.id, bid.employeeId, bid.shiftId);
  };

  // Handle bid rejection
  const handleReject = async (bid: BidWithEmployee, reason?: string) => {
    return await rejectBid(bid.id, reason);
  };

  return {
    processedBids,
    filteredBids,
    sortedBids,
    shiftBids,
    bidsByShift,
    loading,
    isProcessing,
    filterOptions,
    setFilterOptions,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    handleApprove,
    handleReject
  };
};
