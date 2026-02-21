import { Badge } from '@/components/ui/badge';
import { compareToBenchmark, BENCHMARKS } from '../../utils/combineBenchmarks';

interface BenchmarkComparisonProps {
  drillKey: string;
  value: number;
}

export default function BenchmarkComparison({ drillKey, value }: BenchmarkComparisonProps) {
  const comparison = compareToBenchmark(drillKey, value);
  const benchmark = BENCHMARKS[drillKey];

  if (!comparison || !benchmark) return null;

  const variantMap = {
    elite: 'default' as const,
    'above-average': 'secondary' as const,
    average: 'outline' as const,
    'below-average': 'outline' as const,
  };

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <Badge variant={variantMap[comparison.level]}>{comparison.label}</Badge>
        <span className="text-sm text-muted-foreground">{comparison.description}</span>
      </div>
      {benchmark.elite && (
        <div className="text-xs text-muted-foreground space-y-1">
          {benchmark.elite && (
            <div>
              Elite: {benchmark.elite} {benchmark.unit}
            </div>
          )}
          {benchmark.good && (
            <div>
              Good: {benchmark.good} {benchmark.unit}
            </div>
          )}
          {benchmark.average && (
            <div>
              Average: {benchmark.average} {benchmark.unit}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
