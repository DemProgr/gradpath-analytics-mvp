import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Applicants from "./pages/Applicants";
import Students from "./pages/Students";
import Statistics from "./pages/Statistics";
import UniversityDetail from "./pages/UniversityDetail";
import Admin from "./pages/Admin";
import AdmissionStats from "./pages/AdmissionStats";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Team from "./pages/Team";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import SearchPage from "./pages/Search";
import UniversitiesPage from "./pages/Universities";
import { AIChat } from "@/components/AIChat";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const AppContent = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const showChat = ['/applicants', '/students', '/', '/statistics', '/admission-stats'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index isChatOpen={isChatOpen} onChatToggle={setIsChatOpen} />} />
        <Route path="/applicants" element={<Applicants isChatOpen={isChatOpen} onChatToggle={setIsChatOpen} />} />
        <Route path="/students" element={<Students isChatOpen={isChatOpen} onChatToggle={setIsChatOpen} />} />
        <Route path="/statistics" element={<Statistics isChatOpen={isChatOpen} onChatToggle={setIsChatOpen} />} />
        <Route path="/university/:shortName" element={<UniversityDetail />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/admission-stats" element={<AdmissionStats isChatOpen={isChatOpen} onChatToggle={setIsChatOpen} />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/universities" element={<UniversitiesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/team" element={<Team />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AnimatePresence>
        {showChat && <AIChat isOpen={isChatOpen} onToggle={setIsChatOpen} />}
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
<BrowserRouter basename="/gradpath-analytics-mvp">
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
