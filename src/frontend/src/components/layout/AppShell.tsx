import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Activity, Menu, X, Trophy, History, PlusCircle, Shield, User, DollarSign } from 'lucide-react';
import { useState } from 'react';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';
import PaymentGate from '../auth/PaymentGate';
import PrincipalDisplay from '../auth/PrincipalDisplay';

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLandingPage = location.pathname === '/';

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showPaymentGate = isAuthenticated && userProfile && !userProfile.hasPaid && !userProfile.isAdmin;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/new-entry', label: 'New Entry', icon: PlusCircle },
    { path: '/history', label: 'History', icon: History },
    { path: '/published', label: 'Leaderboard', icon: Trophy },
    { path: '/contact-card', label: 'Contact Card', icon: User },
  ];

  if (userProfile?.isAdmin) {
    navItems.push(
      { path: '/admin', label: 'Admin', icon: Shield },
      { path: '/admin/payment', label: 'Payment Admin', icon: DollarSign }
    );
  }

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  if (isLandingPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/combine-logo.dim_512x512.png"
                alt="NFL Combine Tracker"
                className="h-10 w-10 rounded-lg cursor-pointer"
                onClick={() => handleNavigation('/dashboard')}
              />
              <h1
                className="text-lg font-semibold text-foreground cursor-pointer hidden sm:block"
                onClick={() => handleNavigation('/dashboard')}
              >
                NFL Combine Tracker
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleNavigation(item.path)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'default' : 'ghost'}
                    onClick={() => handleNavigation(item.path)}
                    className="justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {isAuthenticated && <PrincipalDisplay />}

      <main className="container mx-auto px-4 py-8">
        {showPaymentGate ? <PaymentGate /> : <Outlet />}
      </main>

      <ProfileSetupDialog open={showProfileSetup} />
    </div>
  );
}
