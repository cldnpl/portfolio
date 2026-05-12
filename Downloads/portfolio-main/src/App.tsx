import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PhoneRevealPage from "./pages/PhoneRevealPage";
import ProjectsPage from "./pages/ProjectsPage";
import { LanguageProvider } from "./lib/language";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<PhoneRevealPage kind="contact" />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
