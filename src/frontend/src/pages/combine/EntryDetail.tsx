import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetCombineEntry, useToggleCombinePublic, useDeleteCombineEntry } from '../../hooks/useCombine';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Trash2, Globe, Lock } from 'lucide-react';
import BenchmarkComparison from '../../components/combine/BenchmarkComparison';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function CombineEntryDetail() {
  const { entryId } = useParams({ from: '/entry/$entryId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: entry, isLoading } = useGetCombineEntry(entryId);
  const togglePublicMutation = useToggleCombinePublic();
  const deleteMutation = useDeleteCombineEntry();

  const isAuthenticated = !!identity;
  const isPublic = entry && 'isPublic' in entry ? entry.isPublic : false;

  const handleTogglePublic = async () => {
    if (!isAuthenticated) {
      toast.error('Sign in to publish entries');
      return;
    }
    try {
      await togglePublicMutation.mutateAsync(entryId);
      toast.success(isPublic ? 'Entry is now private' : 'Entry published successfully!');
    } catch (error) {
      console.error('Failed to toggle public state:', error);
      toast.error('Failed to update entry');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(entryId);
      toast.success('Entry deleted');
      navigate({ to: '/history' });
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const handleShare = () => {
    if (isPublic && isAuthenticated) {
      navigate({ to: '/share/$entryId', params: { entryId } });
    } else {
      navigate({ to: '/share/$entryId', params: { entryId } });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  if (!entry) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Entry not found</p>
        <Button onClick={() => navigate({ to: '/history' })}>Back to History</Button>
      </div>
    );
  }

  const drills = [
    { key: 'dash40yd', label: '40-Yard Dash', value: entry.dash40yd, unit: 'seconds' },
    { key: 'dash10yd', label: '10-Yard Split', value: entry.dash10yd, unit: 'seconds' },
    { key: 'dash20yd', label: '20-Yard Split', value: entry.dash20yd, unit: 'seconds' },
    { key: 'verticalJumpInches', label: 'Vertical Jump', value: entry.verticalJumpInches, unit: 'inches' },
    { key: 'broadJumpInches', label: 'Broad Jump', value: entry.broadJumpInches, unit: 'inches' },
    {
      key: 'benchPressReps',
      label: 'Bench Press (225 lbs)',
      value: entry.benchPressReps ? (typeof entry.benchPressReps === 'bigint' ? Number(entry.benchPressReps) : entry.benchPressReps) : undefined,
      unit: 'reps',
    },
    { key: 'shuttle20yd', label: '20-Yard Shuttle', value: entry.shuttle20yd, unit: 'seconds' },
    { key: 'threeConeDrill', label: '3-Cone Drill', value: entry.threeConeDrill, unit: 'seconds' },
  ];

  const measurements = [
    { label: 'Height', value: entry.heightInches ? `${typeof entry.heightInches === 'bigint' ? Number(entry.heightInches) : entry.heightInches}"` : undefined },
    { label: 'Weight', value: entry.weightPounds ? `${typeof entry.weightPounds === 'bigint' ? Number(entry.weightPounds) : entry.weightPounds} lbs` : undefined },
    { label: 'Wingspan', value: entry.wingspanInches ? `${entry.wingspanInches.toFixed(1)}"` : undefined },
    { label: 'Hand Size', value: entry.handSizeInches ? `${entry.handSizeInches.toFixed(1)}"` : undefined },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/history' })}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{entry.athleteName}</h1>
            <p className="text-muted-foreground">
              {new Date(
                typeof entry.timestamp === 'bigint' ? Number(entry.timestamp) / 1_000_000 : entry.timestamp
              ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleTogglePublic}
              disabled={togglePublicMutation.isPending}
              className="gap-2"
            >
              {isPublic ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              {isPublic ? 'Make Private' : 'Publish'}
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this combine entry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {measurements.some((m) => m.value) && (
        <Card>
          <CardHeader>
            <CardTitle>Measurements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {measurements.map(
                (m) =>
                  m.value && (
                    <div key={m.label}>
                      <p className="text-sm text-muted-foreground">{m.label}</p>
                      <p className="text-lg font-semibold">{m.value}</p>
                    </div>
                  )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Performance Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {drills.map(
              (drill) =>
                drill.value !== undefined && (
                  <div key={drill.key} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{drill.label}</h4>
                        <p className="text-2xl font-bold">
                          {typeof drill.value === 'number' ? drill.value.toFixed(2) : drill.value} {drill.unit}
                        </p>
                      </div>
                    </div>
                    <BenchmarkComparison drillKey={drill.key} value={typeof drill.value === 'number' ? drill.value : 0} />
                  </div>
                )
            )}
          </div>
        </CardContent>
      </Card>

      {'note' in entry && entry.note && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{entry.note}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
