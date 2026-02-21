import CombineTrendChart from './CombineTrendChart';
import type { CombineResult } from '../../backend';
import type { GuestCombineEntry } from '../../utils/combineGuestStorage';

interface CombineTrendsPanelProps {
  entries: (CombineResult | GuestCombineEntry)[];
}

function getMeasurementValue(measurement: any): number | undefined {
  if (typeof measurement === 'object' && measurement !== null && 'value' in measurement) {
    return measurement.value;
  }
  return typeof measurement === 'number' ? measurement : undefined;
}

export default function CombineTrendsPanel({ entries }: CombineTrendsPanelProps) {
  const dash40Data = entries
    .map((e) => ({
      timestamp: typeof e.timestamp === 'bigint' ? Number(e.timestamp) / 1_000_000 : e.timestamp,
      value: getMeasurementValue(e.dash40yd),
    }))
    .filter((d) => d.value !== undefined)
    .map((d) => ({ timestamp: d.timestamp, value: d.value! }));

  const verticalData = entries
    .map((e) => {
      const value = 'verticalJump' in e ? getMeasurementValue(e.verticalJump) : e.verticalJumpInches;
      return {
        timestamp: typeof e.timestamp === 'bigint' ? Number(e.timestamp) / 1_000_000 : e.timestamp,
        value,
      };
    })
    .filter((d) => d.value !== undefined)
    .map((d) => ({ timestamp: d.timestamp, value: d.value! }));

  const benchData = entries
    .map((e) => ({
      timestamp: typeof e.timestamp === 'bigint' ? Number(e.timestamp) / 1_000_000 : e.timestamp,
      value: getMeasurementValue(e.benchPressReps),
    }))
    .filter((d) => d.value !== undefined)
    .map((d) => ({ timestamp: d.timestamp, value: d.value! }));

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
