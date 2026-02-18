export interface Benchmark {
  label: string;
  elite?: number;
  good?: number;
  average?: number;
  unit: string;
  lowerIsBetter?: boolean;
}

export const BENCHMARKS: Record<string, Benchmark> = {
  dash40yd: {
    label: '40-Yard Dash',
    elite: 4.4,
    good: 4.6,
    average: 4.8,
    unit: 'seconds',
    lowerIsBetter: true,
  },
  verticalJumpInches: {
    label: 'Vertical Jump',
    elite: 40,
    good: 35,
    average: 30,
    unit: 'inches',
  },
  broadJumpInches: {
    label: 'Broad Jump',
    elite: 120,
    good: 110,
    average: 100,
    unit: 'inches',
  },
  benchPressReps: {
    label: 'Bench Press (225 lbs)',
    elite: 30,
    good: 25,
    average: 20,
    unit: 'reps',
  },
  shuttle20yd: {
    label: '20-Yard Shuttle',
    elite: 4.0,
    good: 4.2,
    average: 4.4,
    unit: 'seconds',
    lowerIsBetter: true,
  },
  threeConeDrill: {
    label: '3-Cone Drill',
    elite: 6.8,
    good: 7.0,
    average: 7.3,
    unit: 'seconds',
    lowerIsBetter: true,
  },
};

export type ComparisonLevel = 'elite' | 'above-average' | 'average' | 'below-average';

export interface ComparisonResult {
  level: ComparisonLevel;
  label: string;
  description: string;
}

export function compareToBenchmark(drillKey: string, value: number): ComparisonResult | null {
  const benchmark = BENCHMARKS[drillKey];
  if (!benchmark) return null;

  const { elite, good, average, lowerIsBetter } = benchmark;

  if (lowerIsBetter) {
    if (elite && value <= elite) {
      return {
        level: 'elite',
        label: 'Elite',
        description: 'Outstanding performance at elite level',
      };
    }
    if (good && value <= good) {
      return {
        level: 'above-average',
        label: 'Above Average',
        description: 'Strong performance above typical results',
      };
    }
    if (average && value <= average) {
      return {
        level: 'average',
        label: 'Average',
        description: 'Solid performance in typical range',
      };
    }
    return {
      level: 'below-average',
      label: 'Below Average',
      description: 'Room for improvement',
    };
  } else {
    if (elite && value >= elite) {
      return {
        level: 'elite',
        label: 'Elite',
        description: 'Outstanding performance at elite level',
      };
    }
    if (good && value >= good) {
      return {
        level: 'above-average',
        label: 'Above Average',
        description: 'Strong performance above typical results',
      };
    }
    if (average && value >= average) {
      return {
        level: 'average',
        label: 'Average',
        description: 'Solid performance in typical range',
      };
    }
    return {
      level: 'below-average',
      label: 'Below Average',
      description: 'Room for improvement',
    };
  }
}
