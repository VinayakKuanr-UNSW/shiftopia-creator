
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BroadcastGroups from '@/components/broadcast/BroadcastGroups';
import BroadcastForm from '@/components/broadcast/BroadcastForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BroadcastPage = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('compose');

  // Check if the user has broadcast permission
  const hasBroadcastAccess = hasPermission('broadcast');

  if (!hasBroadcastAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Unauthorized Access</CardTitle>
            <CardDescription>
              You don't have permission to access the broadcast system.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Broadcast Management</h1>
      
      <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="compose">Compose Broadcast</TabsTrigger>
          <TabsTrigger value="groups">Manage Groups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose">
          <BroadcastForm />
        </TabsContent>
        
        <TabsContent value="groups">
          <BroadcastGroups />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BroadcastPage;
