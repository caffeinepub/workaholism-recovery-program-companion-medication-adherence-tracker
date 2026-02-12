import { useState } from 'react';
import { useGetMeetings, useAddMeeting } from '../hooks/useQueries';
import MeetingForm from '../components/meetings/MeetingForm';
import SponsorNotes from '../components/meetings/SponsorNotes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Calendar } from 'lucide-react';

export default function Meetings() {
  const { data: meetings = [] } = useGetMeetings();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const sortedMeetings = [...meetings].sort((a, b) => Number(b.date - a.date));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Meetings & Support</h1>
          <p className="text-muted-foreground">Track your recovery meetings and sponsor interactions.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log Meeting</DialogTitle>
            </DialogHeader>
            <MeetingForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="meetings">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="sponsor">Sponsor Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Meeting History
              </CardTitle>
              <CardDescription>{meetings.length} meeting(s) logged</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedMeetings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No meetings logged yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedMeetings.map((meeting, idx) => {
                    const date = new Date(Number(meeting.date) / 1000000);
                    return (
                      <div key={idx}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-foreground">
                              {date.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <Badge variant="outline">{meeting.format}</Badge>
                        </div>
                        {meeting.notes && (
                          <p className="text-sm text-foreground whitespace-pre-wrap mb-2">{meeting.notes}</p>
                        )}
                        {meeting.goals && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Goals:</span> {meeting.goals}
                          </p>
                        )}
                        {meeting.sponsorContactNotes && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Sponsor Contact:</span> {meeting.sponsorContactNotes}
                          </p>
                        )}
                        {idx < sortedMeetings.length - 1 && <Separator className="mt-4" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sponsor" className="space-y-6">
          <SponsorNotes />
        </TabsContent>
      </Tabs>
    </div>
  );
}
