import React, { useState } from 'react';
import { Calendar, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BidItem from './BidItem';
import BidFilterPopover from './BidFilterPopover';
import BidSortDropdown from './BidSortDropdown';
import BidCalendarView from './BidCalendarView';
import { useManageBids } from '@/hooks/useManageBids';

const OpenBidsPage: React.FC = () => {
  // State for expanded items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // State for selected items (not needed anymore but keeping for compatibility)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const {
    filteredBids,
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
    handleApprove
  } = useManageBids();
  
  // Count active filters
  const activeFilterCount = Object.values(filterOptions).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length + (selectedDate ? 1 : 0);
  
  // Toggle expanded state for a bid
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Toggle selected state for a bid
  const toggleSelect = (id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl mb-4">Open Bids</h2>
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">Open Bids</h2>
        
        <div className="flex items-center space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('list')}
              disabled={isProcessing}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('calendar')}
              disabled={isProcessing}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendar
            </Button>
          </div>
          
          <BidSortDropdown currentSort={sortOption} onSortChange={setSortOption} />
          <BidFilterPopover 
            filters={filterOptions} 
            onFilterChange={setFilterOptions} 
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>
      
      {filteredBids.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-10 text-center">
          <h3 className="text-xl font-medium mb-2">No matching shifts found</h3>
          <p className="text-white/70">
            {shiftBids.length === 0 
              ? "No bids have been created yet." 
              : "Try adjusting your filters to see more results."}
          </p>
        </div>
      ) : viewMode === 'list' ? (
        <div>
          <p className="mb-4 text-white/70">
            Showing {filteredBids.length} of {shiftBids.length} total shifts
          </p>
          
          <div className="space-y-2">
            {shiftBids.map((bid) => (
              <BidItem
                key={bid.shiftId}
                bid={bid}
                isExpanded={!!expandedItems[bid.shiftId]}
                toggleExpand={() => toggleExpand(bid.shiftId)}
                isSelected={!!selectedItems[bid.id]}
                toggleSelect={() => toggleSelect(bid.id)}
                applicants={bidsByShift[bid.shiftId] || []}
                handleOfferShift={handleApprove}
                sortByScore={sortOption.value === 'suitabilityScore'}
              />
            ))}
          </div>
        </div>
      ) : (
        <BidCalendarView 
          bids={filteredBids}
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default OpenBidsPage;
