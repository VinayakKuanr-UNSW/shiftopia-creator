
import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  addMonths, 
  subMonths,
  format,
  parse,
  parseISO,
  isEqual
} from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { availabilityService } from '@/api/services/availabilityService';
import { AvailabilityStatus, TimeSlot } from '@/api/models/types';

interface Availability {
  date: string;
  status: AvailabilityStatus;
  timeSlots: Array<{
    id?: string;
    startTime: string;
    endTime: string;
    status?: AvailabilityStatus;
  }>;
  notes?: string;
}

interface AvailabilityPreset {
  id: string;
  name: string;
  timeSlots: Array<{
    startTime: string;
    endTime: string;
  }>;
}

// Properly defining status colors based on availability status
const getStatusColor = (status: AvailabilityStatus): string => {
  switch (status) {
    case 'Available':
      return 'bg-green-500';
    case 'Unavailable':
      return 'bg-red-500';
    case 'Limited':
      return 'bg-yellow-500';
    case 'Tentative':
      return 'bg-blue-500';
    case 'On Leave':
      return 'bg-purple-500';
    case 'Not Specified':
    default:
      return 'bg-gray-400';
  }
};

// Make sure these presets match what's expected server-side
const availabilityPresets: AvailabilityPreset[] = [
  {
    id: 'standard',
    name: 'Standard (9-5)',
    timeSlots: [
      { startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    id: 'morning',
    name: 'Morning Shift',
    timeSlots: [
      { startTime: '07:00', endTime: '15:00' }
    ]
  },
  {
    id: 'evening',
    name: 'Evening Shift',
    timeSlots: [
      { startTime: '15:00', endTime: '23:00' }
    ]
  },
  {
    id: 'full-day',
    name: 'Full Day',
    timeSlots: [
      { startTime: '08:00', endTime: '20:00' }
    ]
  }
];

export function useAvailabilities() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [monthlyAvailabilities, setMonthlyAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Derived values from selectedMonth
  const startOfSelectedMonth = useMemo(() => startOfMonth(selectedMonth), [selectedMonth]);
  const endOfSelectedMonth = useMemo(() => endOfMonth(selectedMonth), [selectedMonth]);
  
  // Fetch availabilities for the selected month
  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        setIsLoading(true);
        const formattedStartDate = format(startOfSelectedMonth, 'yyyy-MM-dd');
        const formattedEndDate = format(endOfSelectedMonth, 'yyyy-MM-dd');
        
        // Mock data for now - replace with actual API call
        // const data = await availabilityService.getAvailabilities(formattedStartDate, formattedEndDate);
        const mockAvailabilities: Availability[] = [
          {
            date: format(new Date(), 'yyyy-MM-dd'),
            status: 'Available',
            timeSlots: [
              { id: '1', startTime: '09:00', endTime: '17:00', status: 'Available' }
            ]
          },
          {
            date: format(addMonths(new Date(), 0), 'yyyy-MM-dd'),
            status: 'Limited',
            timeSlots: [
              { id: '2', startTime: '10:00', endTime: '14:00', status: 'Limited' }
            ],
            notes: 'Only available for morning shift'
          }
        ];
        
        setMonthlyAvailabilities(mockAvailabilities);
      } catch (error) {
        console.error('Error fetching availabilities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load availability data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailabilities();
  }, [selectedMonth, toast]);
  
  // Navigation functions
  const goToPreviousMonth = useCallback(() => {
    setSelectedMonth(prev => subMonths(prev, 1));
  }, []);
  
  const goToNextMonth = useCallback(() => {
    setSelectedMonth(prev => addMonths(prev, 1));
  }, []);
  
  // Get availability for a specific date
  const getDayAvailability = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return monthlyAvailabilities.find(a => a.date === dateStr);
  }, [monthlyAvailabilities]);
  
  // Get color based on availability status
  const getDayStatusColor = useCallback((status: AvailabilityStatus) => {
    return getStatusColor(status);
  }, []);

  // Set full day available
  const setFullDayAvailable = useCallback((date: Date) => {
    return setAvailability({
      startDate: date,
      endDate: date,
      timeSlots: [
        { startTime: '09:00', endTime: '17:00', status: 'Available' }
      ],
      status: 'Available'
    });
  }, []);

  // Set full day unavailable
  const setFullDayUnavailable = useCallback((date: Date) => {
    return setAvailability({
      startDate: date,
      endDate: date,
      timeSlots: [
        { startTime: '00:00', endTime: '23:59', status: 'Unavailable' }
      ],
      status: 'Unavailable'
    });
  }, []);

  // Set or update availability
  const setAvailability = async (data: {
    startDate: Date;
    endDate: Date;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      status?: AvailabilityStatus;
    }>;
    notes?: string;
    status?: AvailabilityStatus;
  }) => {
    try {
      setIsLoading(true);
      
      // Default to Available status if not provided
      const status = data.status || 'Available';
      
      // Mock API call - replace with actual API
      // await availabilityService.setAvailability({
      //   startDate: format(data.startDate, 'yyyy-MM-dd'),
      //   endDate: format(data.endDate, 'yyyy-MM-dd'),
      //   timeSlots: data.timeSlots,
      //   notes: data.notes,
      //   status
      // });
      
      // Ensure all timeSlots have IDs and status
      const timeSlotsWithIds = data.timeSlots.map((slot, index) => ({
        id: `new-${Date.now()}-${index}`,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status || status
      }));
      
      // Update local state with new availability
      const newAvailability: Availability = {
        date: format(data.startDate, 'yyyy-MM-dd'),
        status: status,
        timeSlots: timeSlotsWithIds,
        notes: data.notes
      };
      
      setMonthlyAvailabilities(prev => {
        const exists = prev.findIndex(a => a.date === newAvailability.date);
        if (exists >= 0) {
          // Replace existing
          return [
            ...prev.slice(0, exists),
            newAvailability,
            ...prev.slice(exists + 1)
          ];
        } else {
          // Add new
          return [...prev, newAvailability];
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error setting availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to set availability',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply a preset availability pattern
  const applyPreset = async (data: {
    presetId: string;
    startDate: Date;
    endDate: Date;
  }) => {
    try {
      setIsLoading(true);
      
      const preset = availabilityPresets.find(p => p.id === data.presetId);
      if (!preset) {
        throw new Error('Preset not found');
      }
      
      // Mock API call - replace with actual API
      // await availabilityService.applyPreset(data);
      
      // For now, just return success
      return true;
    } catch (error) {
      console.error('Error applying preset:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply availability preset',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedMonth,
    startOfMonth: startOfSelectedMonth,
    endOfMonth: endOfSelectedMonth,
    monthlyAvailabilities,
    isLoading,
    goToPreviousMonth,
    goToNextMonth,
    getDayAvailability,
    getDayStatusColor,
    setAvailability,
    setFullDayAvailable,
    setFullDayUnavailable,
    applyPreset,
    availabilityPresets,
    presets: availabilityPresets // Alias for compatibility with PresetSelector
  };
}
