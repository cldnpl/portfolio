import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ROUTES, getRouteMeta } from "./routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const clientDir = path.join(root, "dist", "client");
const serverEntry = path.join(root, "dist", "server", "entry-server.js");

const getSiteOrigin = () => {
  const configured = process.env.SITE_ORIGIN;
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercelUrl = process.env.VERCEL_URL;
  const raw = configured || vercelProductionUrl || vercelUrl || "https://portfolio.vercel.app";
  return raw.startsWith("http") ? raw : `https://${raw}`;
};

const SITE_ORIGIN = getSiteOrigin().replace(/\/$/, "");

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const injectHeadTags = (html, route) => {
  const meta = getRouteMeta(route);
  const canonical = route === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`;

  const tags = [
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
  ].join("");

  // Replace existing <title> and description (if present) to ensure route-specific metadata.
  let next = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<meta\s+name=\"description\"[^>]*>/i, `<meta name="description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<meta\s+property=\"og:title\"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />`)
    .replace(/<meta\s+property=\"og:description\"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />`);

  // Use existing injection marker from index.html.
  next = next.replace("<!--seo-head-->", `${tags}<!--seo-head-->`);

  return next;
};

const getOutPathForRoute = (route) => {
  if (route === "/") return path.join(clientDir, "index.html");
  const routePath = route.replace(/^\//, "");
  return path.join(clientDir, routePath, "index.html");
};

const main = async () => {
  const template = await readFile(path.join(clientDir, "index.html"), "utf-8");

  const { render } = await import(pathToFileURL(serverEntry).href);

  for (const route of ROUTES) {
    const { appHtml } = render(route);
    const withApp = template.replace("<!--app-html-->", appHtml);
    const html = injectHeadTags(withApp, route);

    const outPath = getOutPathForRoute(route);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf-8");
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
