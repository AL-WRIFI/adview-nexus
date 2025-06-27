import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { QueryClient } from '@/context/query-client';
import Home from '@/pages/Home';
import CategoriesPage from '@/pages/categories';
import CategoryPage from '@/pages/category';
import AdDetails from '@/pages/ad-details';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import AddAd from '@/pages/ads/add-ad';
import EditAd from '@/pages/ads/edit-ad';
import Profile from '@/pages/profile';
import UserDashboard from '@/pages/dashboard';
import Messages from '@/pages/messages';
import Favorites from '@/pages/favorites';
import Notifications from '@/pages/notifications';
import Settings from '@/pages/settings';
import Statistics from '@/pages/statistics';
import NotFound from '@/pages/not-found';
import { Toaster } from '@/components/ui/toaster';
import NewSearchPage from '@/pages/search/NewSearchPage';
import FiltersPage from '@/pages/filters';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <QueryClient>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/filters" element={<FiltersPage />} />
              <Route path="/search" element={<NewSearchPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/ad/:id" element={<AdDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/add-ad" element={<AddAd />} />
              <Route path="/edit-ad/:id" element={<EditAd />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </QueryClient>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

import FiltersPage from '@/pages/filters';

export default App;
