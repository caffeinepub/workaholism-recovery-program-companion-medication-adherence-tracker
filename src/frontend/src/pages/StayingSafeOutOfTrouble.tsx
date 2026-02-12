import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Heart, Pause, CheckCircle } from 'lucide-react';
import CommitmentsPlanEditor from '../components/safety/CommitmentsPlanEditor';

export default function StayingSafeOutOfTrouble() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Staying Safe & Out of Trouble</h1>
        <p className="text-muted-foreground">
          Practical tools to help you pause, plan, and make thoughtful choices. This is a support tool—not a guarantee
          or prevention system.
        </p>
      </div>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Heart className="h-5 w-5" />
            In Crisis? Get Help Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you're in immediate danger or experiencing a crisis, please reach out for professional help right away.
          </p>
          <Button onClick={() => navigate({ to: '/crisis-help' })} variant="destructive" className="w-full sm:w-auto">
            <Heart className="h-4 w-4 mr-2" />
            View Crisis Resources
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pause className="h-5 w-5" />
            Pause & Plan Checklist
          </CardTitle>
          <CardDescription>
            When you're feeling overwhelmed or tempted to act impulsively, try these steps:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Stop and breathe</p>
                <p className="text-sm text-muted-foreground">
                  Take 5 deep breaths. Count to 10. Give yourself a moment before acting.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Ask yourself: What am I feeling right now?</p>
                <p className="text-sm text-muted-foreground">
                  Name the emotion. Angry? Scared? Lonely? Frustrated? Acknowledging it can help.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Think through the consequences</p>
                <p className="text-sm text-muted-foreground">
                  What might happen if I do this? How will I feel tomorrow? Is this aligned with my values?
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Reach out to someone you trust</p>
                <p className="text-sm text-muted-foreground">
                  Call a friend, sponsor, family member, or counselor. You don't have to face this alone.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Choose a safer action</p>
                <p className="text-sm text-muted-foreground">
                  Go for a walk, journal, listen to music, or do something that helps you calm down and refocus.
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grounding Techniques</CardTitle>
          <CardDescription>Quick ways to calm your mind and body when you're feeling overwhelmed:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-1">5-4-3-2-1 Technique</p>
              <p className="text-sm text-muted-foreground">
                Name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you
                taste. This brings you back to the present moment.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Box Breathing</p>
              <p className="text-sm text-muted-foreground">
                Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat several times.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Cold Water</p>
              <p className="text-sm text-muted-foreground">
                Splash cold water on your face or hold ice cubes. The physical sensation can help reset your nervous
                system.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Move Your Body</p>
              <p className="text-sm text-muted-foreground">
                Do jumping jacks, go for a walk, stretch, or dance. Physical movement can help release tension.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Personal Commitments & Boundaries</CardTitle>
          <CardDescription>
            Write down your personal commitments and boundaries. This is for your own reflection and planning—it's a
            tool to help you think through your values and goals, not a guarantee of any outcome.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CommitmentsPlanEditor />
        </CardContent>
      </Card>

      <Card className="border-muted">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>
              <strong>Important:</strong> This page provides support tools and self-reflection prompts. It does not
              provide legal advice, religious authority, or guarantees of any kind. It cannot prevent negative outcomes
              or ensure compliance with laws or religious obligations. You are responsible for your own choices and
              actions. For professional guidance, consult qualified legal, medical, or spiritual advisors.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
