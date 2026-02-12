import { Link, useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from '../auth/LoginButton';
import { Home, BookOpen, Calendar, Pill, Users, Settings, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const navItems = [
    { path: '/today', label: 'Today', icon: Home },
    { path: '/program', label: 'Program', icon: BookOpen },
    { path: '/check-ins', label: 'Check-ins', icon: Calendar },
    { path: '/medications', label: 'Medications', icon: Pill },
    { path: '/meetings', label: 'Meetings', icon: Users },
    { path: '/staying-safe', label: 'Staying Safe', icon: Shield },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/assets/generated/wa-logo.dim_512x512.png"
                  alt="Recovery Companion"
                  className="h-10 w-10 rounded-lg"
                />
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Recovery Companion</h1>
                  {userProfile && (
                    <p className="text-sm text-muted-foreground">Welcome, {userProfile.name}</p>
                  )}
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/crisis-help' })}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Heart className="h-4 w-4" />
                Crisis Help
              </Button>
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-t-lg transition-colors whitespace-nowrap"
                activeProps={{
                  className: 'text-foreground bg-background border-b-2 border-primary',
                }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-border bg-card mt-auto">
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
