import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetCombineEntry, useToggleCombinePublic, useDeleteCombineEntry } from '../../hooks/useCombine';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Trash2, Globe, Lock } from 'lucide-react';
import BenchmarkComparison from '../../components/combine/BenchmarkComparison';
import { toast } from 'sonner';
import type { CombineResult } from '../../backend';
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

function getMeasurementValue(measurement: any): number | undefined {
  if (typeof measurement === 'object' && measurement !== null && 'value' in measurement) {
    return measurement.value;
  }
  return typeof measurement === 'number' ? measurement : undefined;
}

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

  const measurements = [
    { 
      key: 'heightInches', 
      label: 'Height', 
      value: 'height' in entry ? getMeasurementValue(entry.height) : entry.heightInches, 
      unit: 'inches' 
    },
    { 
      key: 'weightPounds', 
      label: 'Weight', 
      value: 'weight' in entry ? getMeasurementValue(entry.weight) : entry.weightPounds, 
      unit: 'lbs' 
    },
    { 
      key: 'wingspanInches', 
      label: 'Wingspan', 
      value: 'wingspan' in entry ? getMeasurementValue(entry.wingspan) : entry.wingspanInches, 
      unit: 'inches' 
    },
    { 
      key: 'handSizeInches', 
      label: 'Hand Size', 
      value: 'handSize' in entry ? getMeasurementValue(entry.handSize) : entry.handSizeInches, 
      unit: 'inches' 
    },
    { key: 'armLength', label: 'Arm Length', value: getMeasurementValue(entry.armLength), unit: 'inches' },
    { key: 'standingReach', label: 'Standing Reach', value: getMeasurementValue(entry.standingReach), unit: 'inches' },
    { key: 'bodyFatPercentage', label: 'Body Fat', value: getMeasurementValue(entry.bodyFatPercentage), unit: '%' },
    { key: 'bmi', label: 'BMI', value: getMeasurementValue(entry.bmi), unit: '' },
  ];

  const speedDrills = [
    { key: 'dash40yd', label: '40-Yard Dash', value: getMeasurementValue(entry.dash40yd), unit: 'seconds' },
    { key: 'dash10yd', label: '10-Yard Split', value: getMeasurementValue(entry.dash10yd), unit: 'seconds' },
    { key: 'dash20yd', label: '20-Yard Split', value: getMeasurementValue(entry.dash20yd), unit: 'seconds' },
    { key: 'shuttle20yd', label: '20-Yard Shuttle', value: getMeasurementValue(entry.shuttle20yd), unit: 'seconds' },
    { key: 'threeConeDrill', label: '3-Cone Drill', value: getMeasurementValue(entry.threeConeDrill), unit: 'seconds' },
    { key: 'shuttle60yd', label: '60-Yard Shuttle', value: getMeasurementValue(entry.shuttle60yd), unit: 'seconds' },
    { key: 'shuttleProAgility', label: 'Pro Agility Shuttle', value: getMeasurementValue(entry.shuttleProAgility), unit: 'seconds' },
  ];

  const powerDrills = [
    { 
      key: 'verticalJumpInches', 
      label: 'Vertical Jump', 
      value: 'verticalJump' in entry ? getMeasurementValue(entry.verticalJump) : entry.verticalJumpInches, 
      unit: 'inches' 
    },
    { 
      key: 'broadJumpInches', 
      label: 'Broad Jump', 
      value: 'broadJump' in entry ? getMeasurementValue(entry.broadJump) : entry.broadJumpInches, 
      unit: 'inches' 
    },
    { key: 'benchPressReps', label: 'Bench Press (225 lbs)', value: getMeasurementValue(entry.benchPressReps), unit: 'reps' },
  ];

  const strengthTests = [
    { key: 'seatedRow', label: 'Seated Row', value: getMeasurementValue(entry.seatedRow), unit: 'lbs' },
    { key: 'squat', label: 'Squat', value: getMeasurementValue(entry.squat), unit: 'lbs' },
    { key: 'powerClean', label: 'Power Clean', value: getMeasurementValue(entry.powerClean), unit: 'lbs' },
  ];

  const note = 'developerNotes' in entry ? entry.developerNotes : ('note' in entry ? entry.note : undefined);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/history' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          {isAuthenticated && (
            <Button variant="outline" onClick={handleTogglePublic} className="gap-2">
              {isPublic ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              {isPublic ? 'Make Private' : 'Publish'}
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this entry? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{entry.athleteName}</h1>
        <p className="text-muted-foreground">
          {new Date(Number(entry.timestamp) / 1_000_000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Body Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {measurements.map(
              (measurement) =>
                measurement.value !== undefined && (
                  <div key={measurement.key}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">{measurement.label}</h4>
                    <p className="text-2xl font-bold">
                      {measurement.value.toFixed(measurement.unit === 'inches' || measurement.unit === 'lbs' ? 1 : 2)} {measurement.unit}
                    </p>
                    <BenchmarkComparison drillKey={measurement.key} value={measurement.value} />
                  </div>
                )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Speed & Agility Drills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {speedDrills.map(
              (drill) =>
                drill.value !== undefined && (
                  <div key={drill.key} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{drill.label}</h4>
                        <p className="text-2xl font-bold">
                          {drill.value.toFixed(2)} {drill.unit}
                        </p>
                      </div>
                    </div>
                    <BenchmarkComparison drillKey={drill.key} value={drill.value} />
                  </div>
                )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Power & Explosiveness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {powerDrills.map(
              (drill) =>
                drill.value !== undefined && (
                  <div key={drill.key} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{drill.label}</h4>
                        <p className="text-2xl font-bold">
                          {drill.value.toFixed(drill.unit === 'reps' ? 0 : 1)} {drill.unit}
                        </p>
                      </div>
                    </div>
                    <BenchmarkComparison drillKey={drill.key} value={drill.value} />
                  </div>
                )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strength Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {strengthTests.map(
              (test) =>
                test.value !== undefined && (
                  <div key={test.key} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{test.label}</h4>
                        <p className="text-2xl font-bold">
                          {test.value.toFixed(0)} {test.unit}
                        </p>
                      </div>
                    </div>
                    <BenchmarkComparison drillKey={test.key} value={test.value} />
                  </div>
                )
            )}
          </div>
        </CardContent>
      </Card>

      {note && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{note}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
