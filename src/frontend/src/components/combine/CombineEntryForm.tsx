import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { validateCombineForm, type CombineFormData } from '../../utils/combineValidation';

interface CombineEntryFormProps {
  initialData?: Partial<CombineFormData>;
  onSubmit: (data: CombineFormData) => void;
  isSubmitting?: boolean;
}

export default function CombineEntryForm({ initialData, onSubmit, isSubmitting }: CombineEntryFormProps) {
  const [formData, setFormData] = useState<CombineFormData>({
    athleteName: initialData?.athleteName || '',
    heightInches: initialData?.heightInches || '',
    weightPounds: initialData?.weightPounds || '',
    wingspanInches: initialData?.wingspanInches || '',
    handSizeInches: initialData?.handSizeInches || '',
    armLength: initialData?.armLength || '',
    dash40yd: initialData?.dash40yd || '',
    dash10yd: initialData?.dash10yd || '',
    dash20yd: initialData?.dash20yd || '',
    verticalJumpInches: initialData?.verticalJumpInches || '',
    broadJumpInches: initialData?.broadJumpInches || '',
    benchPressReps: initialData?.benchPressReps || '',
    shuttle20yd: initialData?.shuttle20yd || '',
    threeConeDrill: initialData?.threeConeDrill || '',
    shuttle60yd: initialData?.shuttle60yd || '',
    shuttleProAgility: initialData?.shuttleProAgility || '',
    bodyFatPercentage: initialData?.bodyFatPercentage || '',
    bmi: initialData?.bmi || '',
    standingReach: initialData?.standingReach || '',
    seatedRow: initialData?.seatedRow || '',
    squat: initialData?.squat || '',
    powerClean: initialData?.powerClean || '',
    note: initialData?.note || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CombineFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCombineForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Athlete Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="athleteName">Athlete Name *</Label>
            <Input
              id="athleteName"
              value={formData.athleteName}
              onChange={(e) => handleChange('athleteName', e.target.value)}
              placeholder="Enter athlete name"
            />
            {errors.athleteName && <p className="text-sm text-destructive mt-1">{errors.athleteName}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Body Measurements</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="heightInches">Height (inches)</Label>
            <Input
              id="heightInches"
              type="number"
              step="0.1"
              value={formData.heightInches}
              onChange={(e) => handleChange('heightInches', e.target.value)}
              placeholder="e.g., 72"
            />
            {errors.heightInches && <p className="text-sm text-destructive mt-1">{errors.heightInches}</p>}
          </div>
          <div>
            <Label htmlFor="weightPounds">Weight (pounds)</Label>
            <Input
              id="weightPounds"
              type="number"
              step="0.1"
              value={formData.weightPounds}
              onChange={(e) => handleChange('weightPounds', e.target.value)}
              placeholder="e.g., 200"
            />
            {errors.weightPounds && <p className="text-sm text-destructive mt-1">{errors.weightPounds}</p>}
          </div>
          <div>
            <Label htmlFor="wingspanInches">Wingspan (inches)</Label>
            <Input
              id="wingspanInches"
              type="number"
              step="0.1"
              value={formData.wingspanInches}
              onChange={(e) => handleChange('wingspanInches', e.target.value)}
              placeholder="e.g., 75"
            />
            {errors.wingspanInches && <p className="text-sm text-destructive mt-1">{errors.wingspanInches}</p>}
          </div>
          <div>
            <Label htmlFor="handSizeInches">Hand Size (inches)</Label>
            <Input
              id="handSizeInches"
              type="number"
              step="0.1"
              value={formData.handSizeInches}
              onChange={(e) => handleChange('handSizeInches', e.target.value)}
              placeholder="e.g., 9.5"
            />
            {errors.handSizeInches && <p className="text-sm text-destructive mt-1">{errors.handSizeInches}</p>}
          </div>
          <div>
            <Label htmlFor="armLength">Arm Length (inches)</Label>
            <Input
              id="armLength"
              type="number"
              step="0.1"
              value={formData.armLength}
              onChange={(e) => handleChange('armLength', e.target.value)}
              placeholder="e.g., 32"
            />
            {errors.armLength && <p className="text-sm text-destructive mt-1">{errors.armLength}</p>}
          </div>
          <div>
            <Label htmlFor="standingReach">Standing Reach (inches)</Label>
            <Input
              id="standingReach"
              type="number"
              step="0.1"
              value={formData.standingReach}
              onChange={(e) => handleChange('standingReach', e.target.value)}
              placeholder="e.g., 95"
            />
            {errors.standingReach && <p className="text-sm text-destructive mt-1">{errors.standingReach}</p>}
          </div>
          <div>
            <Label htmlFor="bodyFatPercentage">Body Fat Percentage (%)</Label>
            <Input
              id="bodyFatPercentage"
              type="number"
              step="0.1"
              value={formData.bodyFatPercentage}
              onChange={(e) => handleChange('bodyFatPercentage', e.target.value)}
              placeholder="e.g., 12.5"
            />
            {errors.bodyFatPercentage && <p className="text-sm text-destructive mt-1">{errors.bodyFatPercentage}</p>}
          </div>
          <div>
            <Label htmlFor="bmi">BMI</Label>
            <Input
              id="bmi"
              type="number"
              step="0.1"
              value={formData.bmi}
              onChange={(e) => handleChange('bmi', e.target.value)}
              placeholder="e.g., 25.3"
            />
            {errors.bmi && <p className="text-sm text-destructive mt-1">{errors.bmi}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Speed & Agility Drills</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dash40yd">40-Yard Dash (seconds)</Label>
            <Input
              id="dash40yd"
              type="number"
              step="0.01"
              value={formData.dash40yd}
              onChange={(e) => handleChange('dash40yd', e.target.value)}
              placeholder="e.g., 4.50"
            />
            {errors.dash40yd && <p className="text-sm text-destructive mt-1">{errors.dash40yd}</p>}
          </div>
          <div>
            <Label htmlFor="dash10yd">10-Yard Split (seconds)</Label>
            <Input
              id="dash10yd"
              type="number"
              step="0.01"
              value={formData.dash10yd}
              onChange={(e) => handleChange('dash10yd', e.target.value)}
              placeholder="e.g., 1.55"
            />
            {errors.dash10yd && <p className="text-sm text-destructive mt-1">{errors.dash10yd}</p>}
          </div>
          <div>
            <Label htmlFor="dash20yd">20-Yard Split (seconds)</Label>
            <Input
              id="dash20yd"
              type="number"
              step="0.01"
              value={formData.dash20yd}
              onChange={(e) => handleChange('dash20yd', e.target.value)}
              placeholder="e.g., 2.60"
            />
            {errors.dash20yd && <p className="text-sm text-destructive mt-1">{errors.dash20yd}</p>}
          </div>
          <div>
            <Label htmlFor="shuttle20yd">20-Yard Shuttle (seconds)</Label>
            <Input
              id="shuttle20yd"
              type="number"
              step="0.01"
              value={formData.shuttle20yd}
              onChange={(e) => handleChange('shuttle20yd', e.target.value)}
              placeholder="e.g., 4.20"
            />
            {errors.shuttle20yd && <p className="text-sm text-destructive mt-1">{errors.shuttle20yd}</p>}
          </div>
          <div>
            <Label htmlFor="threeConeDrill">3-Cone Drill (seconds)</Label>
            <Input
              id="threeConeDrill"
              type="number"
              step="0.01"
              value={formData.threeConeDrill}
              onChange={(e) => handleChange('threeConeDrill', e.target.value)}
              placeholder="e.g., 7.00"
            />
            {errors.threeConeDrill && <p className="text-sm text-destructive mt-1">{errors.threeConeDrill}</p>}
          </div>
          <div>
            <Label htmlFor="shuttle60yd">60-Yard Shuttle (seconds)</Label>
            <Input
              id="shuttle60yd"
              type="number"
              step="0.01"
              value={formData.shuttle60yd}
              onChange={(e) => handleChange('shuttle60yd', e.target.value)}
              placeholder="e.g., 11.50"
            />
            {errors.shuttle60yd && <p className="text-sm text-destructive mt-1">{errors.shuttle60yd}</p>}
          </div>
          <div>
            <Label htmlFor="shuttleProAgility">Pro Agility Shuttle (seconds)</Label>
            <Input
              id="shuttleProAgility"
              type="number"
              step="0.01"
              value={formData.shuttleProAgility}
              onChange={(e) => handleChange('shuttleProAgility', e.target.value)}
              placeholder="e.g., 4.10"
            />
            {errors.shuttleProAgility && <p className="text-sm text-destructive mt-1">{errors.shuttleProAgility}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Power & Explosiveness</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="verticalJumpInches">Vertical Jump (inches)</Label>
            <Input
              id="verticalJumpInches"
              type="number"
              step="0.1"
              value={formData.verticalJumpInches}
              onChange={(e) => handleChange('verticalJumpInches', e.target.value)}
              placeholder="e.g., 35"
            />
            {errors.verticalJumpInches && (
              <p className="text-sm text-destructive mt-1">{errors.verticalJumpInches}</p>
            )}
          </div>
          <div>
            <Label htmlFor="broadJumpInches">Broad Jump (inches)</Label>
            <Input
              id="broadJumpInches"
              type="number"
              step="0.1"
              value={formData.broadJumpInches}
              onChange={(e) => handleChange('broadJumpInches', e.target.value)}
              placeholder="e.g., 120"
            />
            {errors.broadJumpInches && <p className="text-sm text-destructive mt-1">{errors.broadJumpInches}</p>}
          </div>
          <div>
            <Label htmlFor="benchPressReps">Bench Press Reps (225 lbs)</Label>
            <Input
              id="benchPressReps"
              type="number"
              value={formData.benchPressReps}
              onChange={(e) => handleChange('benchPressReps', e.target.value)}
              placeholder="e.g., 25"
            />
            {errors.benchPressReps && <p className="text-sm text-destructive mt-1">{errors.benchPressReps}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strength Tests</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="seatedRow">Seated Row (pounds)</Label>
            <Input
              id="seatedRow"
              type="number"
              step="1"
              value={formData.seatedRow}
              onChange={(e) => handleChange('seatedRow', e.target.value)}
              placeholder="e.g., 250"
            />
            {errors.seatedRow && <p className="text-sm text-destructive mt-1">{errors.seatedRow}</p>}
          </div>
          <div>
            <Label htmlFor="squat">Squat (pounds)</Label>
            <Input
              id="squat"
              type="number"
              step="1"
              value={formData.squat}
              onChange={(e) => handleChange('squat', e.target.value)}
              placeholder="e.g., 400"
            />
            {errors.squat && <p className="text-sm text-destructive mt-1">{errors.squat}</p>}
          </div>
          <div>
            <Label htmlFor="powerClean">Power Clean (pounds)</Label>
            <Input
              id="powerClean"
              type="number"
              step="1"
              value={formData.powerClean}
              onChange={(e) => handleChange('powerClean', e.target.value)}
              placeholder="e.g., 300"
            />
            {errors.powerClean && <p className="text-sm text-destructive mt-1">{errors.powerClean}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="note"
            value={formData.note}
            onChange={(e) => handleChange('note', e.target.value)}
            placeholder="Add any additional notes about this session..."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Entry
        </Button>
      </div>
    </form>
  );
}
