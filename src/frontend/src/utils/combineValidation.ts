export interface CombineFormData {
  athleteName: string;
  heightInches?: string;
  weightPounds?: string;
  wingspanInches?: string;
  handSizeInches?: string;
  armLength?: string;
  dash40yd?: string;
  dash10yd?: string;
  dash20yd?: string;
  verticalJumpInches?: string;
  broadJumpInches?: string;
  benchPressReps?: string;
  shuttle20yd?: string;
  threeConeDrill?: string;
  shuttle60yd?: string;
  shuttleProAgility?: string;
  bodyFatPercentage?: string;
  bmi?: string;
  standingReach?: string;
  seatedRow?: string;
  squat?: string;
  powerClean?: string;
  note?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateCombineForm(data: CombineFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.athleteName || data.athleteName.trim().length === 0) {
    errors.athleteName = 'Athlete name is required';
  }

  const numericFields = [
    { key: 'heightInches', label: 'Height', min: 60, max: 90 },
    { key: 'weightPounds', label: 'Weight', min: 150, max: 400 },
    { key: 'wingspanInches', label: 'Wingspan', min: 65, max: 90 },
    { key: 'handSizeInches', label: 'Hand size', min: 7, max: 12 },
    { key: 'armLength', label: 'Arm length', min: 28, max: 38 },
    { key: 'dash40yd', label: '40-yard dash', min: 3.5, max: 7.0 },
    { key: 'dash10yd', label: '10-yard split', min: 1.0, max: 3.0 },
    { key: 'dash20yd', label: '20-yard split', min: 2.0, max: 4.0 },
    { key: 'verticalJumpInches', label: 'Vertical jump', min: 15, max: 50 },
    { key: 'broadJumpInches', label: 'Broad jump', min: 60, max: 150 },
    { key: 'benchPressReps', label: 'Bench press reps', min: 0, max: 50 },
    { key: 'shuttle20yd', label: '20-yard shuttle', min: 3.5, max: 6.0 },
    { key: 'threeConeDrill', label: '3-cone drill', min: 6.0, max: 9.0 },
    { key: 'shuttle60yd', label: '60-yard shuttle', min: 10.0, max: 14.0 },
    { key: 'shuttleProAgility', label: 'Pro agility shuttle', min: 3.5, max: 6.0 },
    { key: 'bodyFatPercentage', label: 'Body fat percentage', min: 3, max: 40 },
    { key: 'bmi', label: 'BMI', min: 18, max: 40 },
    { key: 'standingReach', label: 'Standing reach', min: 70, max: 110 },
    { key: 'seatedRow', label: 'Seated row', min: 100, max: 500 },
    { key: 'squat', label: 'Squat', min: 200, max: 800 },
    { key: 'powerClean', label: 'Power clean', min: 150, max: 500 },
  ];

  for (const field of numericFields) {
    const value = data[field.key as keyof CombineFormData];
    if (value && value.trim().length > 0) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        errors[field.key] = `${field.label} must be a valid number`;
      } else if (num < field.min || num > field.max) {
        errors[field.key] = `${field.label} must be between ${field.min} and ${field.max}`;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function parseOptionalFloat(value?: string): number | undefined {
  if (!value || value.trim().length === 0) return undefined;
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
}

export function parseOptionalInt(value?: string): number | undefined {
  if (!value || value.trim().length === 0) return undefined;
  const num = parseInt(value, 10);
  return isNaN(num) ? undefined : num;
}
