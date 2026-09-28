/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Deployed as static files (out/). Images are sized and compressed ahead of
  // time by scripts/prepare-images.py; the loader picks the right width. The
  // redirects for the old /projects, /about and /contact live in vercel.json.
  output: "export",
  images: { loader: "custom", loaderFile: "./src/lib/imageLoader.ts" },
};

module.exports = nextConfig;
