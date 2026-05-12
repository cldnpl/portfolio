import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer as createViteServer } from "vite";
import compression from "compression";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const clientDistDir = path.join(root, "dist", "client");
const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || "127.0.0.1";
const isProd = process.env.NODE_ENV === "production";
const siteName = "Claudia Napolitano — Portfolio 3D";
const siteDescription =
  "Portfolio 3D di Claudia Napolitano con animazioni interattive, modello iPhone personalizzato e contenuti ottimizzati per SEO.";
const sameAs = [
  "https://github.com/cldnpl",
  "https://www.linkedin.com/in/claudia-napolitano/",
];

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".ttf", "font/ttf"],
  [".txt", "text/plain; charset=utf-8"],
  [".wasm", "application/wasm"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".glb", "model/gltf-binary"],
  [".dae", "model/vnd.collada+xml"],
]);

const getContentType = (filePath) => contentTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";

const getOrigin = (req) => {
  const forwardedHost = req.headers["x-forwarded-host"];
  const forwardedProto = req.headers["x-forwarded-proto"];
  const hostHeader = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost || req.headers.host || `${host}:${port}`;
  const proto = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || "http";
  return `${proto}://${hostHeader}`;
};

const escapeHtml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const buildSeoHead = (origin, pathname) => {
  const canonical = pathname === "/" ? `${origin}/` : `${origin}${pathname}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Claudia Napolitano",
    description: siteDescription,
    url: canonical,
    jobTitle: "Frontend Developer",
    sameAs,
  };
  const jsonLd = JSON.stringify(structuredData).replaceAll("</", "<\\/");

  return [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta name="twitter:url" content="${escapeHtml(canonical)}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join("");
};

const sendFile = async (res, filePath) => {
  const data = await readFile(filePath);
  res.statusCode = 200;
  res.setHeader("Content-Type", getContentType(filePath));
  res.setHeader("Cache-Control", filePath.includes("/assets/") ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate");
  res.end(data);
};

const pickPrecompressed = (req, filePath) => {
  const acceptEncoding = String(req.headers["accept-encoding"] || "");
  if (acceptEncoding.includes("br") && existsSync(`${filePath}.br`)) {
    return { path: `${filePath}.br`, encoding: "br" };
  }
  if (acceptEncoding.includes("gzip") && existsSync(`${filePath}.gz`)) {
    return { path: `${filePath}.gz`, encoding: "gzip" };
  }
  return { path: filePath, encoding: null };
};

const renderDocument = (template, appHtml) =>
  template.replace("<!--app-html-->", appHtml).replace("<!--app-html-->", appHtml);

const sendText = (res, body, contentType) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.end(body);
};

const buildRobots = (origin) =>
  [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${origin}/sitemap.xml`,
  ].join("\n");

const buildSitemap = (origin) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>2026-05-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

if (!isProd) {
  const vite = await createViteServer({
    root,
    appType: "custom",
    server: {
      middlewareMode: true,
    },
  });

  const server = http.createServer(async (req, res) => {
    const url = req.url ?? "/";
    const origin = getOrigin(req);
    const pathname = new URL(url, `${origin}/`).pathname;

    if (pathname === "/robots.txt") {
      sendText(res, buildRobots(origin), "text/plain; charset=utf-8");
      return;
    }

    if (pathname === "/sitemap.xml") {
      sendText(res, buildSitemap(origin), "application/xml; charset=utf-8");
      return;
    }

    vite.middlewares(req, res, async () => {
      try {
        const template = await vite.transformIndexHtml(url, await readFile(path.join(root, "index.html"), "utf-8"));
        const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
        const { appHtml } = render(url);
        const html = renderDocument(template, appHtml).replace(
          "<!--seo-head-->",
          buildSeoHead(origin, pathname)
        );

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        console.error(error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });
  });

  server.listen(port, host, () => {
    console.log(`SSR dev server running at http://127.0.0.1:${port}/`);
  });
} else {
  const template = await readFile(path.join(clientDistDir, "index.html"), "utf-8");
  const compress = compression();

  const server = http.createServer(async (req, res) => {
    try {
      const origin = getOrigin(req);
      const url = new URL(req.url ?? "/", origin);
      const pathname = decodeURIComponent(url.pathname);
      const filePath = path.join(clientDistDir, pathname);

      if (pathname === "/robots.txt") {
        sendText(res, buildRobots(origin), "text/plain; charset=utf-8");
        return;
      }

      if (pathname === "/sitemap.xml") {
        sendText(res, buildSitemap(origin), "application/xml; charset=utf-8");
        return;
      }

      if (pathname !== "/" && path.extname(pathname) && existsSync(filePath)) {
        const picked = pickPrecompressed(req, filePath);
        if (picked.encoding) res.setHeader("Content-Encoding", picked.encoding);
        await sendFile(res, picked.path);
        return;
      }

      if (pathname.startsWith("/assets/") && existsSync(filePath)) {
        const picked = pickPrecompressed(req, filePath);
        if (picked.encoding) res.setHeader("Content-Encoding", picked.encoding);
        await sendFile(res, picked.path);
        return;
      }

      const { render } = await import("./dist/server/entry-server.js");
      const { appHtml } = render(url.pathname + url.search);
      const html = renderDocument(template, appHtml).replace(
        "<!--seo-head-->",
        buildSeoHead(origin, pathname)
      );

      compress(req, res, () => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(html);
      });
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  server.listen(port, host, () => {
    console.log(`SSR server running at http://127.0.0.1:${port}/`);
  });
}
