import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppShell from './components/layout/AppShell';
import Landing from './pages/Landing';
import Dashboard from './pages/combine/Dashboard';
import NewEntry from './pages/combine/NewEntry';
import History from './pages/combine/History';
import EntryDetail from './pages/combine/EntryDetail';
import ShareCard from './pages/combine/ShareCard';
import PublicEntry from './pages/combine/PublicEntry';
import Published from './pages/combine/Published';
import Admin from './pages/Admin';
import AdminPayment from './pages/AdminPayment';
import ContactCard from './pages/ContactCard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => <AppShell />,
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const newEntryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/new-entry',
  component: NewEntry,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: History,
});

const entryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entry/$entryId',
  component: EntryDetail,
});

const shareCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/share/$entryId',
  component: ShareCard,
});

const publicEntryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/public/$entryId',
  component: PublicEntry,
});

const publishedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/published',
  component: Published,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Admin,
});

const adminPaymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/payment',
  component: AdminPayment,
});

const contactCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact-card',
  component: ContactCard,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardRoute,
  newEntryRoute,
  historyRoute,
  entryDetailRoute,
  shareCardRoute,
  publicEntryRoute,
  publishedRoute,
  adminRoute,
  adminPaymentRoute,
  contactCardRoute,
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
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
