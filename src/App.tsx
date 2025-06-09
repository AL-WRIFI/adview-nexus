
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-provider';
import { SiteSettingsProvider } from '@/components/layout/SiteSettingsProvider';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Home from '@/pages/Home';
import AdDetails from '@/pages/AdDetails';
import AddAd from '@/pages/AddAd';
import EditAd from '@/pages/EditAd';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import Dashboard from '@/pages/dashboard';
import Category from '@/pages/category';
import Search from '@/pages/search';
import Profile from '@/pages/profile';
import Favorites from '@/pages/favorites';
import Messages from '@/pages/messages';
import Notifications from '@/pages/notifications';
import Settings from '@/pages/settings';
import Statistics from '@/pages/statistics';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AuthProvider>
          <SiteSettingsProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/ad/:id" element={<AdDetails />} />
                    <Route path="/add-ad" element={<AddAd />} />
                    <Route path="/edit-ad/:id" element={<EditAd />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="/category/:categoryId" element={<Category />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster />
              </div>
            </Router>
          </SiteSettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
