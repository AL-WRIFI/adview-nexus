
import { useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './context/auth-context';
import { ProtectedRoute } from './components/auth/protected-route';
import { ThemeProvider } from './context/theme-provider';
import { useScrollToTop } from './hooks/use-scroll-to-top';
import '../public/registerServiceWorker'; // Register service worker for PWA

// Pages
import Index from './pages/Index';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import AdDetails from './pages/AdDetails';
import CategoryPage from './pages/category';
import CategoriesPage from './pages/categories';
import AddAd from './pages/AddAd';
import EditAd from './pages/EditAd';
import SearchPage from './pages/search';
import DashboardPage from './pages/dashboard';
import UserDashboard from './pages/dashboard/UserDashboard';
import ProfilePage from './pages/profile';
import StatisticsPage from './pages/statistics';
import SettingsPage from './pages/settings';
import MessagesPage from './pages/messages';
import NotificationsPage from './pages/notifications';
import FavoritesPage from './pages/favorites';

// Auth pages
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import VerifyEmailPage from './pages/auth/verify-email';
import NewSearchPage from './pages/search/NewSearchPage';

// Create a client with optimized cache config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces old cacheTime)
      retry: 1,
      retryDelay: 1000,
    },
  },
});

function AppContent() {
  useScrollToTop();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/index" element={<Index />} />
      <Route path="/ad/:id" element={<AdDetails />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/add-ad" element={<AddAd />} />
      <Route path="/edit-ad/:listingId" element={
        <ProtectedRoute>
          <EditAd />
        </ProtectedRoute>
      } />
      <Route path="/search" element={<NewSearchPage/>} />
      <Route path="/search/:query" element={<NewSearchPage />} />
      
      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/:tab" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/statistics" element={
        <ProtectedRoute>
          <StatisticsPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <MessagesPage />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <NotificationsPage />
        </ProtectedRoute>
      } />
      <Route path="/favorites" element={
        <ProtectedRoute>
          <FavoritesPage />
        </ProtectedRoute>
      } />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  // Set the page title and meta description
  useEffect(() => {
    document.title = 'مكس سوريا - منصة إعلانات مبوبة سورية';
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'مكس سوريا - منصة الإعلانات المبوبة السورية. تسوق، بيع، اعثر على وظائف، خدمات، سيارات، عقارات، وأكثر');
    
    // Add meta theme color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', '#9b87f5');
    
    // Add manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      manifestLink.setAttribute('href', '/manifest.json');
      document.head.appendChild(manifestLink);
    }
    
    // Add apple touch icon
    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleIcon) {
      appleIcon = document.createElement('link');
      appleIcon.setAttribute('rel', 'apple-touch-icon');
      appleIcon.setAttribute('href', '/icons/icon-192x192.png');
      document.head.appendChild(appleIcon);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="mix-syria-theme">
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppContent />
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
