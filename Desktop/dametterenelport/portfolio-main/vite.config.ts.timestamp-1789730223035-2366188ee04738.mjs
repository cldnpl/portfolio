// vite.config.ts
import { defineConfig } from "file:///Users/claudianapolitano/Desktop/dametterenelport/portfolio-main/node_modules/vite/dist/node/index.js";
import react from "file:///Users/claudianapolitano/Desktop/dametterenelport/portfolio-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///Users/claudianapolitano/Desktop/dametterenelport/portfolio-main/node_modules/lovable-tagger/dist/index.js";
import { visualizer } from "file:///Users/claudianapolitano/Desktop/dametterenelport/portfolio-main/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { compression as viteCompression } from "file:///Users/claudianapolitano/Desktop/dametterenelport/portfolio-main/node_modules/vite-plugin-compression2/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/claudianapolitano/Desktop/dametterenelport/portfolio-main";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    process.env.ANALYZE === "true" && visualizer({
      filename: "dist/stats.html",
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
      open: false
    }),
    // Pre-compress client assets for the custom Node server to serve.
    viteCompression({
      algorithms: ["brotliCompress"],
      threshold: 1024,
      include: /\.(js|css|html|svg)$/i,
      filename: "[path][base].br"
    }),
    viteCompression({
      algorithms: ["gzip"],
      threshold: 1024,
      include: /\.(js|css|html|svg)$/i,
      filename: "[path][base].gz"
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    minify: "esbuild",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("@react-three")) return "r3f";
          if (id.includes("node_modules/react-dom")) return "react-dom";
          if (id.includes("node_modules/react/")) return "react";
          return void 0;
        }
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2xhdWRpYW5hcG9saXRhbm8vRGVza3RvcC9kYW1ldHRlcmVuZWxwb3J0L3BvcnRmb2xpby1tYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvY2xhdWRpYW5hcG9saXRhbm8vRGVza3RvcC9kYW1ldHRlcmVuZWxwb3J0L3BvcnRmb2xpby1tYWluL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9jbGF1ZGlhbmFwb2xpdGFuby9EZXNrdG9wL2RhbWV0dGVyZW5lbHBvcnQvcG9ydGZvbGlvLW1haW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XG5pbXBvcnQgeyBjb21wcmVzc2lvbiBhcyB2aXRlQ29tcHJlc3Npb24gfSBmcm9tIFwidml0ZS1wbHVnaW4tY29tcHJlc3Npb24yXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogODA4MCxcbiAgICBobXI6IHtcbiAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBwcm9jZXNzLmVudi5BTkFMWVpFID09PSBcInRydWVcIiAmJlxuICAgICAgdmlzdWFsaXplcih7XG4gICAgICAgIGZpbGVuYW1lOiBcImRpc3Qvc3RhdHMuaHRtbFwiLFxuICAgICAgICB0ZW1wbGF0ZTogXCJ0cmVlbWFwXCIsXG4gICAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgICBicm90bGlTaXplOiB0cnVlLFxuICAgICAgICBvcGVuOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgIC8vIFByZS1jb21wcmVzcyBjbGllbnQgYXNzZXRzIGZvciB0aGUgY3VzdG9tIE5vZGUgc2VydmVyIHRvIHNlcnZlLlxuICAgIHZpdGVDb21wcmVzc2lvbih7XG4gICAgICBhbGdvcml0aG1zOiBbXCJicm90bGlDb21wcmVzc1wiXSxcbiAgICAgIHRocmVzaG9sZDogMTAyNCxcbiAgICAgIGluY2x1ZGU6IC9cXC4oanN8Y3NzfGh0bWx8c3ZnKSQvaSxcbiAgICAgIGZpbGVuYW1lOiBcIltwYXRoXVtiYXNlXS5iclwiLFxuICAgIH0pLFxuICAgIHZpdGVDb21wcmVzc2lvbih7XG4gICAgICBhbGdvcml0aG1zOiBbXCJnemlwXCJdLFxuICAgICAgdGhyZXNob2xkOiAxMDI0LFxuICAgICAgaW5jbHVkZTogL1xcLihqc3xjc3N8aHRtbHxzdmcpJC9pLFxuICAgICAgZmlsZW5hbWU6IFwiW3BhdGhdW2Jhc2VdLmd6XCIsXG4gICAgfSksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbWluaWZ5OiBcImVzYnVpbGRcIixcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlcy90aHJlZVwiKSkgcmV0dXJuIFwidGhyZWVcIjtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJAcmVhY3QtdGhyZWVcIikpIHJldHVybiBcInIzZlwiO1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlcy9yZWFjdC1kb21cIikpIHJldHVybiBcInJlYWN0LWRvbVwiO1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlcy9yZWFjdC9cIikpIHJldHVybiBcInJlYWN0XCI7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1gsU0FBUyxvQkFBb0I7QUFDL1ksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUNoQyxTQUFTLGtCQUFrQjtBQUMzQixTQUFTLGVBQWUsdUJBQXVCO0FBTC9DLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUFpQixnQkFBZ0I7QUFBQSxJQUMxQyxRQUFRLElBQUksWUFBWSxVQUN0QixXQUFXO0FBQUEsTUFDVCxVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsTUFDWixNQUFNO0FBQUEsSUFDUixDQUFDO0FBQUE7QUFBQSxJQUVILGdCQUFnQjtBQUFBLE1BQ2QsWUFBWSxDQUFDLGdCQUFnQjtBQUFBLE1BQzdCLFdBQVc7QUFBQSxNQUNYLFNBQVM7QUFBQSxNQUNULFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxJQUNELGdCQUFnQjtBQUFBLE1BQ2QsWUFBWSxDQUFDLE1BQU07QUFBQSxNQUNuQixXQUFXO0FBQUEsTUFDWCxTQUFTO0FBQUEsTUFDVCxVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsRUFDSCxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGNBQWM7QUFBQSxJQUNkLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGFBQWEsSUFBSTtBQUNmLGNBQUksR0FBRyxTQUFTLG9CQUFvQixFQUFHLFFBQU87QUFDOUMsY0FBSSxHQUFHLFNBQVMsY0FBYyxFQUFHLFFBQU87QUFDeEMsY0FBSSxHQUFHLFNBQVMsd0JBQXdCLEVBQUcsUUFBTztBQUNsRCxjQUFJLEdBQUcsU0FBUyxxQkFBcUIsRUFBRyxRQUFPO0FBQy9DLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
