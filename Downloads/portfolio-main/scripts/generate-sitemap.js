import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES } from "./routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const clientDir = path.join(root, "dist", "client");

const SITE_ORIGIN = process.env.SITE_ORIGIN || "https://yourdomain.com";

const buildDate = new Date().toISOString().slice(0, 10);

const xmlEscape = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const normalizePath = (route) => (route === "/" ? "/" : route);

const main = async () => {
  const urls = ROUTES.map((route) => {
    const loc = route === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`;
    return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${buildDate}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`;
  }).join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  const robots = ["User-agent: *", "Allow: /", `Sitemap: ${SITE_ORIGIN}/sitemap.xml`, ""].join("\n");

  await writeFile(path.join(clientDir, "sitemap.xml"), sitemap, "utf-8");
  await writeFile(path.join(clientDir, "robots.txt"), robots, "utf-8");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
