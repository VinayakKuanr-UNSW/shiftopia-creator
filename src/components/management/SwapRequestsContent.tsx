import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import ManagementSearch from '@/components/management/ManagementSearch';
import ManagementFilter from '@/components/management/ManagementFilter';
import SwapDetailsModal from '@/components/management/SwapDetailsModal';
import { useManagementFilter } from '@/hooks/useManagementFilter';
import { usePagination } from '@/hooks/usePagination';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';

interface SwapRequest {
  id: string;
  requestor: { 
    id: string;
    name: string; 
    avatar: string 
  };
  recipient: { 
    id: string;
    name: string; 
    avatar: string 
  };
  department: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedOn: string;
  reason?: string;
}

const SwapRequestsContent: React.FC = () => {
  // Sample data for swap requests
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([
    { 
      id: "swap-1",
      requestor: { id: "emp-1", name: "Emma Thompson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Emma" },
      recipient: { id: "emp-2", name: "Michael Johnson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Michael" },
      department: "Convention",
      fromDate: "June 15, 2023 (9AM-5PM)",
      toDate: "June 17, 2023 (10AM-6PM)",
      status: "pending",
      submittedOn: "May 25, 2023"
    },
    { 
      id: "swap-2",
      requestor: { id: "emp-3", name: "David Wilson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=David" },
      recipient: { id: "emp-4", name: "Sarah Brown", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah" },
      department: "Exhibition",
      fromDate: "July 8, 2023 (2PM-10PM)",
      toDate: "July 10, 2023 (10AM-6PM)",
      status: "approved",
      submittedOn: "June 1, 2023"
    },
    { 
      id: "swap-3",
      requestor: { id: "emp-5", name: "Jessica Miller", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jessica" },
      recipient: { id: "emp-6", name: "Robert Davis", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Robert" },
      department: "Theatre",
      fromDate: "June 22, 2023 (5PM-11PM)",
      toDate: "June 24, 2023 (1PM-7PM)",
      status: "rejected",
      submittedOn: "May 20, 2023"
    },
    { 
      id: "swap-4",
      requestor: { id: "emp-7", name: "John Smith", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=John" },
      recipient: { id: "emp-8", name: "Emily Clark", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Emily" },
      department: "Convention",
      fromDate: "July 5, 2023 (8AM-4PM)",
      toDate: "July 7, 2023 (12PM-8PM)",
      status: "pending",
      submittedOn: "June 10, 2023"
    },
    { 
      id: "swap-5",
      requestor: { id: "emp-9", name: "Alexandra Johnson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Alexandra" },
      recipient: { id: "emp-10", name: "Thomas Wright", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Thomas" },
      department: "Exhibition",
      fromDate: "August 12, 2023 (10AM-6PM)",
      toDate: "August 14, 2023 (2PM-10PM)",
      status: "pending",
      submittedOn: "July 20, 2023"
    }
  ]);
  
  // State for selected swap request and modal
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Set up filtering
  const filterOptions = [
    { label: 'All Requests', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ];
  
  const { 
    searchQuery, 
    setSearchQuery, 
    activeFilter, 
    setActiveFilter, 
    filteredItems: filteredSwaps 
  } = useManagementFilter(swapRequests, {
    searchBy: (swap, query) => {
      const searchLower = query.toLowerCase();
      return (
        swap.requestor.name.toLowerCase().includes(searchLower) ||
        swap.recipient.name.toLowerCase().includes(searchLower) ||
        swap.department.toLowerCase().includes(searchLower)
      );
    },
    filterBy: (swap, filter) => swap.status === filter
  });
  
  // Set up pagination
  const {
    paginatedItems: paginatedSwaps,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setCurrentPage
  } = usePagination(filteredSwaps, 1, 3);

  const handleViewDetails = (swap: SwapRequest) => {
    setSelectedSwap(swap);
    setIsDetailsModalOpen(true);
  };
  
  const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
    setSwapRequests(prev => 
      prev.map(swap => 
        swap.id === id ? { ...swap, status } : swap
      )
    );
    
    toast({
      title: `Swap request ${status}`,
      description: `The swap request has been ${status} successfully.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-64">
          <ManagementSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            placeholder="Search swap requests..."
          />
        </div>
      </div>
      
      <div className="mb-6">
        <ManagementFilter 
          options={filterOptions} 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>
      
      {paginatedSwaps.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No swap requests found</h3>
          <p className="text-white/60 mt-2">
            {searchQuery 
              ? "No requests match your search criteria. Try adjusting your filters." 
              : activeFilter !== 'all' 
                ? `No ${activeFilter} swap requests available.` 
                : "There are no swap requests in the system yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {paginatedSwaps.map(swap => (
            <SwapCard 
              key={swap.id}
              requestor={swap.requestor}
              recipient={swap.recipient}
              department={swap.department}
              fromDate={swap.fromDate}
              toDate={swap.toDate}
              status={swap.status}
              submittedOn={swap.submittedOn}
              onViewDetails={() => handleViewDetails(swap)}
            />
          ))}
        </div>
      )}
      
      {filteredSwaps.length > 0 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={goToPreviousPage} 
                  className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={goToNextPage} 
                  className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      {/* Modal */}
      <SwapDetailsModal 
        swapRequest={selectedSwap}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

interface SwapCardProps {
  requestor: { name: string; avatar: string };
  recipient: { name: string; avatar: string };
  department: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedOn: string;
  onViewDetails: () => void;
}

const SwapCard: React.FC<SwapCardProps> = ({
  requestor,
  recipient,
  department,
  fromDate,
  toDate,
  status,
  submittedOn,
  onViewDetails
}) => {
  const getBgColor = () => {
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
  
  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-900/20 text-yellow-400 border border-yellow-500/20">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-900/20 text-green-400 border border-green-500/20">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-900/20 text-red-400 border border-red-500/20">Rejected</span>;
    }
  };
  
  return (
    <Card className={`${getBgColor()} border`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Shift Swap Request</CardTitle>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-white/70">{department}</span>
            <span className="text-xs text-white/40">•</span>
            <span className="text-sm text-white/70">Submitted on {submittedOn}</span>
          </div>
        </div>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={requestor.avatar} />
                <AvatarFallback>{requestor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{requestor.name}</div>
                <div className="text-xs text-white/60">Requesting swap from</div>
              </div>
            </div>
            
            <div className="bg-white/10 px-3 py-1.5 rounded-md">
              <span className="text-sm">{fromDate}</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-white/5 w-0.5 h-6"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={recipient.avatar} />
                <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{recipient.name}</div>
                <div className="text-xs text-white/60">Swap to</div>
              </div>
            </div>
            
            <div className="bg-white/10 px-3 py-1.5 rounded-md">
              <span className="text-sm">{toDate}</span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button size="sm" className="bg-white/10 hover:bg-white/20" onClick={onViewDetails}>
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwapRequestsContent;
