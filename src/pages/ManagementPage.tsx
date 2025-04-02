
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import OpenBidsPage from '@/components/management/OpenBidsPage';
import SwapRequestsContent from '@/components/management/SwapRequestsContent';

const ManagementPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  
  // Redirect to bids if no type is specified
  if (!type) {
    return <Navigate to="/management/bids" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-0">
        {type === 'bids' ? <OpenBidsPage /> : <SwapRequestsContent />}
      </main>
    </div>
  );
};

export default ManagementPage;
