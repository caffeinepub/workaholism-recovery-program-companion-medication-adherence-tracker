export interface CombineFormData {
  athleteName: string;
  heightInches?: string;
  weightPounds?: string;
  wingspanInches?: string;
  handSizeInches?: string;
  dash40yd?: string;
  dash10yd?: string;
  dash20yd?: string;
  verticalJumpInches?: string;
  broadJumpInches?: string;
  benchPressReps?: string;
  shuttle20yd?: string;
  threeConeDrill?: string;
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
    { key: 'heightInches', label: 'Height', min: 50, max: 90 },
    { key: 'weightPounds', label: 'Weight', min: 100, max: 400 },
    { key: 'wingspanInches', label: 'Wingspan', min: 50, max: 100 },
    { key: 'handSizeInches', label: 'Hand size', min: 7, max: 13 },
    { key: 'dash40yd', label: '40-yard dash', min: 4.0, max: 7.0 },
    { key: 'dash10yd', label: '10-yard split', min: 1.0, max: 3.0 },
    { key: 'dash20yd', label: '20-yard split', min: 2.0, max: 4.0 },
    { key: 'verticalJumpInches', label: 'Vertical jump', min: 15, max: 50 },
    { key: 'broadJumpInches', label: 'Broad jump', min: 70, max: 150 },
    { key: 'benchPressReps', label: 'Bench press reps', min: 0, max: 50 },
    { key: 'shuttle20yd', label: '20-yard shuttle', min: 3.5, max: 6.0 },
    { key: 'threeConeDrill', label: '3-cone drill', min: 6.0, max: 9.0 },
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
