import CombineTrendChart from './CombineTrendChart';
import type { CombineResult } from '../../backend';
import type { GuestCombineEntry } from '../../utils/combineGuestStorage';

interface CombineTrendsPanelProps {
  entries: (CombineResult | GuestCombineEntry)[];
}

export default function CombineTrendsPanel({ entries }: CombineTrendsPanelProps) {
  const dash40Data = entries
    .filter((e) => e.dash40yd !== undefined)
    .map((e) => ({
      timestamp: typeof e.timestamp === 'bigint' ? Number(e.timestamp) / 1_000_000 : e.timestamp,
      value: e.dash40yd!,
    }));

  const verticalData = entries
    .filter((e) => e.verticalJumpInches !== undefined)
    .map((e) => ({
      timestamp: typeof e.timestamp === 'bigint' ? Number(e.timestamp) / 1_000_000 : e.timestamp,
      value: e.verticalJumpInches!,
    }));

  const benchData = entries
    .filter((e) => e.benchPressReps !== undefined)
    .map((e) => ({
      timestamp: typeof e.timestamp === 'bigint' ? Number(e.timestamp) / 1_000_000 : e.timestamp,
      value: typeof e.benchPressReps === 'bigint' ? Number(e.benchPressReps) : e.benchPressReps!,
    }));

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No entries yet. Create your first entry to see trends.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CombineTrendChart data={dash40Data} label="40-Yard Dash" unit="seconds" lowerIsBetter />
      <CombineTrendChart data={verticalData} label="Vertical Jump" unit="inches" />
      <CombineTrendChart data={benchData} label="Bench Press Reps" unit="reps" />
    </div>
  );
}
