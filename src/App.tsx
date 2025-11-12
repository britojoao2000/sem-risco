import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSettings } from "@/lib/storage";
import Welcome from "./pages/onboarding/Welcome";
import Name from "./pages/onboarding/Name";
import Lifestyle from "./pages/onboarding/Lifestyle";
import Allergies from "./pages/onboarding/Allergies";
import Intolerances from "./pages/onboarding/Intolerances";
import Home from "./pages/app/Home";
import History from "./pages/app/History";
import Profile from "./pages/app/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RootRedirect = () => {
  const [redirect, setRedirect] = useState<string | null>(null);
  
  useEffect(() => {
    const settings = getSettings();
    setRedirect(settings ? '/app/home' : '/onboarding/welcome');
  }, []);
  
  if (!redirect) return null;
  return <Navigate to={redirect} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          
          {/* Onboarding Routes */}
          <Route path="/onboarding/welcome" element={<Welcome />} />
          <Route path="/onboarding/name" element={<Name />} />
          <Route path="/onboarding/lifestyle" element={<Lifestyle />} />
          <Route path="/onboarding/allergies" element={<Allergies />} />
          <Route path="/onboarding/intolerances" element={<Intolerances />} />
          
          {/* App Routes */}
          <Route path="/app/home" element={<Home />} />
          <Route path="/app/history" element={<History />} />
          <Route path="/app/profile" element={<Profile />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
