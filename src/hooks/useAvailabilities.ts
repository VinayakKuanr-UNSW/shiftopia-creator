
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, getYear, getMonth } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { availabilityService } from '@/api/services/availabilityService';
import { DayAvailability, TimeSlot, AvailabilityPreset, AvailabilityStatus } from '@/api/models/types';
import { useAuth } from './useAuth';

export const useAvailabilities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  // Base query key
  const getBaseQueryKey = useCallback(() => {
    if (!user) return [];
    return ['availabilities', user.id];
  }, [user]);
  
  // Monthly query key
  const getMonthlyQueryKey = useCallback(() => {
    const baseKey = getBaseQueryKey();
    const year = getYear(selectedMonth);
    const month = getMonth(selectedMonth) + 1;
    return [...baseKey, year, month];
  }, [getBaseQueryKey, selectedMonth]);
  
  // Get monthly availabilities
  const { data: monthlyAvailabilities = [], isLoading } = useQuery({
    queryKey: getMonthlyQueryKey(),
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      const year = getYear(selectedMonth);
      const month = getMonth(selectedMonth) + 1;
      return availabilityService.getMonthlyAvailabilities(user.id, year, month);
    },
    enabled: !!user
  });
  
  // Get presets
  const { data: presets = [] } = useQuery({
    queryKey: ['availabilityPresets'],
    queryFn: () => availabilityService.getPresets(),
  });
  
  // Set availability for a date range
  const setAvailabilityMutation = useMutation({
    mutationFn: async ({
      startDate,
      endDate,
      timeSlots,
      notes
    }: {
      startDate: Date;
      endDate: Date;
      timeSlots: Omit<TimeSlot, 'id'>[];
      notes?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return availabilityService.setAvailabilityRange(
        user.id,
        startDate,
        endDate,
        timeSlots,
        notes
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getBaseQueryKey() });
      toast({
        title: 'Availability updated',
        description: 'Your availability has been successfully updated.',
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating availability',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
        duration: 3000,
      });
    }
  });
  
  // Apply preset
  const applyPresetMutation = useMutation({
    mutationFn: async ({
      presetId,
      startDate,
      endDate
    }: {
      presetId: string;
      startDate: Date;
      endDate: Date;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return availabilityService.applyPreset(
        user.id,
        presetId,
        startDate,
        endDate
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getBaseQueryKey() });
      const preset = presets.find(p => p.id === variables.presetId);
      toast({
        title: 'Preset applied',
        description: `The preset "${preset?.name || 'Unknown'}" has been applied to your schedule.`,
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error applying preset',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
        duration: 3000,
      });
    }
  });
  
  // Create custom preset
  const createPresetMutation = useMutation({
    mutationFn: (preset: Omit<AvailabilityPreset, 'id'>) => {
      return availabilityService.createPreset(preset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availabilityPresets'] });
      toast({
        title: 'Preset created',
        description: 'Your custom preset has been created successfully.',
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating preset',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
        duration: 3000,
      });
    }
  });
  
  // Get day status color
  const getDayStatusColor = (status: AvailabilityStatus): string => {
    switch (status) {
      case 'Available':
      case 'available':
        return 'bg-green-500';
      case 'Partial':
      case 'partial':
      case 'preferred':
        return 'bg-yellow-400';
      case 'Unavailable':
      case 'unavailable':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  // Get availability for a specific day
  const getDayAvailability = (date: Date): DayAvailability | undefined => {
    if (!monthlyAvailabilities) return undefined;
    
    const dateKey = format(date, 'yyyy-MM-dd');
    return monthlyAvailabilities.find(a => a.date === dateKey);
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };
  
  // Helper: Set a full day as available
  const setFullDayAvailable = (date: Date) => {
    setAvailabilityMutation.mutate({
      startDate: date,
      endDate: date,
      timeSlots: [{ startTime: '00:00', endTime: '23:59', status: 'Available' }],
    });
  };
  
  // Helper: Set a full day as unavailable
  const setFullDayUnavailable = (date: Date) => {
    setAvailabilityMutation.mutate({
      startDate: date,
      endDate: date,
      timeSlots: [{ startTime: '00:00', endTime: '23:59', status: 'Unavailable' }],
    });
  };
  
  return {
    // State
    selectedMonth,
    setSelectedMonth,
    monthlyAvailabilities,
    isLoading,
    presets,
    
    // Date range
    startOfMonth: startOfMonth(selectedMonth),
    endOfMonth: endOfMonth(selectedMonth),
    
    // Actions
    setAvailability: setAvailabilityMutation.mutate,
    applyPreset: applyPresetMutation.mutate,
    createPreset: createPresetMutation.mutate,
    goToPreviousMonth,
    goToNextMonth,
    
    // Helpers
    getDayStatusColor,
    getDayAvailability,
    setFullDayAvailable,
    setFullDayUnavailable,
    
    // Loading states
    isSettingAvailability: setAvailabilityMutation.isPending,
    isApplyingPreset: applyPresetMutation.isPending,
    isCreatingPreset: createPresetMutation.isPending,
  };
};
