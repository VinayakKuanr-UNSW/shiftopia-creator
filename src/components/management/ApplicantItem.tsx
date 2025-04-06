
import React from 'react';
import { format } from 'date-fns';
import { MessageSquare, Clock, Award, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { BidWithEmployee } from './types/bid-types';
import { generateApplicantTags } from './utils/displayUtils';

interface ApplicantItemProps {
  applicant: BidWithEmployee;
  handleOfferShift: (bid: BidWithEmployee) => void;
  isShiftFilled: boolean;
  allBids: BidWithEmployee[];
}

const ApplicantItem: React.FC<ApplicantItemProps> = ({ 
  applicant, 
  handleOfferShift,
  isShiftFilled,
  allBids
}) => {
  const tags = generateApplicantTags(applicant, allBids);
  const hasConflict = tags.some(tag => tag.text === 'Conflict');
  const offeredElsewhere = tags.some(tag => tag.text === 'Offered Elsewhere');
  
  return (
    <div className="flex items-center justify-between bg-white/5 rounded p-3">
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
                  <Clock className="h-4 w-4 mr-2 text-green-400" />
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
        {/* Tags */}
        <div className="flex gap-1">
          {tags.map((tag, index) => (
            <div 
              key={index} 
              className={`px-2 py-0.5 rounded text-xs text-white ${tag.color}`}
              title={tag.tooltip}
            >
              {tag.text}
            </div>
          ))}
        </div>
        
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
              />
              <Button size="sm" className="w-full">Save Notes</Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {applicant.status === 'Pending' && !isShiftFilled && (
          <Button 
            className={`${hasConflict ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}`}
            size="sm"
            onClick={() => handleOfferShift(applicant)}
            disabled={offeredElsewhere}
          >
            {hasConflict ? (
              <>
                <AlertTriangle className="mr-1 h-3 w-3" /> Offer With Warning
              </>
            ) : (
              'Offer Shift'
            )}
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
            className="border-green-500/30 text-green-400"
            disabled
          >
            Confirmed
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApplicantItem;
