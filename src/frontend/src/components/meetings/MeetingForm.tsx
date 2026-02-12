import { useState } from 'react';
import { useAddMeeting } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Meeting } from '../../backend';

interface MeetingFormProps {
  onSuccess?: () => void;
}

export default function MeetingForm({ onSuccess }: MeetingFormProps) {
  const addMeeting = useAddMeeting();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [format, setFormat] = useState('');
  const [notes, setNotes] = useState('');
  const [sponsorContactNotes, setSponsorContactNotes] = useState('');
  const [goals, setGoals] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !format.trim()) {
      toast.error('Please fill in date and format');
      return;
    }

    const dateTime = new Date(`${date}T${time}`);
    const meeting: Meeting = {
      date: BigInt(dateTime.getTime() * 1000000),
      format: format.trim(),
      notes: notes.trim(),
      sponsorContactNotes: sponsorContactNotes.trim(),
      goals: goals.trim(),
    };

    try {
      await addMeeting.mutateAsync(meeting);
      toast.success('Meeting logged successfully');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to log meeting');
      console.error('Add meeting error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="format">Format *</Label>
        <Input
          id="format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          placeholder="e.g., In-person, Virtual, Phone"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Meeting Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Key takeaways, insights, or reflections from the meeting"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sponsorContact">Sponsor Contact Notes (Optional)</Label>
        <Textarea
          id="sponsorContact"
          value={sponsorContactNotes}
          onChange={(e) => setSponsorContactNotes(e.target.value)}
          placeholder="Notes from sponsor conversation"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals">Goals for Next Meeting (Optional)</Label>
        <Textarea
          id="goals"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="What do you want to focus on or accomplish?"
          rows={3}
        />
      </div>

      <Button type="submit" disabled={addMeeting.isPending} className="w-full">
        {addMeeting.isPending ? 'Logging...' : 'Log Meeting'}
      </Button>
    </form>
  );
}
