import { Link, useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import LoginButton from '../auth/LoginButton';
import PaymentGate from '../auth/PaymentGate';
import { Home, Plus, History, Share2, Shield, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SubscriptionStatus } from '../../backend';

function getSubscriptionMessage(status: SubscriptionStatus): { type: 'pending' | 'expired' | null; message: string } {
  if (status.__kind__ === 'Pending') {
    return {
      type: 'pending',
      message: 'send payments via Zelle to 3527348440 (Matt Rossin)…once payment is made you\'ll be approved💙👍 Make sure to provide me your username, real name, and name you\'re known by on this App along with your Zelle payment in the description of the Zelle Payment in order to gain full access.',
    };
  }
  if (status.__kind__ === 'Expired') {
    return {
      type: 'expired',
      message: 'send payments via Zelle to 3527348440 (Matt Rossin)…once payment is made you\'ll be approved💙👍 Make sure to provide me your username, real name, and name you\'re known by on this App along with your Zelle payment in the description of the Zelle Payment in order to gain full access.',
    };
  }
  if (status.__kind__ === 'Active') {
    const expiryTime = Number(status.Active) / 1_000_000;
    if (Date.now() > expiryTime) {
      return {
        type: 'expired',
        message: 'send payments via Zelle to 3527348440 (Matt Rossin)…once payment is made you\'ll be approved💙👍 Make sure to provide me your username, real name, and name you\'re known by on this App along with your Zelle payment in the description of the Zelle Payment in order to gain full access.',
      };
    }
  }
  return { type: null, message: '' };
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const subscriptionMessage = userProfile ? getSubscriptionMessage(userProfile.subscriptionStatus) : { type: null, message: '' };
  const hasActiveSubscription = subscriptionMessage.type === null;

  // Check payment status - block if authenticated, profile loaded, and not paid
  // Admins bypass payment gate
  const isPaymentBlocked = isAuthenticated && 
    !profileLoading && 
    isFetched && 
    userProfile !== null && 
    userProfile !== undefined &&
    !userProfile.hasPaid && 
    !userProfile.isAdmin;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/new-entry', label: 'New Entry', icon: Plus },
    { path: '/history', label: 'History', icon: History },
    { path: '/published', label: 'Published', icon: Share2 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/assets/generated/combine-logo.dim_512x512.png"
                  alt="NFL Combine Tracker"
                  className="h-10 w-10 rounded-lg"
                />
                <div>
                  <h1 className="text-xl font-semibold text-foreground">NFL Combine Tracker</h1>
                  {isAuthenticated && userProfile && (
                    <p className="text-sm text-muted-foreground">Welcome, {userProfile.name}</p>
                  )}
                  {!isAuthenticated && (
                    <Badge variant="secondary" className="text-xs">
                      Guest (local only)
                    </Badge>
                  )}
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const isDisabled = isAuthenticated && !hasActiveSubscription;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-t-lg transition-colors whitespace-nowrap ${
                    isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                  }`}
                  activeProps={{
                    className: 'text-foreground bg-background border-b-2 border-primary',
                  }}
                  disabled={isDisabled}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            {userProfile?.isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-t-lg transition-colors whitespace-nowrap"
                  activeProps={{
                    className: 'text-foreground bg-background border-b-2 border-primary',
                  }}
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
                <Link
                  to="/admin/payment"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-t-lg transition-colors whitespace-nowrap"
                  activeProps={{
                    className: 'text-foreground bg-background border-b-2 border-primary',
                  }}
                >
                  <DollarSign className="h-4 w-4" />
                  Payment Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {isAuthenticated && subscriptionMessage.type && (
        <div className="container mx-auto px-4 pt-6">
          <Alert variant={subscriptionMessage.type === 'expired' ? 'destructive' : 'default'}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {subscriptionMessage.type === 'pending' ? 'Waiting for Payment Approval' : 'Access Expired'}
            </AlertTitle>
            <AlertDescription>{subscriptionMessage.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-8">
        {isPaymentBlocked ? <PaymentGate /> : children}
      </main>

      <footer className="border-t border-border bg-card mt-auto">
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
