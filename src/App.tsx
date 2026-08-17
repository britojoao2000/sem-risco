import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { UserProvider, useUser } from './context/UserContext';
import { AppShell } from './components/layout/AppShell';

import { Home } from './pages/Home/Home';
import { Scanner } from './pages/Scan/Scanner';
import { Products } from './pages/Products/Products';
import { SafePlacesMap } from './pages/Map/SafePlacesMap';
import { Profile } from './pages/Profile/Profile';
import { Premium } from './pages/Premium/Premium';
import { Onboarding } from './pages/Auth/Onboarding';
import { Login } from './pages/Auth/Login';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const appBase = import.meta.env.BASE_URL || '/';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Onboarding & Auth Routes */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />

      {/* Main App Routes wrapped inside AppShell */}
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scanner />} />
        <Route path="/products" element={<Products />} />
        <Route path="/map" element={<SafePlacesMap />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/premium" element={<Premium />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <UserProvider>
        <BrowserRouter basename={appBase}>
          <AppRoutes />
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;