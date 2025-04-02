
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BidStatusBadgeProps {
  status: string;
}

const BidStatusBadge: React.FC<BidStatusBadgeProps> = ({ status }) => {
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

export default BidStatusBadge;
