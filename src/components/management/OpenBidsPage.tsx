
import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { useBids } from '@/api/hooks/useBids';
import { useEmployees } from '@/api/hooks/useEmployees';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Plus, 
  Users,
  CheckCircle,
  Calendar as CalendarIcon,
  List,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
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
import { useShiftFiltering } from '@/hooks/useShiftFiltering';
import { processBidsWithDetails } from './utils/bidUtils';
import BidFilters from './BidFilters';
import ShiftDateGroup from './ShiftDateGroup';

const OpenBidsPage: React.FC = () => {
  const { useAllBids, useUpdateBidStatus } = useBids();
  const { useAllEmployees } = useEmployees();
  const { data: allBids = [], isLoading, refetch } = useAllBids();
  const { data: employees = [] } = useAllEmployees();
  const { toast } = useToast();
  const { mutate: updateBidStatus } = useUpdateBidStatus();
  
  const initialDateRange: DateRange = {
    from: subDays(new Date(), 7),
    to: addDays(new Date(), 30)
  };
  
  const [bidToOffer, setBidToOffer] = useState<BidWithEmployee | null>(null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortByScore, setSortByScore] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
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
    sortOption,
    setSortOption,
    dateRange,
    setDateRange,
    showDrafts,
    setShowDrafts,
    showUnassigned,
    setShowUnassigned,
    hoursRange,
    setHoursRange,
    remunerationLevelFilter,
    setRemunerationLevelFilter,
    filteredBids,
    sortedBids,
    groupedBids,
    sortedDates,
  } = useShiftFiltering(bidsWithDetails, initialDateRange);
  
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
  
  return (
    <div className="glass-panel p-6" style={{ animation: 'none' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Open Bids</h1>
        <p className="text-white/60">Manage shift bidding process and assignments.</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'list' ? "default" : "outline"} 
            size="sm" 
            className={viewMode === 'list' ? "bg-purple-600" : "border-white/10"}
            onClick={() => setViewMode('list')}
          >
            <List className="mr-2 h-4 w-4" />
            List View
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? "default" : "outline"} 
            size="sm" 
            className={viewMode === 'calendar' ? "bg-purple-600" : "border-white/10"}
            onClick={() => setViewMode('calendar')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/10"
            onClick={() => setSortByScore(!sortByScore)}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Sort by: {sortByScore ? 'Suitability Score' : 'Timestamp'}
          </Button>
          
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
      
      <BidFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        subDepartmentFilter={subDepartmentFilter}
        setSubDepartmentFilter={setSubDepartmentFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        dateRange={dateRange}
        setDateRange={setDateRange}
        showDrafts={showDrafts}
        setShowDrafts={setShowDrafts}
        showUnassigned={showUnassigned}
        setShowUnassigned={setShowUnassigned}
        hoursRange={hoursRange}
        setHoursRange={setHoursRange}
        remunerationLevelFilter={remunerationLevelFilter}
        setRemunerationLevelFilter={setRemunerationLevelFilter}
      />
      
      {sortedDates.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No shifts found</h3>
          <p className="text-white/60 mt-2">
            No shifts match your search criteria. Try adjusting your filters.
          </p>
        </div>
      )}
      
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      
      {viewMode === 'list' && (
        <div className="space-y-4">
          {sortedDates.map(date => (
            <ShiftDateGroup
              key={date}
              date={date}
              bids={groupedBids[date]}
              allBids={filteredBids}
              handleOfferShift={handleOfferShift}
              sortByScore={sortByScore}
            />
          ))}
        </div>
      )}
      
      {viewMode === 'calendar' && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 h-[600px]">
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Calendar View</h3>
            <p className="text-white/60 mt-2">
              Calendar view is coming soon. Please use List view for now.
            </p>
          </div>
        </div>
      )}
      
      <AlertDialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <AlertDialogContent className="bg-slate-900 text-white border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Shift Offer</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to offer this shift to {bidToOffer?.employee?.name || 'this employee'}?
              {bidToOffer?.shiftDetails && (
                <div className="mt-4 bg-white/5 p-3 rounded-md">
                  <p className="mb-1"><strong>{bidToOffer.shiftDetails.role}</strong></p>
                  <p className="mb-1">{bidToOffer.shiftDetails.department} - {bidToOffer.shiftDetails.subDepartment}</p>
                  <p className="mb-1">{bidToOffer.shiftDetails.date}</p>
                  <p>{bidToOffer.shiftDetails.startTime} - {bidToOffer.shiftDetails.endTime}</p>
                </div>
              )}
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
