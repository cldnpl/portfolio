# Portfolio — Claudia Napolitano

Rifacimento del portfolio sul modello di russellnumo.nl: stesso stack (Next.js 14
pages router, Chakra UI 2.8, framer-motion 11, GSAP 3.15 con SplitText/ScrollTrigger,
Lenis 1.1.5, OGL), stesso tema, stesse animazioni.

```
npm install
npm run dev        # http://localhost:3100
npm run build
```

- Testi: `src/data/site.ts` (hero, about, servizi, footer, frasi del loader, SEO)
- Progetti: `src/data/projects.ts` (una pagina `/<href>` per progetto)
- Immagini: `python3 scripts/prepare-images.py` rigenera copertine, gallerie,
  ritratto e miniature dei servizi in `public/images/` dagli screenshot originali
- Sfondo: `MARBLE_MODE` in `src/data/site.ts` — `"full"` marmo su tutto il sito
  (testi piccoli su card bianche), `"hero"` marmo solo nella prima sezione
- Font: vedi `public/fonts/README.md` — finché mancano i file .otf il sito usa
  font sostitutivi e non è identico al riferimento
