
import React from 'react';
import { Roster } from '@/api/models/types';
import RosterGroup from "../RosterGroup";

export interface RosterDayViewProps {
  date: Date;
  roster: Roster | null;
  readOnly?: boolean;
  onAddGroup?: (name: string, color: string) => void;
}

export const RosterDayView: React.FC<RosterDayViewProps> = ({ 
  date, 
  roster, 
  readOnly = false,
  onAddGroup
}) => {
  return (
    <div className="space-y-6">
      {roster && roster.groups.map(group => (
        <RosterGroup 
          key={group.id} 
          group={group}
          readOnly={readOnly}
        />
      ))}
      
      {!roster && (
        <div className="text-center py-10 text-white/60">
          No roster found for this date. Click "Apply Template" to create one.
        </div>
      )}
    </div>
  );
};

export default RosterDayView;
