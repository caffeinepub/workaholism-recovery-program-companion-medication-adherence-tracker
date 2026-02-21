import { useNavigate } from '@tanstack/react-router';
import { useGetCombineEntries } from '../../hooks/useCombine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, History, Share2, TrendingUp } from 'lucide-react';
import CombineTrendsPanel from '../../components/combine/CombineTrendsPanel';

function getMeasurementValue(measurement: any): number | undefined {
  if (typeof measurement === 'object' && measurement !== null && 'value' in measurement) {
    return measurement.value;
  }
  return typeof measurement === 'number' ? measurement : undefined;
}

export default function CombineDashboard() {
  const navigate = useNavigate();
  const { data: entries, isLoading } = useGetCombineEntries();

  const latestEntry = entries && entries.length > 0 ? entries[0] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Combine Dashboard</h1>
          <p className="text-muted-foreground">Track your athletic performance and progress</p>
        </div>
        <Button onClick={() => navigate({ to: '/new-entry' })} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          New Entry
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate({ to: '/new-entry' })}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5" />
              New Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Record a new combine session</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate({ to: '/history' })}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5" />
              History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {entries?.length || 0} {entries?.length === 1 ? 'entry' : 'entries'} recorded
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate({ to: '/published' })}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="h-5 w-5" />
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">View public combine results</p>
          </CardContent>
        </Card>
      </div>

      {latestEntry && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{latestEntry.athleteName}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(
                    typeof latestEntry.timestamp === 'bigint'
                      ? Number(latestEntry.timestamp) / 1_000_000
                      : latestEntry.timestamp
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {(() => {
                  const dash40 = getMeasurementValue(latestEntry.dash40yd);
                  return dash40 !== undefined ? (
                    <div>
                      <p className="text-xs text-muted-foreground">40-Yard Dash</p>
                      <p className="text-lg font-semibold">{dash40.toFixed(2)}s</p>
                    </div>
                  ) : null;
                })()}
                {(() => {
                  const vertical = 'verticalJump' in latestEntry 
                    ? getMeasurementValue(latestEntry.verticalJump)
                    : latestEntry.verticalJumpInches;
                  return vertical !== undefined ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Vertical Jump</p>
                      <p className="text-lg font-semibold">{vertical.toFixed(1)}"</p>
                    </div>
                  ) : null;
                })()}
                {(() => {
                  const bench = getMeasurementValue(latestEntry.benchPressReps);
                  return bench !== undefined ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Bench Press</p>
                      <p className="text-lg font-semibold">{bench.toFixed(0)} reps</p>
                    </div>
                  ) : null;
                })()}
                {(() => {
                  const broad = 'broadJump' in latestEntry
                    ? getMeasurementValue(latestEntry.broadJump)
                    : latestEntry.broadJumpInches;
                  return broad !== undefined ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Broad Jump</p>
                      <p className="text-lg font-semibold">{broad.toFixed(1)}"</p>
                    </div>
                  ) : null;
                })()}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() =>
                  navigate({
                    to: '/entry/$entryId',
                    params: { entryId: latestEntry.id.toString() },
                  })
                }
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <CombineTrendsPanel entries={entries || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
