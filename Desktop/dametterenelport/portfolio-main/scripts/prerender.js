import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ROUTES, SITE_ORIGIN, getRouteMeta, personJsonLd, siteJsonLd } from "./routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const clientDir = path.join(root, "dist", "client");
const serverEntry = path.join(root, "dist", "server", "entry-server.js");

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// `</script>` inside a JSON string would end the tag early; the escape is the
// standard one for embedding JSON in HTML.
const jsonLdScript = (data) =>
  JSON.stringify(data).replaceAll("<", "\\u003c").replaceAll(">", "\\u003e").replaceAll("&", "\\u0026");

const injectHeadTags = (html, route) => {
  const meta = getRouteMeta(route);
  const canonical = route === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`;

  // Crawlers and chat apps are not required to resolve a relative og:image,
  // and the ones that do not simply show no preview at all.
  const ogImage = `${SITE_ORIGIN}/opengraph-image.jpg`;

  // JSON-LD only on the home page: repeating the same Person on every route
  // does not strengthen it, and a page that describes itself as the person is
  // wrong on /projects.
  const structured =
    route === "/"
      ? [personJsonLd(SITE_ORIGIN), siteJsonLd(SITE_ORIGIN)]
          .map((data) => `<script type="application/ld+json">${jsonLdScript(data)}</script>`)
          .join("")
      : "";

  const tags = [
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    structured,
  ].join("");

  // Replace existing <title> and description (if present) to ensure route-specific metadata.
  let next = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<meta\s+name=\"description\"[^>]*>/i, `<meta name="description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<meta\s+property=\"og:title\"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />`)
    .replace(/<meta\s+property=\"og:description\"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />`)
    .replace(/<meta\s+property=\"og:image\"[^>]*>/i, `<meta property="og:image" content="${escapeHtml(ogImage)}" />`)
    .replace(/<meta\s+name=\"twitter:image\"[^>]*>/i, `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`);

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
