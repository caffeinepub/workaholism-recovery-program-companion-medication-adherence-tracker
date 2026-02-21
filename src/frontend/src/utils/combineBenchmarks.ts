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
  shuttle60yd: {
    label: '60-Yard Shuttle',
    elite: 11.0,
    good: 11.5,
    average: 12.0,
    unit: 'seconds',
    lowerIsBetter: true,
  },
  shuttleProAgility: {
    label: 'Pro Agility Shuttle',
    elite: 4.0,
    good: 4.2,
    average: 4.4,
    unit: 'seconds',
    lowerIsBetter: true,
  },
  dash10yd: {
    label: '10-Yard Split',
    elite: 1.5,
    good: 1.6,
    average: 1.7,
    unit: 'seconds',
    lowerIsBetter: true,
  },
  dash20yd: {
    label: '20-Yard Split',
    elite: 2.5,
    good: 2.6,
    average: 2.7,
    unit: 'seconds',
    lowerIsBetter: true,
  },
  heightInches: {
    label: 'Height',
    unit: 'inches',
  },
  weightPounds: {
    label: 'Weight',
    unit: 'pounds',
  },
  wingspanInches: {
    label: 'Wingspan',
    unit: 'inches',
  },
  handSizeInches: {
    label: 'Hand Size',
    elite: 10.0,
    good: 9.5,
    average: 9.0,
    unit: 'inches',
  },
  armLength: {
    label: 'Arm Length',
    unit: 'inches',
  },
  bodyFatPercentage: {
    label: 'Body Fat',
    elite: 8,
    good: 12,
    average: 15,
    unit: '%',
    lowerIsBetter: true,
  },
  bmi: {
    label: 'BMI',
    unit: '',
  },
  standingReach: {
    label: 'Standing Reach',
    unit: 'inches',
  },
  seatedRow: {
    label: 'Seated Row',
    elite: 350,
    good: 300,
    average: 250,
    unit: 'lbs',
  },
  squat: {
    label: 'Squat',
    elite: 500,
    good: 450,
    average: 400,
    unit: 'lbs',
  },
  powerClean: {
    label: 'Power Clean',
    elite: 350,
    good: 300,
    average: 250,
    unit: 'lbs',
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
  if (!benchmark || !benchmark.elite) return null;

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
