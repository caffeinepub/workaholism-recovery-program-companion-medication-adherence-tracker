import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetRecoverySteps, useGetReflections, useSaveReflection } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle2, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { Reflection } from '../backend';

export default function ProgramStepDetail() {
  const { stepId } = useParams({ from: '/program/$stepId' });
  const navigate = useNavigate();
  const { data: steps = [] } = useGetRecoverySteps();
  const { data: reflections = [] } = useGetReflections();
  const saveReflection = useSaveReflection();

  const [newReflection, setNewReflection] = useState('');

  const step = steps.find((s) => String(s.id) === stepId);
  const stepReflections = reflections.filter((r) => String(r.stepId) === stepId);

  const handleSaveReflection = async () => {
    if (!newReflection.trim() || !step) {
      toast.error('Please write a reflection before saving');
      return;
    }

    const reflection: Reflection = {
      id: BigInt(Date.now()),
      stepId: step.id,
      content: newReflection.trim(),
      timestamp: BigInt(Date.now() * 1000000),
    };

    try {
      await saveReflection.mutateAsync(reflection);
      toast.success('Reflection saved successfully');
      setNewReflection('');
    } catch (error) {
      toast.error('Failed to save reflection');
      console.error('Save reflection error:', error);
    }
  };

  if (!step) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Step not found</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate({ to: '/program' })}>
              Back to Program
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/program' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Step {Number(step.id)}: {step.title}</h1>
        </div>
        {step.completed && (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Complete
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Step</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{step.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Reflections</CardTitle>
          <CardDescription>
            Write your thoughts, insights, and experiences as you work through this step.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reflection">New Reflection</Label>
            <Textarea
              id="reflection"
              value={newReflection}
              onChange={(e) => setNewReflection(e.target.value)}
              placeholder="What insights have you gained? What challenges are you facing? How are you applying this step?"
              rows={6}
            />
          </div>
          <Button onClick={handleSaveReflection} disabled={saveReflection.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {saveReflection.isPending ? 'Saving...' : 'Save Reflection'}
          </Button>
        </CardContent>
      </Card>

      {stepReflections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Reflections</CardTitle>
            <CardDescription>{stepReflections.length} reflection(s) saved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stepReflections
                .sort((a, b) => Number(b.timestamp - a.timestamp))
                .map((reflection) => (
                  <div key={Number(reflection.id)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(Number(reflection.timestamp) / 1000000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{reflection.content}</p>
                    <Separator className="mt-4" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
