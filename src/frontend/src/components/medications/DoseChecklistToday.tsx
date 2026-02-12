import { useState } from 'react';
import { useGetMedications, useGetDoseLogs, useLogDose } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { DoseLog, Variant_Skipped_Late_Taken } from '../../backend';

export default function DoseChecklistToday() {
  const { data: medications = [] } = useGetMedications();
  const { data: doseLogs = [] } = useGetDoseLogs();
  const logDose = useLogDose();

  const [selectedDose, setSelectedDose] = useState<{ medicationName: string; scheduledTime: string } | null>(null);
  const [note, setNote] = useState('');

  const now = Date.now();
  const activeMedications = medications.filter((med) => {
    const startOk = !med.startDate || Number(med.startDate) <= now;
    const endOk = !med.endDate || Number(med.endDate) >= now;
    return startOk && endOk;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const todayDoses = activeMedications.flatMap((med) =>
    med.schedule.map((time) => ({
      medicationName: med.name,
      scheduledTime: time,
    }))
  );

  const todayLogs = doseLogs.filter((log) => {
    const logDate = new Date(Number(log.timestamp) / 1000000);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === todayTimestamp;
  });

  const getDoseStatus = (medicationName: string, scheduledTime: string) => {
    return todayLogs.find((log) => log.medicationName === medicationName && log.scheduledTime === scheduledTime);
  };

  const getStatusText = (status: Variant_Skipped_Late_Taken): string => {
    if (status === 'Taken') return 'Taken';
    if (status === 'Late') return 'Late';
    if (status === 'Skipped') return 'Skipped';
    return 'Logged';
  };

  const handleLogDose = async (
    medicationName: string,
    scheduledTime: string,
    status: 'Taken' | 'Skipped' | 'Late'
  ) => {
    const doseLog: DoseLog = {
      medicationName,
      scheduledTime,
      status: status as Variant_Skipped_Late_Taken,
      takenTime: status === 'Taken' || status === 'Late' ? BigInt(Date.now() * 1000000) : undefined,
      note: note.trim() || undefined,
      timestamp: BigInt(Date.now() * 1000000),
    };

    try {
      await logDose.mutateAsync(doseLog);
      toast.success(`Dose marked as ${status.toLowerCase()}`);
      setSelectedDose(null);
      setNote('');
    } catch (error) {
      toast.error('Failed to log dose');
      console.error('Log dose error:', error);
    }
  };

  if (todayDoses.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No medications scheduled for today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todayDoses.map((dose, idx) => {
        const status = getDoseStatus(dose.medicationName, dose.scheduledTime);
        const isSelected =
          selectedDose?.medicationName === dose.medicationName &&
          selectedDose?.scheduledTime === dose.scheduledTime;

        return (
          <div key={idx} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{dose.medicationName}</h4>
                <p className="text-sm text-muted-foreground">{dose.scheduledTime}</p>
              </div>
              {status ? (
                <Badge
                  variant={
                    status.status === 'Taken'
                      ? 'default'
                      : 'outline'
                  }
                  className="gap-1"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {getStatusText(status.status)}
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <Circle className="h-3 w-3" />
                  Pending
                </Badge>
              )}
            </div>

            {status && status.note && (
              <p className="text-sm text-muted-foreground italic">Note: {status.note}</p>
            )}

            {!status && (
              <>
                {isSelected && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor={`note-${idx}`}>Note (Optional)</Label>
                      <Textarea
                        id={`note-${idx}`}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Any side effects or notes?"
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {!isSelected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDose(dose)}
                      className="flex-1"
                    >
                      Log Dose
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleLogDose(dose.medicationName, dose.scheduledTime, 'Taken')}
                        disabled={logDose.isPending}
                        className="flex-1"
                      >
                        Taken
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLogDose(dose.medicationName, dose.scheduledTime, 'Late')}
                        disabled={logDose.isPending}
                        className="flex-1"
                      >
                        Late
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLogDose(dose.medicationName, dose.scheduledTime, 'Skipped')}
                        disabled={logDose.isPending}
                        className="flex-1"
                      >
                        Skipped
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDose(null);
                          setNote('');
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
