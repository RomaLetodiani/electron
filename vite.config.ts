import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist-react",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/ui"),
    },
  },
  server: {
    port: 5123,
    strictPort: true,
  },
});
