
import React from 'react';
import { RosterGroup } from '../RosterGroup';
import { Roster } from '@/api/models/types';

interface RosterDayViewProps {
  roster: Roster | null;
  isLoading: boolean;
  isOver?: boolean;
  readOnly?: boolean;
}

export const RosterDayView: React.FC<RosterDayViewProps> = ({ 
  roster, 
  isLoading, 
  isOver,
  readOnly 
}) => {
  if (!roster) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/60">No roster data available for the selected date</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {roster.groups.map((group) => (
        <RosterGroup 
          key={group.id} 
          group={group}
          readOnly={readOnly}
          isOver={isOver}
        />
      ))}
    </div>
  );
};

export default RosterDayView;
