import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetPublicCombineEntries } from '../../hooks/useCombine';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Calendar, Trophy } from 'lucide-react';
import { sortCombineEntries, sortOptions, type SortMetric } from '../../utils/combineSorting';

export default function CombinePublished() {
  const navigate = useNavigate();
  const { data: entries, isLoading } = useGetPublicCombineEntries();
  const [sortBy, setSortBy] = useState<SortMetric>('recent');

  const sortedEntries = entries ? sortCombineEntries(entries, sortBy) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Trophy className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-muted-foreground">Browse public combine results from all athletes</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : entries && entries.length > 0 ? (
        <>
          <div className="flex items-center justify-between gap-4 bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortMetric)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {sortedEntries.length} {sortedEntries.length === 1 ? 'entry' : 'entries'}
            </div>
          </div>

          <div className="space-y-4">
            {sortedEntries.map((entry, index) => (
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
                    <div className="flex items-center gap-3">
                      {sortBy !== 'recent' && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                      )}
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
                    {entry.threeConeDrill && (
                      <div>
                        <p className="text-xs text-muted-foreground">3-Cone</p>
                        <p className="font-semibold">{entry.threeConeDrill.toFixed(2)}s</p>
                      </div>
                    )}
                    {entry.shuttle20yd && (
                      <div>
                        <p className="text-xs text-muted-foreground">Shuttle</p>
                        <p className="font-semibold">{entry.shuttle20yd.toFixed(2)}s</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No public entries yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Be the first to publish your combine results!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
