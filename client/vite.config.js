import { defineConfig } from "vite";
import envCompatible from "vite-plugin-env-compatible";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), envCompatible()],
  build: {
  	outDir: "dist",
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3001",
        secure: false,
        changeOrigin: true
      }
    }
  }
});
