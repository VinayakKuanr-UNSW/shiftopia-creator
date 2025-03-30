
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { TimeSlot, AvailabilityStatus } from '@/api/models/types';
import { useAvailabilities } from '@/hooks/useAvailabilities';

interface AvailabilityFormProps {
  onClose?: () => void;
}

const schema = z.object({
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  notes: z.string().optional(),
  timeSlots: z.array(
    z.object({
      startTime: z.string(),
      endTime: z.string(),
      status: z.enum(['Available', 'Unavailable', 'Partial']),
    })
  ).nonempty({ message: 'At least one time slot is required' }),
});

type FormValues = z.infer<typeof schema>;

export function AvailabilityForm({ onClose }: AvailabilityFormProps) {
  const { setAvailability, isSettingAvailability } = useAvailabilities();
  const [timeSlots, setTimeSlots] = useState<Omit<TimeSlot, 'id'>[]>([
    { startTime: '09:00', endTime: '17:00', status: 'Available' },
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      timeSlots: [
        { startTime: '09:00', endTime: '17:00', status: 'Available' },
      ],
      notes: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setAvailability({
      startDate: data.startDate,
      endDate: data.endDate,
      timeSlots: data.timeSlots,
      notes: data.notes,
    }, {
      onSuccess: () => {
        if (onClose) onClose();
      }
    });
  };

  const addTimeSlot = () => {
    const newTimeSlots = [
      ...timeSlots,
      { startTime: '09:00', endTime: '17:00', status: 'Available' },
    ];
    setTimeSlots(newTimeSlots);
    form.setValue('timeSlots', newTimeSlots);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length <= 1) return; // Keep at least one time slot
    
    const newTimeSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newTimeSlots);
    form.setValue('timeSlots', newTimeSlots);
  };

  const updateTimeSlot = (index: number, field: keyof Omit<TimeSlot, 'id'>, value: string) => {
    const newTimeSlots = [...timeSlots];
    // @ts-ignore - We know the field exists
    newTimeSlots[index][field] = field === 'status' ? value as AvailabilityStatus : value;
    setTimeSlots(newTimeSlots);
    form.setValue('timeSlots', newTimeSlots);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < form.getValues().startDate}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Time Slots</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addTimeSlot}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Time Slot
            </Button>
          </div>

          {timeSlots.map((slot, index) => (
            <div 
              key={index} 
              className="grid grid-cols-12 gap-3 items-end p-3 border border-border rounded-md bg-card/50"
            >
              <div className="col-span-3">
                <FormLabel className="text-xs">Start Time</FormLabel>
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                />
              </div>
              
              <div className="col-span-3">
                <FormLabel className="text-xs">End Time</FormLabel>
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                />
              </div>
              
              <div className="col-span-5">
                <FormLabel className="text-xs">Status</FormLabel>
                <Select
                  value={slot.status}
                  onValueChange={(value) => updateTimeSlot(index, 'status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0"
                  onClick={() => removeTimeSlot(index)}
                  disabled={timeSlots.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
          {form.formState.errors.timeSlots && (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.timeSlots.message}</p>
          )}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes about your availability..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional notes about your availability.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSettingAvailability}>
            {isSettingAvailability ? 'Saving...' : 'Save Availability'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
