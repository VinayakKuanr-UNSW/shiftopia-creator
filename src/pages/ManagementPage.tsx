
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Clock, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

const ManagementPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="glass-panel p-6 mb-6" style={{ animation: 'none' }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">
              {type === 'bids' ? 'Open Bids' : 'Swap Requests'}
            </h1>
            <p className="text-white/60">
              {type === 'bids' 
                ? 'Manage shift bidding process and assignments.' 
                : 'Handle and approve staff swap requests.'}
            </p>
          </div>
          
          {type === 'bids' ? <OpenBidsContent /> : <SwapRequestsContent />}
        </div>
      </main>
    </div>
  );
};

const OpenBidsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
            All Bids
          </Button>
          <Button variant="ghost" size="sm">
            Open
          </Button>
          <Button variant="ghost" size="sm">
            Assigned
          </Button>
          <Button variant="ghost" size="sm">
            Closed
          </Button>
        </div>
        
        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
          <MessageSquare className="mr-2 h-4 w-4" />
          Create New Bid
        </Button>
      </div>
      
      <div className="grid gap-4">
        {/* Sample open bids */}
        <BidCard 
          title="Weekend Convention Support" 
          department="Convention"
          date="June 12-14, 2023"
          applicants={8}
          status="open"
          deadline="May 30, 2023"
        />
        
        <BidCard 
          title="Exhibition Setup Team" 
          department="Exhibition"
          date="July 5-7, 2023"
          applicants={12}
          status="open"
          deadline="June 15, 2023"
        />
        
        <BidCard 
          title="Theatre Production Assistance" 
          department="Theatre"
          date="June 20-25, 2023"
          applicants={5}
          status="assigned"
          deadline="May 20, 2023"
        />
      </div>
    </div>
  );
};

interface BidCardProps {
  title: string;
  department: string;
  date: string;
  applicants: number;
  status: 'open' | 'assigned' | 'closed';
  deadline: string;
}

const BidCard: React.FC<BidCardProps> = ({
  title,
  department,
  date,
  applicants,
  status,
  deadline
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
      case 'open':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-900/20 text-green-400 border border-green-500/20">Open</span>;
      case 'assigned':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-900/20 text-blue-400 border border-blue-500/20">Assigned</span>;
      case 'closed':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-900/20 text-gray-400 border border-gray-500/20">Closed</span>;
    }
  };
  
  return (
    <Card className={`${getBgColor()} border`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-white/70">{department}</span>
            <span className="text-xs text-white/40">•</span>
            <span className="text-sm text-white/70">{date}</span>
          </div>
        </div>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 px-3 py-1.5 rounded-md flex items-center">
              <Users className="h-4 w-4 mr-2 text-white/60" />
              <span className="text-sm">{applicants} Applicants</span>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-md flex items-center">
              <Clock className="h-4 w-4 mr-2 text-white/60" />
              <span className="text-sm">Deadline: {deadline}</span>
            </div>
          </div>
          
          <Button size="sm" className="bg-white/10 hover:bg-white/20">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SwapRequestsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
            All Requests
          </Button>
          <Button variant="ghost" size="sm">
            Pending
          </Button>
          <Button variant="ghost" size="sm">
            Approved
          </Button>
          <Button variant="ghost" size="sm">
            Rejected
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {/* Sample swap requests */}
        <SwapCard 
          requestor={{ name: "Emma Thompson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Emma" }}
          recipient={{ name: "Michael Johnson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Michael" }}
          department="Convention"
          fromDate="June 15, 2023 (9AM-5PM)"
          toDate="June 17, 2023 (10AM-6PM)"
          status="pending"
          submittedOn="May 25, 2023"
        />
        
        <SwapCard 
          requestor={{ name: "David Wilson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=David" }}
          recipient={{ name: "Sarah Brown", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah" }}
          department="Exhibition"
          fromDate="July 8, 2023 (2PM-10PM)"
          toDate="July 10, 2023 (10AM-6PM)"
          status="approved"
          submittedOn="June 1, 2023"
        />
        
        <SwapCard 
          requestor={{ name: "Jessica Miller", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jessica" }}
          recipient={{ name: "Robert Davis", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Robert" }}
          department="Theatre"
          fromDate="June 22, 2023 (5PM-11PM)"
          toDate="June 24, 2023 (1PM-7PM)"
          status="rejected"
          submittedOn="May 20, 2023"
        />
      </div>
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
}

const SwapCard: React.FC<SwapCardProps> = ({
  requestor,
  recipient,
  department,
  fromDate,
  toDate,
  status,
  submittedOn
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
          
          {status === 'pending' && (
            <div className="flex justify-end space-x-2 mt-2">
              <Button size="sm" variant="outline" className="bg-white/5 border-white/10">
                Reject
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-green-600 to-green-700">
                Approve
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagementPage;
