import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { CheckIn } from '../../backend';

interface CheckInTrendsProps {
  checkIns: CheckIn[];
}

export default function CheckInTrends({ checkIns }: CheckInTrendsProps) {
  const now = Date.now();
  const last7Days = checkIns.filter((ci) => now - Number(ci.timestamp) / 1000000 < 7 * 24 * 60 * 60 * 1000);
  const last30Days = checkIns.filter((ci) => now - Number(ci.timestamp) / 1000000 < 30 * 24 * 60 * 60 * 1000);

  const calculateAverage = (items: CheckIn[], field: 'stressLevel' | 'workHours'): string => {
    if (items.length === 0) return '0';
    const sum = items.reduce((acc, item) => acc + Number(item[field]), 0);
    return (sum / items.length).toFixed(1);
  };

  const avgStress7 = calculateAverage(last7Days, 'stressLevel');
  const avgStress30 = calculateAverage(last30Days, 'stressLevel');
  const avgWork7 = calculateAverage(last7Days, 'workHours');
  const avgWork30 = calculateAverage(last30Days, 'workHours');

  const getTrendIcon = (current: number, previous: number) => {
    if (current < previous) return <TrendingDown className="h-4 w-4 text-primary" />;
    if (current > previous) return <TrendingUp className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const completionRate7 = last7Days.length >= 7 ? ((last7Days.length / 7) * 100).toFixed(0) : 'N/A';
  const completionRate30 = last30Days.length >= 30 ? ((last30Days.length / 30) * 100).toFixed(0) : 'N/A';

  if (checkIns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Complete a few check-ins to see your trends.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Avg Stress (Last 7 Days)</h3>
              {last7Days.length >= 2 && getTrendIcon(parseFloat(avgStress7), parseFloat(avgStress30))}
            </div>
            <p className="text-3xl font-bold text-foreground">{avgStress7}/10</p>
            <p className="text-xs text-muted-foreground mt-1">{last7Days.length} check-in(s)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Avg Work Hours (Last 7 Days)</h3>
              {last7Days.length >= 2 && getTrendIcon(parseFloat(avgWork7), parseFloat(avgWork30))}
            </div>
            <p className="text-3xl font-bold text-foreground">{avgWork7}h</p>
            <p className="text-xs text-muted-foreground mt-1">{last7Days.length} check-in(s)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Avg Stress (Last 30 Days)</h3>
            <p className="text-3xl font-bold text-foreground">{avgStress30}/10</p>
            <p className="text-xs text-muted-foreground mt-1">{last30Days.length} check-in(s)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Avg Work Hours (Last 30 Days)</h3>
            <p className="text-3xl font-bold text-foreground">{avgWork30}h</p>
            <p className="text-xs text-muted-foreground mt-1">{last30Days.length} check-in(s)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Check-in Completion Rate</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-2xl font-bold text-foreground">{completionRate7}%</p>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completionRate30}%</p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
