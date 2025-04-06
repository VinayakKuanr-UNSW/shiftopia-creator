
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import OpenBidsPage from '@/components/management/OpenBidsPage';
import SwapRequestsContent from '@/components/management/SwapRequestsContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ManagementPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  
  // Redirect to bids if no type is specified
  if (!type) {
    return <Navigate to="/management/bids" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6">
        <Tabs defaultValue={type} className="w-full">
          <TabsList className="mb-6 bg-white/5 border border-white/10">
            <TabsTrigger 
              value="bids" 
              className="data-[state=active]:bg-white/10"
              onClick={() => window.history.pushState({}, '', '/management/bids')}
            >
              Open Bids
            </TabsTrigger>
            <TabsTrigger 
              value="swaps" 
              className="data-[state=active]:bg-white/10"
              onClick={() => window.history.pushState({}, '', '/management/swaps')}
            >
              Swap Requests
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bids">
            <OpenBidsPage />
          </TabsContent>
          
          <TabsContent value="swaps">
            <SwapRequestsContent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ManagementPage;
