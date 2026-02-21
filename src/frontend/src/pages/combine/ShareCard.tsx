import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetCombineEntry } from '../../hooks/useCombine';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function getMeasurementValue(measurement: any): number | undefined {
  if (typeof measurement === 'object' && measurement !== null && 'value' in measurement) {
    return measurement.value;
  }
  return typeof measurement === 'number' ? measurement : undefined;
}

export default function CombineShareCard() {
  const { entryId } = useParams({ from: '/share/$entryId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: entry, isLoading } = useGetCombineEntry(entryId);
  const [copied, setCopied] = useState(false);

  const isAuthenticated = !!identity;
  const isPublic = entry && 'isPublic' in entry ? entry.isPublic : false;
  const shareUrl = isPublic && isAuthenticated
    ? `${window.location.origin}/public/${entryId}`
    : `${window.location.origin}/share/${entryId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  if (!entry) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Entry not found</p>
        <Button onClick={() => navigate({ to: '/history' })}>Back to History</Button>
      </div>
    );
  }

  const drills = [
    { label: '40-Yard Dash', value: getMeasurementValue(entry.dash40yd), unit: 's' },
    { 
      label: 'Vertical Jump', 
      value: 'verticalJump' in entry ? getMeasurementValue(entry.verticalJump) : entry.verticalJumpInches, 
      unit: '"' 
    },
    { 
      label: 'Broad Jump', 
      value: 'broadJump' in entry ? getMeasurementValue(entry.broadJump) : entry.broadJumpInches, 
      unit: '"' 
    },
    {
      label: 'Bench Press',
      value: getMeasurementValue(entry.benchPressReps),
      unit: ' reps',
    },
    { label: '20-Yd Shuttle', value: getMeasurementValue(entry.shuttle20yd), unit: 's' },
    { label: '3-Cone', value: getMeasurementValue(entry.threeConeDrill), unit: 's' },
  ].filter((d) => d.value !== undefined);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/entry/$entryId', params: { entryId } })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Share Combine Card</h1>
          <p className="text-sm text-muted-foreground">
            {!isAuthenticated && 'Guest mode: Screenshot to share'}
            {isAuthenticated && !isPublic && 'Private entry: Screenshot to share'}
            {isAuthenticated && isPublic && 'Public entry: Copy link to share'}
          </p>
        </div>
      </div>

      {isAuthenticated && isPublic && (
        <div className="flex gap-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted text-sm"
          />
          <Button onClick={handleCopyLink} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      )}

      <Card className="bg-gradient-to-br from-primary/10 to-accent">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">{entry.athleteName}</h2>
            <p className="text-muted-foreground">
              {new Date(
                typeof entry.timestamp === 'bigint' ? Number(entry.timestamp) / 1_000_000 : entry.timestamp
              ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {drills.map((drill) => (
              <div key={drill.label} className="text-center">
                <p className="text-sm text-muted-foreground mb-1">{drill.label}</p>
                <p className="text-2xl font-bold">
                  {typeof drill.value === 'number' ? drill.value.toFixed(2) : drill.value}
                  {drill.unit}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">NFL Combine Tracker</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
