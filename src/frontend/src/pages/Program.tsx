import { useNavigate } from '@tanstack/react-router';
import { useGetRecoverySteps } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Program() {
  const navigate = useNavigate();
  const { data: steps = [], isLoading } = useGetRecoverySteps();

  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-24 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Recovery Program</h1>
        <p className="text-muted-foreground">
          Work through each step at your own pace. Reflect, journal, and track your progress.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {completedCount} of {totalCount} steps completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressPercent} className="h-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{Math.round(progressPercent)}% complete</span>
            {completedCount === totalCount && totalCount > 0 && (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Program Complete!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {steps.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Steps Available</h3>
            <p className="text-muted-foreground mb-4">
              Recovery steps will appear here once they are added to your program.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {steps.map((step) => (
            <Card key={Number(step.id)} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                      <span>Step {Number(step.id)}: {step.title}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">{step.description}</CardDescription>
                  </div>
                  {step.completed && (
                    <Badge variant="default" className="shrink-0">
                      Complete
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/program/$stepId', params: { stepId: String(step.id) } })}
                >
                  {step.completed ? 'Review Step' : 'Start Step'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
