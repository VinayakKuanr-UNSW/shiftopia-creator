
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
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
import { cn } from '@/lib/utils';
import { AvailabilityPreset } from '@/api/models/types';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PresetSelectorProps {
  onClose?: () => void;
}

const schema = z.object({
  presetId: z.string({ required_error: 'Please select a preset' }),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
});

type FormValues = z.infer<typeof schema>;

export function PresetSelector({ onClose }: PresetSelectorProps) {
  const { presets, applyPreset, isApplyingPreset } = useAvailabilities();
  const [selectedPreset, setSelectedPreset] = useState<AvailabilityPreset | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const onSubmit = (data: FormValues) => {
    applyPreset({
      presetId: data.presetId,
      startDate: data.startDate,
      endDate: data.endDate,
    }, {
      onSuccess: () => {
        if (onClose) onClose();
      }
    });
  };

  const handlePresetSelect = (id: string) => {
    const preset = presets.find(p => p.id === id);
    setSelectedPreset(preset || null);
    form.setValue('presetId', id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="presetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Preset</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {presets.map((preset) => (
                    <Card 
                      key={preset.id}
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        preset.id === field.value 
                          ? "border-primary" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => handlePresetSelect(preset.id)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{preset.name}</CardTitle>
                          {preset.id === field.value && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <CardDescription className="text-xs">
                          {preset.type === 'weekdays' 
                            ? 'Monday to Friday' 
                            : preset.type === 'weekends'
                              ? 'Saturday & Sunday'
                              : 'Custom schedule'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-xs text-muted-foreground">
                          {preset.timeSlots.map((slot, idx) => (
                            <div key={idx} className="flex items-center mt-1">
                              <div 
                                className={cn(
                                  "w-2 h-2 rounded-full mr-1",
                                  slot.status === 'Available' 
                                    ? "bg-green-500" 
                                    : slot.status === 'Partial'
                                      ? "bg-yellow-400"
                                      : "bg-red-500"
                                )}
                              />
                              <span>
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        <div className="flex justify-end space-x-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isApplyingPreset || !form.getValues().presetId}
          >
            {isApplyingPreset ? 'Applying...' : 'Apply Preset'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
