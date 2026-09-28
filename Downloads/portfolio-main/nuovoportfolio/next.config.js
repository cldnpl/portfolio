/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Deployed as static files (out/): the images are already sized and
  // compressed by scripts/prepare-images.py, and the redirects for the old
  // /projects, /about and /contact pages live in the deploy's vercel.json.
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;
