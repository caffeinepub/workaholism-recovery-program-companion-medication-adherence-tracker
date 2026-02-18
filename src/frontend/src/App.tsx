import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Landing from './pages/Landing';
import CombineDashboard from './pages/combine/Dashboard';
import CombineNewEntry from './pages/combine/NewEntry';
import CombineHistory from './pages/combine/History';
import CombineEntryDetail from './pages/combine/EntryDetail';
import CombineShareCard from './pages/combine/ShareCard';
import CombinePublicEntry from './pages/combine/PublicEntry';
import CombinePublished from './pages/combine/Published';
import AppShell from './components/layout/AppShell';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function Layout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

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
  component: Layout,
});

function IndexComponent() {
  const { identity } = useInternetIdentity();
  if (!identity) {
    return <Landing />;
  }
  return <CombineDashboard />;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: CombineDashboard,
});

const newEntryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/new-entry',
  component: CombineNewEntry,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: CombineHistory,
});

const entryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entry/$entryId',
  component: CombineEntryDetail,
});

const shareCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/share/$entryId',
  component: CombineShareCard,
});

const publicEntryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/public/$entryId',
  component: CombinePublicEntry,
});

const publishedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/published',
  component: CombinePublished,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  newEntryRoute,
  historyRoute,
  entryDetailRoute,
  shareCardRoute,
  publicEntryRoute,
  publishedRoute,
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
