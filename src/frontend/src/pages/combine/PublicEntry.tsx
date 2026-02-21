import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetPublicCombineEntry } from '../../hooks/useCombine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import BenchmarkComparison from '../../components/combine/BenchmarkComparison';

function getMeasurementValue(measurement: any): number | undefined {
  if (typeof measurement === 'object' && measurement !== null && 'value' in measurement) {
    return measurement.value;
  }
  return typeof measurement === 'number' ? measurement : undefined;
}

export default function CombinePublicEntry() {
  const { entryId } = useParams({ from: '/public/$entryId' });
  const navigate = useNavigate();
  const { data: entry, isLoading } = useGetPublicCombineEntry(entryId);

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  if (!entry) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Entry not found or not public</p>
        <Button onClick={() => navigate({ to: '/' })}>Go Home</Button>
      </div>
    );
  }

  const measurements = [
    { key: 'heightInches', label: 'Height', value: getMeasurementValue(entry.height), unit: 'inches' },
    { key: 'weightPounds', label: 'Weight', value: getMeasurementValue(entry.weight), unit: 'lbs' },
    { key: 'wingspanInches', label: 'Wingspan', value: getMeasurementValue(entry.wingspan), unit: 'inches' },
    { key: 'handSizeInches', label: 'Hand Size', value: getMeasurementValue(entry.handSize), unit: 'inches' },
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
    { key: 'verticalJumpInches', label: 'Vertical Jump', value: getMeasurementValue(entry.verticalJump), unit: 'inches' },
    { key: 'broadJumpInches', label: 'Broad Jump', value: getMeasurementValue(entry.broadJump), unit: 'inches' },
    { key: 'benchPressReps', label: 'Bench Press (225 lbs)', value: getMeasurementValue(entry.benchPressReps), unit: 'reps' },
  ];

  const strengthTests = [
    { key: 'seatedRow', label: 'Seated Row', value: getMeasurementValue(entry.seatedRow), unit: 'lbs' },
    { key: 'squat', label: 'Squat', value: getMeasurementValue(entry.squat), unit: 'lbs' },
    { key: 'powerClean', label: 'Power Clean', value: getMeasurementValue(entry.powerClean), unit: 'lbs' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
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
        <Button variant="outline" onClick={() => navigate({ to: '/' })} className="gap-2">
          <Home className="h-4 w-4" />
          Home
        </Button>
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
    </div>
  );
}
