import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetMedications, useGetDoseLogs, useGetCheckIns } from '../hooks/useQueries';
import { getUserSettings } from '../utils/userScopedStorage';
import { getOverdueDoses, getUpcomingDoses } from '../utils/reminders';
import DoseChecklistToday from '../components/medications/DoseChecklistToday';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Pill, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function Today() {
  const navigate = useNavigate();
  const { data: medications = [] } = useGetMedications();
  const { data: doseLogs = [] } = useGetDoseLogs();
  const { data: checkIns = [] } = useGetCheckIns();
  const [settings, setSettings] = useState(getUserSettings());

  useEffect(() => {
    const interval = setInterval(() => {
      setSettings(getUserSettings());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const activeMedications = medications.filter((med) => {
    const now = Date.now();
    const startOk = !med.startDate || Number(med.startDate) <= now;
    const endOk = !med.endDate || Number(med.endDate) >= now;
    return startOk && endOk;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = BigInt(today.getTime() * 1000000);

  const todayCheckIn = checkIns.find((ci) => {
    const ciDate = new Date(Number(ci.timestamp) / 1000000);
    ciDate.setHours(0, 0, 0, 0);
    return ciDate.getTime() === today.getTime();
  });

  const overdueDoses = getOverdueDoses(activeMedications, doseLogs, settings.reminderWindowMinutes);
  const upcomingDoses = getUpcomingDoses(activeMedications, doseLogs);

  const hasOnboarded = settings.hasCompletedOnboarding;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Today's Overview</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {!hasOnboarded && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Complete Your Setup
            </CardTitle>
            <CardDescription>
              Take a few minutes to set up your recovery goals and preferences for a personalized experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/onboarding' })}>Start Onboarding</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary" />
              Medications Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {activeMedications.reduce((sum, med) => sum + med.schedule.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">doses scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueDoses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">doses need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayCheckIn ? (
              <>
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Complete</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Great job today!</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">Pending</div>
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs mt-1"
                  onClick={() => navigate({ to: '/check-ins' })}
                >
                  Complete check-in →
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {overdueDoses.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Overdue Medications
            </CardTitle>
            <CardDescription>These doses are past their scheduled time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueDoses.map((dose, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div>
                    <p className="font-medium text-foreground">{dose.medicationName}</p>
                    <p className="text-sm text-muted-foreground">Scheduled: {dose.scheduledTime}</p>
                  </div>
                  <Badge variant="destructive">Overdue</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Today's Medication Checklist
          </CardTitle>
          <CardDescription>Mark each dose as you take it throughout the day.</CardDescription>
        </CardHeader>
        <CardContent>
          <DoseChecklistToday />
        </CardContent>
      </Card>

      {upcomingDoses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Doses
            </CardTitle>
            <CardDescription>Your next scheduled medications.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingDoses.slice(0, 3).map((dose, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{dose.medicationName}</p>
                    <p className="text-sm text-muted-foreground">{dose.scheduledTime}</p>
                  </div>
                  <Badge variant="outline">Upcoming</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
