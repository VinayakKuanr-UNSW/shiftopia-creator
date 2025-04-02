
import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, isSameDay, parseISO } from 'date-fns';
import { useBids } from '@/api/hooks/useBids';
import { useEmployees } from '@/api/hooks/useEmployees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  CalendarCheck, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Filter, 
  MessageSquare, 
  Plus, 
  Search,
  Users,
  X,
  CheckCircle,
  Clock,
  Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Bid, Employee } from '@/api/models/types';
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import CreateBidModal from '@/components/management/CreateBidModal';

type BidWithEmployee = Bid & { 
  employee?: Employee,
  shiftDetails?: {
    role: string;
    startTime: string;
    endTime: string;
    department: string;
    subDepartment?: string;
    group?: string;
    subGroup?: string;
    remunerationLevel: string;
    breakDuration: string;
  }
};

type GroupedBids = {
  [date: string]: BidWithEmployee[];
};

const departments = ['All Departments', 'Convention Centre', 'Exhibition Centre', 'Theatre'];
const subDepartments = ['All Sub-departments', 'AM Base', 'PM Base', 'Floaters', 'Assist', 'Bump-In'];
const roles = ['All Roles', 'Team Leader', 'Supervisor', 'TM3', 'TM2', 'Coordinator'];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [subDepartmentFilter, setSubDepartmentFilter] = useState('All Sub-departments');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});
  const [expandedBids, setExpandedBids] = useState<Record<string, boolean>>({});
  const [selectedBids, setSelectedBids] = useState<string[]>([]);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [bidToOffer, setBidToOffer] = useState<BidWithEmployee | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortByScore, setSortByScore] = useState(false);
  
  const bidsWithDetails: BidWithEmployee[] = allBids.map(bid => {
    const employee = employees.find(emp => emp.id === bid.employeeId);
    
    const shiftIdNum = parseInt(bid.shiftId.replace(/\D/g, ''), 10) || 0;
    const department = shiftIdNum % 3 === 0 ? 'Convention Centre' : 
                      shiftIdNum % 3 === 1 ? 'Exhibition Centre' : 'Theatre';
    const subDep = ['AM Base', 'PM Base', 'Floaters', 'Assist', 'Bump-In'][shiftIdNum % 5];
    const role = ['Team Leader', 'Supervisor', 'TM3', 'TM2', 'Coordinator'][shiftIdNum % 5];
    
    const baseHourNum = 8 + (shiftIdNum % 4);
    const endHourNum = 16 + (shiftIdNum % 4);
    
    const baseHour = `${baseHourNum}:00`;
    const endHour = `${endHourNum}:00`;
    
    const remunerationValue = (shiftIdNum % 2 === 0) ? 'GOLD' : 'SILVER';
    
    // Fix: directly assign string value without using any arithmetic operations
    const breakDurationValue = "30 min";
    
    return {
      ...bid,
      employee,
      shiftDetails: {
        role,
        startTime: baseHour,
        endTime: endHour,
        department,
        subDepartment: subDep,
        group: department,
        subGroup: subDep,
        remunerationLevel: remunerationValue,
        breakDuration: breakDurationValue
      }
    };
  });
  
  const filteredBids = bidsWithDetails.filter(bid => {
    if (dateRange?.from && dateRange?.to) {
      const bidDate = new Date(bid.createdAt);
      if (bidDate < dateRange.from || bidDate > dateRange.to) {
        return false;
      }
    }
    
    if (statusFilter !== 'all' && bid.status !== statusFilter) {
      return false;
    }
    
    if (departmentFilter !== 'All Departments' && 
        bid.shiftDetails?.department !== departmentFilter) {
      return false;
    }
    
    if (subDepartmentFilter !== 'All Sub-departments' && 
        bid.shiftDetails?.subDepartment !== subDepartmentFilter) {
      return false;
    }
    
    if (roleFilter !== 'All Roles' && 
        bid.shiftDetails?.role !== roleFilter) {
      return false;
    }
    
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        (bid.employee?.name?.toLowerCase().includes(searchLower) || false) ||
        bid.shiftId.toLowerCase().includes(searchLower) ||
        (bid.notes?.toLowerCase().includes(searchLower) || false) ||
        (bid.shiftDetails?.role.toLowerCase().includes(searchLower) || false)
      );
    }
    
    return true;
  });
  
  const groupedBids: GroupedBids = filteredBids.reduce((groups, bid) => {
    const date = format(new Date(bid.createdAt), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(bid);
    return groups;
  }, {} as GroupedBids);
  
  const sortedDates = Object.keys(groupedBids).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">Open</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">Offered</Badge>;
      case 'Rejected':
        return <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">Rejected</Badge>;
      case 'Confirmed':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">Confirmed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>;
    }
  };
  
  const getApplicantsForShift = (shiftId: string): BidWithEmployee[] => {
    return filteredBids.filter(bid => bid.shiftId === shiftId)
      .sort((a, b) => {
        if (sortByScore) {
          const scoreA = a.employee?.tier || 0;
          const scoreB = b.employee?.tier || 0;
          return scoreB - scoreA;
        } else {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
      });
  };
  
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
        
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant={statusFilter === 'all' ? "outline" : "ghost"} 
            size="sm"
            className={statusFilter === 'all' ? "bg-white/5 border-white/10" : ""}
            onClick={() => setStatusFilter('all')}
          >
            All Bids
          </Button>
          <Button 
            variant={statusFilter === 'Pending' ? "outline" : "ghost"} 
            size="sm"
            className={statusFilter === 'Pending' ? "bg-white/5 border-white/10" : ""}
            onClick={() => setStatusFilter('Pending')}
          >
            Open
          </Button>
          <Button 
            variant={statusFilter === 'Approved' ? "outline" : "ghost"} 
            size="sm"
            className={statusFilter === 'Approved' ? "bg-white/5 border-white/10" : ""}
            onClick={() => setStatusFilter('Approved')}
          >
            Offered
          </Button>
          <Button 
            variant={statusFilter === 'Confirmed' ? "outline" : "ghost"} 
            size="sm"
            className={statusFilter === 'Confirmed' ? "bg-white/5 border-white/10" : ""}
            onClick={() => setStatusFilter('Confirmed')}
          >
            Confirmed
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/10"
              >
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-slate-900 border-white/10">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Department</h4>
                  <div className="flex flex-wrap gap-2">
                    {departments.map(dept => (
                      <Button 
                        key={dept}
                        variant={departmentFilter === dept ? "outline" : "ghost"} 
                        size="sm"
                        className={departmentFilter === dept ? "bg-white/5 border-white/10" : ""}
                        onClick={() => setDepartmentFilter(dept)}
                      >
                        {dept}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Sub-Department</h4>
                  <div className="flex flex-wrap gap-2">
                    {subDepartments.map(subDept => (
                      <Button 
                        key={subDept}
                        variant={subDepartmentFilter === subDept ? "outline" : "ghost"} 
                        size="sm"
                        className={subDepartmentFilter === subDept ? "bg-white/5 border-white/10" : ""}
                        onClick={() => setSubDepartmentFilter(subDept)}
                      >
                        {subDept}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Role</h4>
                  <div className="flex flex-wrap gap-2">
                    {roles.map(role => (
                      <Button 
                        key={role}
                        variant={roleFilter === role ? "outline" : "ghost"} 
                        size="sm"
                        className={roleFilter === role ? "bg-white/5 border-white/10" : ""}
                        onClick={() => setRoleFilter(role)}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-white/10"
                    onClick={() => {
                      setDepartmentFilter('All Departments');
                      setSubDepartmentFilter('All Sub-departments');
                      setRoleFilter('All Roles');
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={() => {
                      toast({
                        title: "Filter Preset Saved",
                        description: "Your filter configuration has been saved."
                      });
                    }}
                  >
                    Save as Preset
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
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
        {sortedDates.map(date => {
          const bids = groupedBids[date];
          const isExpanded = expandedDates[date] || false;
          
          return (
            <div key={date} className="border border-white/10 rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-white/5 cursor-pointer"
                onClick={() => toggleExpandDate(date)}
              >
                <div className="flex items-center">
                  <Calendar className="mr-3 h-5 w-5 text-white/60" />
                  <h3 className="font-medium">
                    {format(new Date(date), 'MMMM d, yyyy')}
                    <span className="ml-2 text-sm text-white/60">
                      {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
                    </span>
                  </h3>
                </div>
                <Button variant="ghost" size="sm">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>
              </div>
              
              {isExpanded && (
                <div className="divide-y divide-white/5">
                  {bids.map(bid => {
                    const isShiftExpanded = expandedBids[bid.id] || false;
                    const applicants = getApplicantsForShift(bid.shiftId);
                    
                    return (
                      <Collapsible key={bid.id} open={isShiftExpanded} onOpenChange={() => toggleExpandBid(bid.id)}>
                        <div className="p-4 hover:bg-white/5 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex">
                              <input
                                type="checkbox"
                                className="mr-3 mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                checked={selectedBids.includes(bid.id)}
                                onChange={() => toggleSelectBid(bid.id)}
                              />
                              <div>
                                <h4 className="font-medium text-white flex items-center">
                                  Shift ID: {bid.shiftId}
                                  <span className="ml-2">{getStatusBadge(bid.status)}</span>
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 mt-1">
                                  <div className="flex items-center text-sm text-white/70">
                                    <Award className="mr-1 h-3.5 w-3.5 text-white/50" />
                                    {bid.shiftDetails?.role}
                                  </div>
                                  <div className="flex items-center text-sm text-white/70">
                                    <Clock className="mr-1 h-3.5 w-3.5 text-white/50" />
                                    {bid.shiftDetails?.startTime} - {bid.shiftDetails?.endTime}
                                  </div>
                                  <div className="flex items-center col-span-2 text-sm text-white/70">
                                    <Award className="mr-1 h-3.5 w-3.5 text-white/50" />
                                    {bid.shiftDetails?.department} {bid.shiftDetails?.subDepartment ? ` - ${bid.shiftDetails.subDepartment}` : ''}
                                  </div>
                                </div>
                                <div className="mt-1 flex items-center gap-4 text-sm">
                                  <div className="text-purple-400 font-medium">
                                    Level: {bid.shiftDetails?.remunerationLevel}
                                  </div>
                                  <div className="text-white/70">
                                    Break: {bid.shiftDetails?.breakDuration}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <CollapsibleTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-white/10 min-w-[120px]"
                              >
                                <Users className="mr-2 h-4 w-4" />
                                Applicants ({applicants.length})
                                {isShiftExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          
                          <CollapsibleContent>
                            <div className="mt-4 pt-4 border-t border-white/10">
                              {applicants.length === 0 ? (
                                <p className="text-white/60 text-sm">No applicants for this shift yet.</p>
                              ) : (
                                <div className="space-y-3">
                                  {applicants.map((applicant) => (
                                    <div key={applicant.id} className="flex items-center justify-between bg-white/5 rounded p-3">
                                      <div className="flex items-center">
                                        <HoverCard>
                                          <HoverCardTrigger asChild>
                                            <div className="flex items-center cursor-pointer">
                                              <Avatar className="h-8 w-8 mr-3">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${applicant.employee?.name || 'unknown'}`} />
                                                <AvatarFallback>{applicant.employee?.name?.[0] || '?'}</AvatarFallback>
                                              </Avatar>
                                              <div>
                                                <div className="font-medium">{applicant.employee?.name || 'Unknown Employee'}</div>
                                                <div className="text-xs text-white/60">
                                                  {applicant.employee?.role || 'No role'} • {format(new Date(applicant.createdAt), 'MMM d, h:mm a')}
                                                </div>
                                              </div>
                                            </div>
                                          </HoverCardTrigger>
                                          <HoverCardContent className="w-80 bg-slate-900 border-white/10">
                                            <div className="flex justify-between space-x-4">
                                              <Avatar>
                                                <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${applicant.employee?.name || 'unknown'}`} />
                                                <AvatarFallback>{applicant.employee?.name?.[0] || '?'}</AvatarFallback>
                                              </Avatar>
                                              <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">{applicant.employee?.name || 'Unknown Employee'}</h4>
                                                <p className="text-sm text-white/70">{applicant.employee?.role || 'No role'}</p>
                                                <p className="text-sm text-white/70">{applicant.employee?.email || 'No email'}</p>
                                                <div className="flex items-center pt-2">
                                                  <CalendarCheck className="h-4 w-4 mr-2 text-green-400" />
                                                  <span className="text-xs text-white/70">Acceptance Rate: 95%</span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="mt-3">
                                              <h5 className="text-sm font-medium mb-1">Recent Activity</h5>
                                              <div className="text-xs text-white/60 space-y-1">
                                                <p>Completed 12 shifts in the last 30 days</p>
                                                <p>No-show rate: 0%</p>
                                                <p>Average rating: 4.8/5</p>
                                              </div>
                                            </div>
                                          </HoverCardContent>
                                        </HoverCard>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        {sortByScore && (
                                          <div className="px-2 py-1 bg-white/10 rounded text-xs font-medium">
                                            Score: {applicant.employee?.tier || 0}/5
                                          </div>
                                        )}
                                        
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button 
                                              variant="ghost" 
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                            >
                                              <MessageSquare className="h-4 w-4" />
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-80 bg-slate-900 border-white/10">
                                            <div className="space-y-2">
                                              <h4 className="font-medium">Notes</h4>
                                              <textarea
                                                className="w-full h-24 bg-white/5 border border-white/10 rounded p-2 text-sm"
                                                placeholder="Add notes about this applicant..."
                                                defaultValue={applicant.notes || ''}
                                                onChange={(e) => {
                                                  console.log('Notes updated:', e.target.value);
                                                }}
                                              />
                                              <Button size="sm" className="w-full">Save Notes</Button>
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                        
                                        {applicant.status === 'Pending' && (
                                          <Button 
                                            className="bg-green-600 hover:bg-green-700"
                                            size="sm"
                                            onClick={() => handleOfferShift(applicant)}
                                          >
                                            Offer Shift
                                          </Button>
                                        )}
                                        
                                        {applicant.status === 'Approved' && (
                                          <Button 
                                            variant="outline"
                                            size="sm"
                                            className="border-white/10"
                                            disabled
                                          >
                                            Offered
                                          </Button>
                                        )}
                                        
                                        {applicant.status === 'Confirmed' && (
                                          <Button 
                                            variant="outline"
                                            size="sm"
                                            className="border-white/10"
                                            disabled
                                          >
                                            Confirmed
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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
