
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface BroadcastGroup {
  id: string;
  name: string;
}

const BroadcastForm = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [groups, setGroups] = useState<BroadcastGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Fetch broadcast groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        
        // Fetch groups where the current user is an admin
        const { data, error } = await supabase
          .from('broadcast_group_members')
          .select(`
            group_id,
            broadcast_groups:group_id (
              id,
              name
            )
          `)
          .eq('user_id', user?.id)
          .eq('is_admin', true);

        if (error) throw error;
        
        const uniqueGroups = data
          ? Array.from(
              new Map(
                data.map(item => [
                  item.broadcast_groups.id,
                  { id: item.broadcast_groups.id, name: item.broadcast_groups.name }
                ])
              ).values()
            )
          : [];
        
        setGroups(uniqueGroups);
        if (uniqueGroups.length > 0) {
          setSelectedGroupId(uniqueGroups[0].id);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load broadcast groups: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchGroups();
    }
  }, [user?.id]);

  // Send broadcast message
  const sendBroadcast = async () => {
    if (!message.trim()) {
      toast({
        title: "Validation Error",
        description: "Message cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (!selectedGroupId) {
      toast({
        title: "Validation Error",
        description: "Please select a broadcast group",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSending(true);
      
      // Create a new broadcast
      const { data: broadcastData, error: broadcastError } = await supabase
        .from('broadcasts')
        .insert([{
          group_id: selectedGroupId,
          sender_id: user?.id,
          message: message.trim()
        }])
        .select();

      if (broadcastError) throw broadcastError;
      
      if (broadcastData && broadcastData.length > 0) {
        // Get all members of the selected group
        const { data: membersData, error: membersError } = await supabase
          .from('broadcast_group_members')
          .select('user_id')
          .eq('group_id', selectedGroupId);

        if (membersError) throw membersError;
        
        if (membersData && membersData.length > 0) {
          // Create notifications for all members
          const notifications = membersData.map(member => ({
            user_id: member.user_id,
            broadcast_id: broadcastData[0].id,
            read: false
          }));
          
          const { error: notificationsError } = await supabase
            .from('broadcast_notifications')
            .insert(notifications);

          if (notificationsError) throw notificationsError;
        }
      }
      
      toast({
        title: "Success",
        description: "Broadcast sent successfully"
      });
      
      setMessage('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to send broadcast: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Broadcast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="group" className="text-sm font-medium">
            Select Broadcast Group
          </label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : groups.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              You don't have admin access to any broadcast groups.
            </div>
          ) : (
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger id="group">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Broadcast Message
          </label>
          <Textarea
            id="message"
            placeholder="Enter your broadcast message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="resize-none"
            disabled={isLoading || groups.length === 0}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={sendBroadcast} 
          disabled={isLoading || isSending || groups.length === 0 || !message.trim()}
        >
          <Send className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Send Broadcast"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BroadcastForm;
