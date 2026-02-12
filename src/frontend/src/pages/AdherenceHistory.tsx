import { useGetDoseLogs, useGetMedications } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, TrendingUp } from 'lucide-react';
import type { DoseLog, Variant_Skipped_Late_Taken } from '../backend';

export default function AdherenceHistory() {
  const { data: doseLogs = [] } = useGetDoseLogs();
  const { data: medications = [] } = useGetMedications();

  const sortedLogs = [...doseLogs].sort((a, b) => Number(b.timestamp - a.timestamp));

  const groupedByDay = sortedLogs.reduce((acc, log) => {
    const date = new Date(Number(log.timestamp) / 1000000);
    const dayKey = date.toISOString().split('T')[0];
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(log);
    return acc;
  }, {} as Record<string, DoseLog[]>);

  const last7Days = sortedLogs.filter(
    (log) => Date.now() - Number(log.timestamp) / 1000000 < 7 * 24 * 60 * 60 * 1000
  );
  const last30Days = sortedLogs.filter(
    (log) => Date.now() - Number(log.timestamp) / 1000000 < 30 * 24 * 60 * 60 * 1000
  );

  const calculateAdherence = (logs: DoseLog[]) => {
    if (logs.length === 0) return 0;
    const taken = logs.filter((log) => log.status === 'Taken').length;
    return ((taken / logs.length) * 100).toFixed(0);
  };

  const adherence7 = calculateAdherence(last7Days);
  const adherence30 = calculateAdherence(last30Days);

  const getStatusBadge = (status: Variant_Skipped_Late_Taken) => {
    if (status === 'Taken') {
      return <Badge variant="default">Taken</Badge>;
    } else if (status === 'Late') {
      return <Badge variant="outline">Late</Badge>;
    } else if (status === 'Skipped') {
      return <Badge variant="outline">Skipped</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Adherence History</h1>
        <p className="text-muted-foreground">Track your medication adherence over time.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{adherence7}%</div>
            <p className="text-xs text-muted-foreground mt-1">{last7Days.length} dose(s) logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Last 30 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{adherence30}%</div>
            <p className="text-xs text-muted-foreground mt-1">{last30Days.length} dose(s) logged</p>
          </CardContent>
        </Card>
      </div>

      {Object.keys(groupedByDay).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Dose Logs Yet</h3>
            <p className="text-muted-foreground">Start logging your medication doses to track adherence.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Dose History</CardTitle>
            <CardDescription>Your medication log by day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(groupedByDay)
                .sort()
                .reverse()
                .map((dayKey) => {
                  const date = new Date(dayKey);
                  const logs = groupedByDay[dayKey];

                  return (
                    <div key={dayKey}>
                      <h3 className="font-semibold text-foreground mb-3">
                        {date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </h3>
                      <div className="space-y-2">
                        {logs.map((log, idx) => (
                          <div key={idx} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{log.medicationName}</p>
                              <p className="text-sm text-muted-foreground">Scheduled: {log.scheduledTime}</p>
                              {log.note && <p className="text-sm text-muted-foreground italic mt-1">Note: {log.note}</p>}
                            </div>
                            {getStatusBadge(log.status)}
                          </div>
                        ))}
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
