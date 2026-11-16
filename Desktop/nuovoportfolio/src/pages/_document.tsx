import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Head, Html, Main, NextScript } from "next/document";

// Preload whichever font files are in public/fonts (as next/font does).
const fontFiles = (() => {
  try {
    return readdirSync(join(process.cwd(), "public/fonts")).filter((f) => f.endsWith(".otf"));
  } catch {
    return [];
  }
})();

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.png" />
        {fontFiles.map((file) => (
          <link key={file} rel="preload" href={`/fonts/${file}`} as="font" type="font/otf" crossOrigin="anonymous" />
        ))}
        {/* Stand-ins used only while the Pangram Pangram files are missing from public/fonts. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@200;400;500;600;700&family=Six+Caps&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
