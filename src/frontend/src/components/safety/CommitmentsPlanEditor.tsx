import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useGetCommitmentsPlan, useSaveCommitmentsPlan } from '../../hooks/useQueries';

export default function CommitmentsPlanEditor() {
  const { data: savedPlan, isLoading: loadingPlan } = useGetCommitmentsPlan();
  const saveMutation = useSaveCommitmentsPlan();

  const [personalCommitments, setPersonalCommitments] = useState('');
  const [thingsToAvoid, setThingsToAvoid] = useState('');
  const [atRiskActions, setAtRiskActions] = useState('');

  useEffect(() => {
    if (savedPlan) {
      setPersonalCommitments(savedPlan.personalCommitments);
      setThingsToAvoid(savedPlan.thingsToAvoid);
      setAtRiskActions(savedPlan.atRiskActions);
    }
  }, [savedPlan]);

  const handleSave = () => {
    saveMutation.mutate({
      personalCommitments,
      thingsToAvoid,
      atRiskActions,
    });
  };

  const hasChanges =
    personalCommitments !== (savedPlan?.personalCommitments || '') ||
    thingsToAvoid !== (savedPlan?.thingsToAvoid || '') ||
    atRiskActions !== (savedPlan?.atRiskActions || '');

  if (loadingPlan) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="personalCommitments">My Personal Commitments</Label>
        <Textarea
          id="personalCommitments"
          placeholder="What values and commitments are important to me? What kind of person do I want to be?"
          value={personalCommitments}
          onChange={(e) => setPersonalCommitments(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Example: "I commit to treating others with respect, being honest, staying sober, taking care of my health..."
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thingsToAvoid">Things I Want to Avoid</Label>
        <Textarea
          id="thingsToAvoid"
          placeholder="What situations, people, or behaviors should I stay away from?"
          value={thingsToAvoid}
          onChange={(e) => setThingsToAvoid(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Example: "Avoid bars and parties, stay away from toxic relationships, don't skip my medications..."
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="atRiskActions">When I'm at Risk, I Will...</Label>
        <Textarea
          id="atRiskActions"
          placeholder="What specific actions will I take when I'm feeling tempted or at risk?"
          value={atRiskActions}
          onChange={(e) => setAtRiskActions(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Example: "Call my sponsor, go to a meeting, reach out to a trusted friend, use grounding techniques, remove
          myself from the situation..."
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={!hasChanges || saveMutation.isPending}>
          {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save My Plan
        </Button>
        {!hasChanges && savedPlan && (
          <span className="text-sm text-muted-foreground">All changes saved</span>
        )}
      </div>

      {saveMutation.isSuccess && (
        <Alert className="border-primary/50 bg-primary/5">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription>Your commitments plan has been saved successfully.</AlertDescription>
        </Alert>
      )}

      {saveMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to save your plan. Please try again. Error: {(saveMutation.error as Error)?.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
