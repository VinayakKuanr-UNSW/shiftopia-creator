
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { TimeSlot } from '@/api/models/types';
import { DayAvailability } from '@/api/models/types';

interface AvailabilityFormProps {
  selectedDate: Date;
  onSubmit: (data: { timeSlots: Omit<TimeSlot, 'id'>[]; notes?: string }) => Promise<void>;
  onCancel: () => void;
  existingAvailability?: DayAvailability;
}

export function AvailabilityForm({ selectedDate, onSubmit, onCancel, existingAvailability }: AvailabilityFormProps) {
  const [timeSlots, setTimeSlots] = useState<Omit<TimeSlot, 'id'>[]>(
    existingAvailability?.timeSlots 
      ? existingAvailability.timeSlots.map(({ startTime, endTime, status }) => ({ startTime, endTime, status }))
      : [{ startTime: '09:00', endTime: '17:00', status: 'Available' }]
  );
  
  const [notes, setNotes] = useState(existingAvailability?.notes || '');

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: '09:00', endTime: '17:00', status: 'Available' }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof Omit<TimeSlot, 'id'>, value: string) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setTimeSlots(newTimeSlots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ timeSlots, notes });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Availability</DialogTitle>
          <DialogDescription>
            Set your availability for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Time Slots</h3>
            
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-2">
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">to</span>
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select
                    value={slot.status}
                    onValueChange={(value) => updateTimeSlot(index, 'status', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Unavailable">Unavailable</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {timeSlots.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTimeSlot(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTimeSlot}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes (optional)
            </label>
            <Textarea
              id="notes"
              placeholder="Add any notes about your availability"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
