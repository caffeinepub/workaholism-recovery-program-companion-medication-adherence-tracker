import { useState } from 'react';
import { useAddMedication } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Medication } from '../../backend';

interface MedicationFormProps {
  onSuccess?: () => void;
}

export default function MedicationForm({ onSuccess }: MedicationFormProps) {
  const addMedication = useAddMedication();

  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [schedule, setSchedule] = useState<string[]>(['08:00']);
  const [instructions, setInstructions] = useState('');
  const [prescriber, setPrescriber] = useState('');

  const handleAddTime = () => {
    setSchedule([...schedule, '12:00']);
  };

  const handleRemoveTime = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index] = value;
    setSchedule(newSchedule);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !dose.trim() || schedule.length === 0) {
      toast.error('Please fill in medication name, dose, and at least one time');
      return;
    }

    const medication: Medication = {
      name: name.trim(),
      dose: dose.trim(),
      schedule: schedule.filter((t) => t.trim()),
      instructions: instructions.trim(),
      prescriber: prescriber.trim(),
    };

    try {
      await addMedication.mutateAsync(medication);
      toast.success('Medication added successfully');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add medication');
      console.error('Add medication error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Medication Name *</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Sertraline" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dose">Dose *</Label>
        <Input id="dose" value={dose} onChange={(e) => setDose(e.target.value)} placeholder="e.g., 50mg" />
      </div>

      <div className="space-y-2">
        <Label>Daily Schedule *</Label>
        <div className="space-y-2">
          {schedule.map((time, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
                className="flex-1"
              />
              {schedule.length > 1 && (
                <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveTime(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleAddTime} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Time
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions (Optional)</Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g., Take with food"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prescriber">Prescriber/Clinic (Optional)</Label>
        <Input
          id="prescriber"
          value={prescriber}
          onChange={(e) => setPrescriber(e.target.value)}
          placeholder="e.g., Dr. Smith"
        />
      </div>

      <Button type="submit" disabled={addMedication.isPending} className="w-full">
        {addMedication.isPending ? 'Adding...' : 'Add Medication'}
      </Button>
    </form>
  );
}
