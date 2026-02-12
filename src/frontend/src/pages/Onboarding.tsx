import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getUserSettings, saveUserSettings } from '../utils/userScopedStorage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [goals, setGoals] = useState('');
  const [typicalWorkHours, setTypicalWorkHours] = useState('');
  const [preferredCheckInTime, setPreferredCheckInTime] = useState('20:00');

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const settings = getUserSettings();
    saveUserSettings({
      ...settings,
      hasCompletedOnboarding: true,
      recoveryGoals: goals.trim(),
      typicalWorkHours: parseInt(typicalWorkHours) || 8,
      preferredCheckInTime: preferredCheckInTime,
    });
    toast.success('Onboarding complete! Welcome to Recovery Companion.');
    navigate({ to: '/today' });
  };

  const handleSkip = () => {
    const settings = getUserSettings();
    saveUserSettings({
      ...settings,
      hasCompletedOnboarding: true,
    });
    navigate({ to: '/today' });
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Recovery Companion</h1>
        <p className="text-muted-foreground">Let's set up your personalized recovery experience.</p>
      </div>

      <Card>
        <CardHeader>
          <Progress value={progress} className="h-2 mb-4" />
          <CardTitle>
            Step {step} of {totalSteps}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Your Recovery Goals</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  What do you hope to achieve through this recovery program?
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">Recovery Goals (Optional)</Label>
                <Textarea
                  id="goals"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g., Better work-life balance, reduced stress, healthier relationships..."
                  rows={5}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Work Patterns</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Help us understand your typical work schedule.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workHours">Typical Work Hours Per Day (Optional)</Label>
                <Input
                  id="workHours"
                  type="number"
                  min="0"
                  max="24"
                  value={typicalWorkHours}
                  onChange={(e) => setTypicalWorkHours(e.target.value)}
                  placeholder="8"
                />
                <p className="text-xs text-muted-foreground">
                  This helps us track when you're working more or less than usual.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Daily Check-in Preference</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  When would you like to be reminded to complete your daily check-in?
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkInTime">Preferred Check-in Time (Optional)</Label>
                <Input
                  id="checkInTime"
                  type="time"
                  value={preferredCheckInTime}
                  onChange={(e) => setPreferredCheckInTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We recommend completing check-ins in the evening to reflect on your day.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={handleSkip}>
              Skip Setup
            </Button>
            <div className="flex gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleComplete}>Complete Setup</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <img
          src="/assets/generated/recovery-hero.dim_1600x900.png"
          alt="Recovery journey"
          className="w-full max-w-md mx-auto rounded-lg opacity-50"
        />
      </div>
    </div>
  );
}
