import { useNavigate } from '@tanstack/react-router';
import { useSaveCombineEntry } from '../../hooks/useCombine';
import CombineEntryForm from '../../components/combine/CombineEntryForm';
import { parseOptionalFloat, parseOptionalInt, type CombineFormData } from '../../utils/combineValidation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CombineNewEntry() {
  const navigate = useNavigate();
  const saveMutation = useSaveCombineEntry();

  const handleSubmit = async (formData: CombineFormData) => {
    try {
      const result = await saveMutation.mutateAsync({
        athleteName: formData.athleteName.trim(),
        heightInches: parseOptionalInt(formData.heightInches),
        weightPounds: parseOptionalInt(formData.weightPounds),
        wingspanInches: parseOptionalFloat(formData.wingspanInches),
        handSizeInches: parseOptionalFloat(formData.handSizeInches),
        dash40yd: parseOptionalFloat(formData.dash40yd),
        dash10yd: parseOptionalFloat(formData.dash10yd),
        dash20yd: parseOptionalFloat(formData.dash20yd),
        verticalJumpInches: parseOptionalFloat(formData.verticalJumpInches),
        broadJumpInches: parseOptionalFloat(formData.broadJumpInches),
        benchPressReps: parseOptionalInt(formData.benchPressReps),
        shuttle20yd: parseOptionalFloat(formData.shuttle20yd),
        threeConeDrill: parseOptionalFloat(formData.threeConeDrill),
        note: formData.note,
        makePublic: false,
      });

      toast.success('Entry saved successfully!');
      navigate({
        to: '/entry/$entryId',
        params: { entryId: result.id.toString() },
      });
    } catch (error) {
      console.error('Failed to save entry:', error);
      toast.error('Failed to save entry. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Combine Entry</h1>
          <p className="text-muted-foreground">Record your latest performance stats</p>
        </div>
      </div>

      <CombineEntryForm onSubmit={handleSubmit} isSubmitting={saveMutation.isPending} />
    </div>
  );
}
