
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

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

interface SwapDetailsModalProps {
  swapRequest: SwapRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void;
}

const SwapDetailsModal: React.FC<SwapDetailsModalProps> = ({ 
  swapRequest, 
  isOpen, 
  onClose,
  onStatusUpdate
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  if (!swapRequest) return null;

  const handleUpdateStatus = (status: 'approved' | 'rejected') => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onStatusUpdate(swapRequest.id, status);
      toast({
        title: `Swap request ${status}`,
        description: `The swap request has been ${status} successfully.`,
      });
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white border-white/10">
        <DialogHeader>
          <DialogTitle>Swap Request Details</DialogTitle>
          <DialogDescription className="text-white/60">
            Review the swap request details before making a decision.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start space-x-3">
              <Avatar>
                <AvatarImage src={swapRequest.requestor.avatar} />
                <AvatarFallback>{swapRequest.requestor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{swapRequest.requestor.name}</div>
                <div className="text-sm text-white/60">
                  <div>Requesting swap from</div>
                  <div className="mt-1 bg-white/10 px-3 py-1.5 rounded-md">
                    {swapRequest.fromDate}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-white/5 w-0.5 h-6"></div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Avatar>
                <AvatarImage src={swapRequest.recipient.avatar} />
                <AvatarFallback>{swapRequest.recipient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{swapRequest.recipient.name}</div>
                <div className="text-sm text-white/60">
                  <div>Swap to</div>
                  <div className="mt-1 bg-white/10 px-3 py-1.5 rounded-md">
                    {swapRequest.toDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm text-white/60">Department</p>
              <p className="font-medium">{swapRequest.department}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Status</p>
              <p className="font-medium capitalize">{swapRequest.status}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Submitted On</p>
              <p className="font-medium">{swapRequest.submittedOn}</p>
            </div>
          </div>
          
          {swapRequest.reason && (
            <div>
              <p className="text-sm text-white/60">Reason</p>
              <p className="p-3 bg-white/5 rounded mt-1">{swapRequest.reason}</p>
            </div>
          )}
        </div>
        
        {swapRequest.status === 'pending' && (
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              className="border-white/10 hover:bg-white/10"
              onClick={() => handleUpdateStatus('rejected')}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-green-700"
              onClick={() => handleUpdateStatus('approved')}
              disabled={isLoading}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SwapDetailsModal;
