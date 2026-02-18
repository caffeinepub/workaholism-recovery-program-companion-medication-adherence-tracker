import { useNavigate } from '@tanstack/react-router';
import { useGetPublicCombineEntries } from '../../hooks/useCombine';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function CombinePublished() {
  const navigate = useNavigate();
  const { data: entries, isLoading } = useGetPublicCombineEntries();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Published Entries</h1>
          <p className="text-muted-foreground">Browse public combine results from all athletes</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : entries && entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card
              key={entry.id.toString()}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() =>
                navigate({
                  to: '/public/$entryId',
                  params: { entryId: entry.id.toString() },
                })
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{entry.athleteName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(Number(entry.timestamp) / 1_000_000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {entry.dash40yd && (
                    <div>
                      <p className="text-xs text-muted-foreground">40-Yard</p>
                      <p className="font-semibold">{entry.dash40yd.toFixed(2)}s</p>
                    </div>
                  )}
                  {entry.verticalJumpInches && (
                    <div>
                      <p className="text-xs text-muted-foreground">Vertical</p>
                      <p className="font-semibold">{entry.verticalJumpInches.toFixed(1)}"</p>
                    </div>
                  )}
                  {entry.benchPressReps && (
                    <div>
                      <p className="text-xs text-muted-foreground">Bench</p>
                      <p className="font-semibold">{Number(entry.benchPressReps)} reps</p>
                    </div>
                  )}
                  {entry.broadJumpInches && (
                    <div>
                      <p className="text-xs text-muted-foreground">Broad</p>
                      <p className="font-semibold">{entry.broadJumpInches.toFixed(1)}"</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No public entries yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
