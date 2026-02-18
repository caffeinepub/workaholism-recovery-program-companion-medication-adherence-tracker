import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetPublicCombineEntry } from '../../hooks/useCombine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import BenchmarkComparison from '../../components/combine/BenchmarkComparison';

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

  const drills = [
    { key: 'dash40yd', label: '40-Yard Dash', value: entry.dash40yd, unit: 'seconds' },
    { key: 'verticalJumpInches', label: 'Vertical Jump', value: entry.verticalJumpInches, unit: 'inches' },
    { key: 'broadJumpInches', label: 'Broad Jump', value: entry.broadJumpInches, unit: 'inches' },
    {
      key: 'benchPressReps',
      label: 'Bench Press (225 lbs)',
      value: entry.benchPressReps ? Number(entry.benchPressReps) : undefined,
      unit: 'reps',
    },
    { key: 'shuttle20yd', label: '20-Yard Shuttle', value: entry.shuttle20yd, unit: 'seconds' },
    { key: 'threeConeDrill', label: '3-Cone Drill', value: entry.threeConeDrill, unit: 'seconds' },
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
    </div>
  );
}
