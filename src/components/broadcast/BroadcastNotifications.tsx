
import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  user_id: string;
  broadcast_id: string;
  read: boolean;
  created_at: string;
  broadcast: {
    id: string;
    message: string;
    created_at: string;
    sender: {
      id: string;
      name: string;
    }
    group: {
      id: string;
      name: string;
    }
  }
}

export const BroadcastNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's notifications
  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('broadcast_notifications')
        .select(`
          *,
          broadcast:broadcast_id (
            id,
            message,
            created_at,
            sender:sender_id (
              id,
              name
            ),
            group:group_id (
              id,
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data ? data.filter(n => !n.read).length : 0);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('broadcast_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id || notifications.length === 0) return;
    
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);
      
      if (unreadIds.length === 0) return;
      
      const { error } = await supabase
        .from('broadcast_notifications')
        .update({ read: true })
        .in('id', unreadIds);

      if (error) throw error;
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
      
      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to mark notifications as read: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  // Subscribe to new notifications
  useEffect(() => {
    if (!user?.id) return;
    
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('broadcast_notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'broadcast_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Fetch the complete notification with related data
          const fetchNewNotification = async () => {
            try {
              const { data, error } = await supabase
                .from('broadcast_notifications')
                .select(`
                  *,
                  broadcast:broadcast_id (
                    id,
                    message,
                    created_at,
                    sender:sender_id (
                      id,
                      name
                    ),
                    group:group_id (
                      id,
                      name
                    )
                  )
                `)
                .eq('id', payload.new.id)
                .single();

              if (error) throw error;
              
              if (data) {
                setNotifications(prev => [data, ...prev].slice(0, 20));
                setUnreadCount(prev => prev + 1);
                
                // Show toast notification
                toast({
                  title: `New broadcast from ${data.broadcast.group.name}`,
                  description: data.broadcast.message.substring(0, 60) + (data.broadcast.message.length > 60 ? '...' : '')
                });
              }
            } catch (error) {
              console.error('Error fetching new notification:', error);
            }
          };
          
          fetchNewNotification();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Format notification timestamp
  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM d, h:mm a');
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${!notification.read ? 'bg-muted/50' : ''}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {notification.broadcast.group.name}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        From {notification.broadcast.sender.name} • {formatTime(notification.broadcast.created_at)}
                      </div>
                      <p className="text-sm">{notification.broadcast.message}</p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default BroadcastNotifications;
