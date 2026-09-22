import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
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

    {/* Vercel Web Analytics. Draws nothing and reads nothing back: it counts
        page views, including the client-side ones React Router makes without
        a reload, which a plain server log cannot see. No cookies, so no
        consent banner to bolt onto the page. */}
    <Analytics />
  </LanguageProvider>
);

export default App;
