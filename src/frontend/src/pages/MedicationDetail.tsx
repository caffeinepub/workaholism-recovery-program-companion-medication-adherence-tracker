import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetMedications } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, FileText, User } from 'lucide-react';

export default function MedicationDetail() {
  const { medicationName } = useParams({ from: '/medications/$medicationName' });
  const navigate = useNavigate();
  const { data: medications = [] } = useGetMedications();

  const medication = medications.find((m) => m.name === medicationName);

  if (!medication) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Medication not found</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate({ to: '/medications' })}>
              Back to Medications
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const now = Date.now();
  const isActive = (!medication.startDate || Number(medication.startDate) <= now) &&
    (!medication.endDate || Number(medication.endDate) >= now);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/medications' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{medication.name}</h1>
          <p className="text-muted-foreground">{medication.dose}</p>
        </div>
        <Badge variant={isActive ? 'default' : 'outline'}>{isActive ? 'Active' : 'Archived'}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Daily Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {medication.schedule.map((time, idx) => (
              <Badge key={idx} variant="outline" className="text-base px-4 py-2">
                {time}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {medication.schedule.length} dose(s) per day
          </p>
        </CardContent>
      </Card>

      {medication.instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{medication.instructions}</p>
          </CardContent>
        </Card>
      )}

      {medication.prescriber && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Prescriber
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{medication.prescriber}</p>
          </CardContent>
        </Card>
      )}

      {(medication.startDate || medication.endDate) && (
        <Card>
          <CardHeader>
            <CardTitle>Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {medication.startDate && (
              <div>
                <span className="text-sm text-muted-foreground">Start Date: </span>
                <span className="text-foreground">
                  {new Date(Number(medication.startDate) / 1000000).toLocaleDateString()}
                </span>
              </div>
            )}
            {medication.endDate && (
              <div>
                <span className="text-sm text-muted-foreground">End Date: </span>
                <span className="text-foreground">
                  {new Date(Number(medication.endDate) / 1000000).toLocaleDateString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
