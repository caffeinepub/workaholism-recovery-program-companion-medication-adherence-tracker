import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGetMeetings } from '../../hooks/useQueries';
import { Users } from 'lucide-react';

export default function SponsorNotes() {
  const { data: meetings = [] } = useGetMeetings();

  const sponsorNotes = meetings
    .filter((m) => m.sponsorContactNotes)
    .sort((a, b) => Number(b.date - a.date));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Sponsor Contact Notes
        </CardTitle>
        <CardDescription>Notes from your sponsor interactions</CardDescription>
      </CardHeader>
      <CardContent>
        {sponsorNotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No sponsor notes yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sponsorNotes.map((meeting, idx) => {
              const date = new Date(Number(meeting.date) / 1000000);
              return (
                <div key={idx} className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    {date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-foreground whitespace-pre-wrap">{meeting.sponsorContactNotes}</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
