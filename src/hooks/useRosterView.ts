
import { useState } from 'react';

export type CalendarView = 'day' | '3day' | 'week' | 'month';

export const useRosterView = () => {
  const [view, setView] = useState<CalendarView>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const viewOptions = [
    { label: 'Day', value: 'day' },
    { label: '3-Day', value: '3day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ] as const;

  return {
    view,
    setView,
    selectedDate,
    setSelectedDate,
    viewOptions,
  };
};
