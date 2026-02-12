import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetMedications } from '../hooks/useQueries';
import MedicationForm from '../components/medications/MedicationForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pill, Plus, Clock } from 'lucide-react';

export default function Medications() {
  const navigate = useNavigate();
  const { data: medications = [] } = useGetMedications();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const now = Date.now();
  const activeMedications = medications.filter((med) => {
    const startOk = !med.startDate || Number(med.startDate) <= now;
    const endOk = !med.endDate || Number(med.endDate) >= now;
    return startOk && endOk;
  });

  const archivedMedications = medications.filter((med) => {
    return med.endDate && Number(med.endDate) < now;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Medications</h1>
          <p className="text-muted-foreground">Manage your medication schedule and track adherence.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
            </DialogHeader>
            <MedicationForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary" />
              Active Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeMedications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">currently taking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Total Doses Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {activeMedications.reduce((sum, med) => sum + med.schedule.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">scheduled</p>
          </CardContent>
        </Card>
      </div>

      {activeMedications.length === 0 && archivedMedications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Medications Yet</h3>
            <p className="text-muted-foreground mb-4">Add your first medication to start tracking adherence.</p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Medication
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Medication</DialogTitle>
                </DialogHeader>
                <MedicationForm onSuccess={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <>
          {activeMedications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Medications</CardTitle>
                <CardDescription>Your current medication schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeMedications.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-muted/50 rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() =>
                        navigate({ to: '/medications/$medicationName', params: { medicationName: med.name } })
                      }
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{med.name}</h3>
                          <p className="text-sm text-muted-foreground">{med.dose}</p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {med.schedule.map((time, timeIdx) => (
                          <Badge key={timeIdx} variant="outline">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {archivedMedications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Archived Medications</CardTitle>
                <CardDescription>Past medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {archivedMedications.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-muted/30 rounded-lg border border-border opacity-75 cursor-pointer"
                      onClick={() =>
                        navigate({ to: '/medications/$medicationName', params: { medicationName: med.name } })
                      }
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{med.name}</h3>
                          <p className="text-sm text-muted-foreground">{med.dose}</p>
                        </div>
                        <Badge variant="outline">Archived</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
