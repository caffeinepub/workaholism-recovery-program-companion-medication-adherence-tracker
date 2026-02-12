import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Landing from './pages/Landing';
import Today from './pages/Today';
import Program from './pages/Program';
import ProgramStepDetail from './pages/ProgramStepDetail';
import CheckIns from './pages/CheckIns';
import Medications from './pages/Medications';
import MedicationDetail from './pages/MedicationDetail';
import AdherenceHistory from './pages/AdherenceHistory';
import Meetings from './pages/Meetings';
import Settings from './pages/Settings';
import SettingsDataExport from './pages/SettingsDataExport';
import CrisisHelp from './pages/CrisisHelp';
import StayingSafeOutOfTrouble from './pages/StayingSafeOutOfTrouble';
import Onboarding from './pages/Onboarding';
import AppShell from './components/layout/AppShell';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function AuthenticatedLayout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return <Landing />;
  }

  if (showProfileSetup) {
    return <ProfileSetupDialog />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

const rootRoute = createRootRoute({
  component: AuthenticatedLayout,
});

function IndexComponent() {
  const { identity } = useInternetIdentity();
  if (!identity) {
    return <Landing />;
  }
  return <Today />;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

const todayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/today',
  component: Today,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: Onboarding,
});

const programRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/program',
  component: Program,
});

const programStepRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/program/$stepId',
  component: ProgramStepDetail,
});

const checkInsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/check-ins',
  component: CheckIns,
});

const medicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/medications',
  component: Medications,
});

const medicationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/medications/$medicationName',
  component: MedicationDetail,
});

const adherenceHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/adherence-history',
  component: AdherenceHistory,
});

const meetingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/meetings',
  component: Meetings,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const settingsDataExportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings/data-export',
  component: SettingsDataExport,
});

const crisisHelpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crisis-help',
  component: CrisisHelp,
});

const stayingSafeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staying-safe',
  component: StayingSafeOutOfTrouble,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  todayRoute,
  onboardingRoute,
  programRoute,
  programStepRoute,
  checkInsRoute,
  medicationsRoute,
  medicationDetailRoute,
  adherenceHistoryRoute,
  meetingsRoute,
  settingsRoute,
  settingsDataExportRoute,
  crisisHelpRoute,
  stayingSafeRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
