import { useState } from 'react';
import { useGetCheckIns, useLogCheckIn } from '../hooks/useQueries';
import CheckInEditor from '../components/checkins/CheckInEditor';
import CheckInTrends from '../components/checkins/CheckInTrends';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, TrendingUp } from 'lucide-react';

export default function CheckIns() {
  const { data: checkIns = [] } = useGetCheckIns();
  const [activeTab, setActiveTab] = useState('today');

  const sortedCheckIns = [...checkIns].sort((a, b) => Number(b.timestamp - a.timestamp));

  const groupedByMonth = sortedCheckIns.reduce((acc, checkIn) => {
    const date = new Date(Number(checkIn.timestamp) / 1000000);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(checkIn);
    return acc;
  }, {} as Record<string, typeof checkIns>);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Daily Check-ins</h1>
        <p className="text-muted-foreground">
          Track your daily mood, stress levels, work hours, and reflections to monitor your recovery progress.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Check-in
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CheckInEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {Object.keys(groupedByMonth).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Check-ins Yet</h3>
                <p className="text-muted-foreground">Start tracking your daily progress by completing your first check-in.</p>
              </CardContent>
            </Card>
          ) : (
            Object.keys(groupedByMonth)
              .sort()
              .reverse()
              .map((monthKey) => {
                const [year, month] = monthKey.split('-');
                const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                });

                return (
                  <Card key={monthKey}>
                    <CardHeader>
                      <CardTitle>{monthName}</CardTitle>
                      <CardDescription>{groupedByMonth[monthKey].length} check-in(s)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {groupedByMonth[monthKey].map((checkIn, idx) => {
                          const date = new Date(Number(checkIn.timestamp) / 1000000);
                          return (
                            <div key={idx}>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-medium text-foreground">
                                    {date.toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant="outline">Mood: {checkIn.mood}</Badge>
                                  <Badge variant="outline">Stress: {Number(checkIn.stressLevel)}/10</Badge>
                                  <Badge variant="outline">{Number(checkIn.workHours)}h work</Badge>
                                </div>
                              </div>
                              {checkIn.intention && (
                                <p className="text-sm text-muted-foreground mb-1">
                                  <span className="font-medium">Intention:</span> {checkIn.intention}
                                </p>
                              )}
                              {checkIn.reflection && (
                                <p className="text-sm text-foreground whitespace-pre-wrap">{checkIn.reflection}</p>
                              )}
                              {idx < groupedByMonth[monthKey].length - 1 && <Separator className="mt-4" />}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Trends
              </CardTitle>
              <CardDescription>Insights from your check-in history</CardDescription>
            </CardHeader>
            <CardContent>
              <CheckInTrends checkIns={checkIns} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
