import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import RouteLoadingFallback from './components/common/RouteLoadingFallback';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';

// Route-level code splitting — every page beyond Home is a separate chunk, so later
// steps only add weight to the routes people actually visit. Home itself is a direct
// (non-lazy) import: it's the landing page, so there's no route-transition to defer,
// and lazy-loading it was actually causing a large layout shift — Footer (outside the
// Suspense boundary) would render immediately, then jump once Home's ~12,000px worth
// of sections streamed in behind the Suspense fallback, measured at CLS 0.53.
const About = lazy(() => import('./pages/About'));
const ToursOverview = lazy(() => import('./pages/ToursOverview'));
const ToursCategory = lazy(() => import('./pages/ToursCategory'));
const TourDetail = lazy(() => import('./pages/TourDetail'));
const Destinations = lazy(() => import('./pages/Destinations'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const Activities = lazy(() => import('./pages/Activities'));
const Gallery = lazy(() => import('./pages/Gallery'));
const ShareYourExperience = lazy(() => import('./pages/ShareYourExperience'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminTours = lazy(() => import('./pages/admin/AdminTours'));
const AdminDestinations = lazy(() => import('./pages/admin/AdminDestinations'));
const AdminActivities = lazy(() => import('./pages/admin/AdminActivities'));
const AdminExperiences = lazy(() => import('./pages/admin/AdminExperiences'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));
const AdminSubscribers = lazy(() => import('./pages/admin/AdminSubscribers'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/tours', element: <ToursOverview /> },
      { path: '/tours/:category', element: <ToursCategory /> },
      { path: '/tours/:category/:tourSlug', element: <TourDetail /> },
      { path: '/destinations', element: <Destinations /> },
      { path: '/destinations/:slug', element: <DestinationDetail /> },
      { path: '/activities', element: <Activities /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/share-your-experience', element: <ShareYourExperience /> },
      { path: '/contact', element: <Contact /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/terms', element: <Terms /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  // Admin routes live outside RootLayout — an internal tool has no reason to wear the
  // public marketing Navbar/Footer chrome.
  {
    path: '/admin/login',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<RouteLoadingFallback />}>
          <AdminLogin />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminOverview /> },
      { path: 'tours', element: <AdminTours /> },
      { path: 'destinations', element: <AdminDestinations /> },
      { path: 'activities', element: <AdminActivities /> },
      { path: 'experiences', element: <AdminExperiences /> },
      { path: 'inquiries', element: <AdminInquiries /> },
      { path: 'subscribers', element: <AdminSubscribers /> },
      { path: 'testimonials', element: <AdminTestimonials /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
