import type { CombineResult } from '../backend';

export type SortMetric =
  | 'recent'
  | 'dash40yd'
  | 'verticalJumpInches'
  | 'benchPressReps'
  | 'broadJumpInches'
  | 'threeConeDrill'
  | 'shuttle20yd';

export function sortCombineEntries(
  entries: CombineResult[],
  sortBy: SortMetric
): CombineResult[] {
  const sorted = [...entries];

  if (sortBy === 'recent') {
    return sorted.sort((a, b) => Number(b.timestamp - a.timestamp));
  }

  // Speed drills: lower is better (ascending)
  const speedMetrics: SortMetric[] = ['dash40yd', 'threeConeDrill', 'shuttle20yd'];
  const isSpeedMetric = speedMetrics.includes(sortBy);

  // Strength/jump metrics: higher is better (descending)
  const strengthMetrics: SortMetric[] = ['verticalJumpInches', 'broadJumpInches', 'benchPressReps'];

  return sorted.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Handle undefined/null values - push to bottom
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    const aNum = typeof aValue === 'bigint' ? Number(aValue) : aValue;
    const bNum = typeof bValue === 'bigint' ? Number(bValue) : bValue;

    if (isSpeedMetric) {
      // Lower is better for speed
      return aNum - bNum;
    } else {
      // Higher is better for strength/jump
      return bNum - aNum;
    }
  });
}

export const sortOptions: { value: SortMetric; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'dash40yd', label: '40-Yard Dash' },
  { value: 'verticalJumpInches', label: 'Vertical Jump' },
  { value: 'benchPressReps', label: 'Bench Press' },
  { value: 'broadJumpInches', label: 'Broad Jump' },
  { value: 'threeConeDrill', label: '3-Cone Drill' },
  { value: 'shuttle20yd', label: '20-Yard Shuttle' },
];
