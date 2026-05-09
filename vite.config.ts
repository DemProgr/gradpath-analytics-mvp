import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://hgihbaicflhahnhuzmdd.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaWhiYWljZmxoYWhuaHV6bWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTE0MzgsImV4cCI6MjA5MTc2NzQzOH0.oDHsUebuyeWHUmI1FYpwjLnmQE_j7MwnCs4pDiRVrdM'),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api/cohere': {
        target: 'https://api.cohere.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cohere/, '/v1/chat'),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
