
import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { useBids } from '@/api/hooks/useBids';
import { useEmployees } from '@/api/hooks/useEmployees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Plus, 
  Search,
  Users,
  X,
  CheckCircle,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { BidWithEmployee } from './types/bid-types';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import CreateBidModal from '@/components/management/CreateBidModal';
import { useBidFiltering } from '@/hooks/useBidFiltering';
import { processBidsWithDetails, getApplicantsForShift } from './utils/bidUtils';
import BidStatusFilter from './BidStatusFilter';
import BidFilterPopover from './BidFilterPopover';
import DateGroup from './DateGroup';

const OpenBidsPage: React.FC = () => {
  const { useAllBids, useUpdateBidStatus } = useBids();
  const { useAllEmployees } = useEmployees();
  const { data: allBids = [], isLoading, refetch } = useAllBids();
  const { data: employees = [] } = useAllEmployees();
  const { toast } = useToast();
  const { mutate: updateBidStatus } = useUpdateBidStatus();
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: addDays(new Date(), 7)
  });
  
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});
  const [expandedBids, setExpandedBids] = useState<Record<string, boolean>>({});
  const [selectedBids, setSelectedBids] = useState<string[]>([]);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [bidToOffer, setBidToOffer] = useState<BidWithEmployee | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const bidsWithDetails = processBidsWithDetails(allBids, employees);
  
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    subDepartmentFilter,
    setSubDepartmentFilter,
    roleFilter,
    setRoleFilter,
    sortByScore,
    setSortByScore,
    filteredBids,
    groupedBids,
    sortedDates,
  } = useBidFiltering(bidsWithDetails, dateRange);
  
  const toggleExpandDate = (date: string) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };
  
  const toggleExpandBid = (bidId: string) => {
    setExpandedBids(prev => ({
      ...prev,
      [bidId]: !prev[bidId]
    }));
  };
  
  const toggleSelectBid = (bidId: string) => {
    setSelectedBids(prev => 
      prev.includes(bidId) 
        ? prev.filter(id => id !== bidId)
        : [...prev, bidId]
    );
  };
  
  const handleOfferShift = (bid: BidWithEmployee) => {
    setBidToOffer(bid);
    setOfferDialogOpen(true);
  };
  
  const confirmOfferShift = () => {
    if (!bidToOffer) return;
    
    updateBidStatus(
      { id: bidToOffer.id, status: 'Approved' },
      {
        onSuccess: () => {
          toast({
            title: "Shift Offered",
            description: `Shift has been offered to ${bidToOffer.employee?.name || 'employee'}.`,
          });
          refetch();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to offer shift.",
            variant: "destructive",
          });
        }
      }
    );
    
    setOfferDialogOpen(false);
    setBidToOffer(null);
  };
  
  const handleBulkOffer = () => {
    if (selectedBids.length === 0) {
      toast({
        title: "No bids selected",
        description: "Please select at least one bid to offer.",
        variant: "destructive",
      });
      return;
    }
    
    let successCount = 0;
    
    selectedBids.forEach(bidId => {
      const bid = filteredBids.find(b => b.id === bidId);
      if (bid && bid.status === 'Pending') {
        updateBidStatus(
          { id: bidId, status: 'Approved' },
          {
            onSuccess: () => {
              successCount++;
              if (successCount === selectedBids.length) {
                toast({
                  title: "Shifts Offered",
                  description: `${successCount} shifts have been offered successfully.`,
                });
                setSelectedBids([]);
                refetch();
              }
            }
          }
        );
      }
    });
  };
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being exported to CSV.",
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully.",
      });
    }, 1500);
  };
  
  useEffect(() => {
    if (sortedDates.length > 0 && Object.keys(expandedDates).length === 0) {
      const initialExpandedDates: Record<string, boolean> = {};
      sortedDates.slice(0, 3).forEach(date => {
        initialExpandedDates[date] = true;
      });
      setExpandedDates(initialExpandedDates);
    }
  }, [sortedDates, expandedDates]);
  
  return (
    <div className="glass-panel p-6" style={{ animation: 'none' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Open Bids</h1>
        <p className="text-white/60">Manage shift bidding process and assignments.</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="w-full sm:w-auto"
          />
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/10"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Bid
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
          <Input
            type="text"
            placeholder="Search bids..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/10 pl-9 text-white"
          />
        </div>
        
        <BidStatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
        
        <div className="flex flex-wrap gap-2 items-center">
          <BidFilterPopover 
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            subDepartmentFilter={subDepartmentFilter}
            setSubDepartmentFilter={setSubDepartmentFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/10"
            onClick={() => setSortByScore(!sortByScore)}
          >
            <Award className="mr-2 h-4 w-4" />
            Sort by: {sortByScore ? 'Suitability Score' : 'Timestamp'}
          </Button>
        </div>
      </div>
      
      {selectedBids.length > 0 && (
        <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-md flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">{selectedBids.length}</span> bids selected
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white/10"
              onClick={() => setSelectedBids([])}
            >
              <X className="mr-2 h-4 w-4" />
              Clear Selection
            </Button>
            <Button 
              size="sm" 
              className="bg-green-600"
              onClick={handleBulkOffer}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Offer Selected Shifts
            </Button>
          </div>
        </div>
      )}
      
      {sortedDates.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No bids found</h3>
          <p className="text-white/60 mt-2">
            {searchQuery || statusFilter !== 'all' || departmentFilter !== 'All Departments' || 
             subDepartmentFilter !== 'All Sub-departments' || roleFilter !== 'All Roles'
              ? "No bids match your search criteria. Try adjusting your filters." 
              : "There are no bids in the system for the selected date range."}
          </p>
        </div>
      )}
      
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      
      <div className="space-y-4">
        {sortedDates.map(date => (
          <DateGroup 
            key={date}
            date={date}
            bids={groupedBids[date]}
            isExpanded={expandedDates[date] || false}
            toggleExpand={() => toggleExpandDate(date)}
            expandedBids={expandedBids}
            toggleExpandBid={toggleExpandBid}
            selectedBids={selectedBids}
            toggleSelectBid={toggleSelectBid}
            getApplicantsForShift={(shiftId) => getApplicantsForShift(filteredBids, shiftId, sortByScore)}
            handleOfferShift={handleOfferShift}
            sortByScore={sortByScore}
          />
        ))}
      </div>
      
      <AlertDialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <AlertDialogContent className="bg-slate-900 text-white border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Shift Offer</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to offer this shift to {bidToOffer?.employee?.name || 'this employee'}?
              Once offered, the employee will be notified and can accept the shift.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-green-600 hover:bg-green-700" onClick={confirmOfferShift}>
              Confirm Offer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <CreateBidModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onBidCreated={() => {
          refetch();
          toast({
            title: "Bid Created",
            description: "The new bid has been successfully created."
          });
        }}
      />
    </div>
  );
};

export default OpenBidsPage;
