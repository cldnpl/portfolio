import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "it";

type LanguageState = { lang: Lang; setLang: (lang: Lang) => void };

const LanguageContext = createContext<LanguageState>({ lang: "en", setLang: () => {} });

/**
 * The site opens in English every time: the choice is not stored anywhere,
 * it only lasts while the visitor moves between pages.
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
