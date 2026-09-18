import { Routes, Route } from "react-router-dom";
import AboutPage from "./about/AboutPage";
import HomePage from "./home/HomePage";
import NotFound from "./pages/NotFound";
import PhoneRevealPage from "./pages/PhoneRevealPage";
import WorkPage from "./work/WorkPage";
import { LanguageProvider } from "./lib/language";

/**
 * No Toaster, Sonner, TooltipProvider or QueryClientProvider: they came with
 * the shadcn scaffolding and nothing on the site ever called them. They were
 * not free — they pulled the whole `lucide-react` icon set (some 1500 files)
 * into the eager graph, which is what the dev server was choking on.
 */
const App = () => (
  <LanguageProvider>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<WorkPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<PhoneRevealPage kind="contact" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </LanguageProvider>
);

export default App;
