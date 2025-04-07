
import React, { useState } from 'react';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format, addDays, isBefore } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PresetSelectorProps {
  onApplyPreset: (presetId: string, startDate: Date, endDate: Date) => Promise<void>;
}

export function PresetSelector({ onApplyPreset }: PresetSelectorProps) {
  const [open, setOpen] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const { toast } = useToast();

  const { availabilityPresets, cutoffDate } = useAvailabilities();
  
  const handleApply = async () => {
    if (selectedPreset && dateRange.from && dateRange.to) {
      // Check if any dates in the range are past the cutoff
      if (cutoffDate && isBefore(dateRange.from, cutoffDate)) {
        toast({
          title: "Cannot Apply Preset",
          description: "Some dates in your range are past the cutoff date and cannot be modified.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if end date is before start date
      if (dateRange.to < dateRange.from) {
        toast({
          title: "Invalid Date Range",
          description: "End date cannot be before start date.",
          variant: "destructive"
        });
        return;
      }
      
      await onApplyPreset(selectedPreset, dateRange.from, dateRange.to);
      setOpen(false);
    } else {
      if (!selectedPreset) {
        toast({
          title: "No Preset Selected",
          description: "Please select an availability preset.",
          variant: "destructive"
        });
      } else if (!dateRange.from || !dateRange.to) {
        toast({
          title: "Date Range Required",
          description: "Please select both start and end dates.",
          variant: "destructive"
        });
      }
    }
  };

  const selectedPresetName = selectedPreset 
    ? availabilityPresets.find((p) => p.id === selectedPreset)?.name || 'Select Preset'
    : 'Select Preset';

  // Ensure we have a valid array of presets
  const presets = availabilityPresets || [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Apply Preset
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[80vh] overflow-auto" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Date Range</h4>
            <div className="flex items-center justify-center pt-2">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range && range.from) {
                    setDateRange({
                      from: range.from,
                      to: range.to || range.from,
                    });
                  }
                }}
                numberOfMonths={1}
                className={cn("p-3 pointer-events-auto")}
                disabled={(date) => cutoffDate ? isBefore(date, cutoffDate) : false}
              />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Select Preset</h4>
            <Popover open={presetOpen} onOpenChange={setPresetOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={presetOpen}
                  className="w-full justify-between"
                >
                  {selectedPresetName}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                {presets.length > 0 && (
                  <Command>
                    <CommandInput placeholder="Search presets..." />
                    <CommandEmpty>No presets found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {presets.map((preset) => (
                          <CommandItem
                            key={preset.id}
                            value={preset.id}
                            onSelect={(value) => {
                              setSelectedPreset(value);
                              setPresetOpen(false);
                            }}
                          >
                            {preset.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandSeparator />
                    </CommandList>
                  </Command>
                )}
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground">
              {dateRange.from && dateRange.to ? (
                <>
                  Apply <span className="font-medium">{selectedPresetName}</span> from{' '}
                  <span className="font-medium">{format(dateRange.from, 'PP')}</span> to{' '}
                  <span className="font-medium">{format(dateRange.to, 'PP')}</span>
                </>
              ) : (
                'Please select a date range'
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleApply}
                disabled={!selectedPreset || !dateRange.from || !dateRange.to}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
