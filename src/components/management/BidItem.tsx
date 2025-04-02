
import React from 'react';
import { Award, Clock, ChevronUp, ChevronDown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import BidStatusBadge from './BidStatusBadge';
import BidApplicant from './BidApplicant';
import { BidWithEmployee } from './types/bid-types';

interface BidItemProps {
  bid: BidWithEmployee;
  isExpanded: boolean;
  toggleExpand: () => void;
  toggleSelect: () => void;
  isSelected: boolean;
  applicants: BidWithEmployee[];
  handleOfferShift: (bid: BidWithEmployee) => void;
  sortByScore: boolean;
}

const BidItem: React.FC<BidItemProps> = ({ 
  bid, 
  isExpanded, 
  toggleExpand,
  toggleSelect,
  isSelected,
  applicants,
  handleOfferShift,
  sortByScore
}) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={toggleExpand}>
      <div className="p-4 hover:bg-white/5 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex">
            <input
              type="checkbox"
              className="mr-3 mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              checked={isSelected}
              onChange={toggleSelect}
            />
            <div>
              <h4 className="font-medium text-white flex items-center">
                Shift ID: {bid.shiftId}
                <span className="ml-2"><BidStatusBadge status={bid.status} /></span>
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
              {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
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
                  <BidApplicant 
                    key={applicant.id}
                    applicant={applicant}
                    sortByScore={sortByScore}
                    handleOfferShift={handleOfferShift}
                  />
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default BidItem;
