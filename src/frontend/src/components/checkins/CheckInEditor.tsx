import { useState, useEffect } from 'react';
import { useGetCheckIns, useLogCheckIn } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import type { CheckIn } from '../../backend';

export default function CheckInEditor() {
  const { data: checkIns = [] } = useGetCheckIns();
  const logCheckIn = useLogCheckIn();

  const [mood, setMood] = useState('');
  const [stressLevel, setStressLevel] = useState([5]);
  const [workHours, setWorkHours] = useState('');
  const [intention, setIntention] = useState('');
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCheckIn = checkIns.find((ci) => {
      const ciDate = new Date(Number(ci.timestamp) / 1000000);
      ciDate.setHours(0, 0, 0, 0);
      return ciDate.getTime() === today.getTime();
    });

    if (todayCheckIn) {
      setMood(todayCheckIn.mood);
      setStressLevel([Number(todayCheckIn.stressLevel)]);
      setWorkHours(String(todayCheckIn.workHours));
      setIntention(todayCheckIn.intention);
      setReflection(todayCheckIn.reflection);
    }
  }, [checkIns]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mood.trim() || !workHours) {
      toast.error('Please fill in mood and work hours');
      return;
    }

    const checkIn: CheckIn = {
      mood: mood.trim(),
      stressLevel: BigInt(stressLevel[0]),
      workHours: BigInt(parseInt(workHours) || 0),
      intention: intention.trim(),
      reflection: reflection.trim(),
      timestamp: BigInt(Date.now() * 1000000),
    };

    try {
      await logCheckIn.mutateAsync(checkIn);
      toast.success('Check-in saved successfully');
    } catch (error) {
      toast.error('Failed to save check-in');
      console.error('Check-in error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mood">How are you feeling today?</Label>
        <Input
          id="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="e.g., Calm, Anxious, Energized, Tired"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stress">Stress Level: {stressLevel[0]}/10</Label>
        <Slider
          id="stress"
          min={1}
          max={10}
          step={1}
          value={stressLevel}
          onValueChange={setStressLevel}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workHours">Work Hours Today</Label>
        <Input
          id="workHours"
          type="number"
          min="0"
          max="24"
          value={workHours}
          onChange={(e) => setWorkHours(e.target.value)}
          placeholder="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="intention">Daily Intention (Optional)</Label>
        <Input
          id="intention"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="What's your focus for today?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reflection">Reflection (Optional)</Label>
        <Textarea
          id="reflection"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="How did today go? Any insights or challenges?"
          rows={4}
        />
      </div>

      <Button type="submit" disabled={logCheckIn.isPending} className="gap-2">
        <Save className="h-4 w-4" />
        {logCheckIn.isPending ? 'Saving...' : 'Save Check-in'}
      </Button>
    </form>
  );
}
