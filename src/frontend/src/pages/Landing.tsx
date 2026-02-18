import LoginButton from '../components/auth/LoginButton';
import { useNavigate } from '@tanstack/react-router';
import { Activity, TrendingUp, Share2, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Activity,
      title: 'Track Performance',
      description: 'Record all official NFL Combine drills including 40-yard dash, vertical jump, bench press, and more.',
    },
    {
      icon: TrendingUp,
      title: 'Monitor Progress',
      description: 'View your improvement over time with detailed charts and trend analysis for each drill.',
    },
    {
      icon: Trophy,
      title: 'Compare Benchmarks',
      description: 'See how your stats compare to NFL Combine averages and elite athlete performance.',
    },
    {
      icon: Share2,
      title: 'Share Results',
      description: 'Publish your best performances and share them with coaches, scouts, or friends.',
    },
  ];

  const handleContinueAsGuest = () => {
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/combine-logo.dim_512x512.png"
                alt="NFL Combine Tracker"
                className="h-12 w-12 rounded-lg"
              />
              <h1 className="text-xl font-semibold text-foreground">NFL Combine Tracker</h1>
            </div>
            <div className="flex items-center gap-3">
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Track Your Athletic Performance Like a Pro
              </h2>
              <p className="text-lg text-muted-foreground">
                Record and measure your NFL Combine stats. Track your progress over time, compare against benchmarks, and share your achievements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleContinueAsGuest} size="lg" className="gap-2">
                  <Activity className="h-5 w-5" />
                  Continue as Guest
                </Button>
                <LoginButton />
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                <Activity className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium">Guest Mode: Local storage only</p>
                  <p>Sign in to sync your data across devices and publish results publicly.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/combine-hero.dim_1600x900.png"
                alt="NFL Combine training"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border">
                <CardContent className="pt-6">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} NFL Combine Tracker. For informational purposes only.</p>
            <p>
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
