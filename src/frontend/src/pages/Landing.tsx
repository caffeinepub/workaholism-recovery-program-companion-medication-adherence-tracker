import LoginButton from '../components/auth/LoginButton';
import { Link } from '@tanstack/react-router';
import { Heart, BookOpen, Calendar, Pill, Users, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Landing() {
  const features = [
    {
      icon: BookOpen,
      title: 'Recovery Program',
      description: 'Work through a structured recovery program with guided steps and reflections.',
    },
    {
      icon: Calendar,
      title: 'Daily Check-ins',
      description: 'Track your mood, stress levels, and work hours with daily reflections.',
    },
    {
      icon: Pill,
      title: 'Medication Tracking',
      description: 'Manage your medication schedule and log adherence with ease.',
    },
    {
      icon: Users,
      title: 'Meeting Support',
      description: 'Keep notes from meetings and maintain sponsor contact information.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/wa-logo.dim_512x512.png"
                alt="Recovery Companion"
                className="h-10 w-10 rounded-lg"
              />
              <h1 className="text-xl font-semibold text-foreground">Recovery Companion</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/crisis-help"
                className="text-sm font-medium text-destructive hover:underline flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Crisis Help
              </Link>
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
                Your Journey to Recovery, Supported Every Step
              </h2>
              <p className="text-lg text-muted-foreground">
                A comprehensive companion for managing workaholism recovery and medication adherence. Track your
                progress, maintain accountability, and build healthier habits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <LoginButton />
                <Link to="/crisis-help">
                  <button className="px-6 py-3 rounded-lg border border-border hover:bg-accent transition-colors font-medium">
                    Learn More
                  </button>
                </Link>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Your data is private and secure. This app is not medical advice and should not replace professional
                  care.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/recovery-hero.dim_1600x900.png"
                alt="Recovery journey illustration"
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
            <p>© {new Date().getFullYear()} Recovery Companion. Not medical advice.</p>
            <p>
              Built with <Heart className="inline h-4 w-4 text-destructive" /> using{' '}
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
