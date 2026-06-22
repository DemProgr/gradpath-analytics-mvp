import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProfileProvider } from "@/hooks/useProfile";
import { DigitalProfileProvider } from "@/hooks/useDigitalProfile";
import { SurveyProvider } from "@/hooks/useSurveys";
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
import Onboarding from "./pages/Onboarding";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";
import Team from "./pages/Team";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import SearchPage from "./pages/Search";
import UniversitiesPage from "./pages/Universities";
import Internships from "./pages/Internships";
import Events from "./pages/Events";
import SpecialtyAnalytics from "./pages/SpecialtyAnalytics";
import CareerMap from "./pages/CareerMap";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import { AIChat } from "@/components/AIChat";
import { FooterSection } from "@/components/sections/FooterSection";
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
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />
        <Route path="/resume" element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        } />
        <Route path="/internships" element={<Internships />} />
        <Route path="/events" element={<Events />} />
        <Route path="/analytics/specialties" element={<SpecialtyAnalytics />} />
        <Route path="/career-map" element={<CareerMap />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/team" element={<Team />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FooterSection />
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
          <ProfileProvider>
            <DigitalProfileProvider>
              <SurveyProvider>
              <TooltipProvider>
                <Toaster />
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </TooltipProvider>
              </SurveyProvider>
            </DigitalProfileProvider>
          </ProfileProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
