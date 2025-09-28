import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true, // Clean the dist folder before building
  },
  server: {
    proxy: {
      "/api": {
        target: "https://mern-estore-henna.vercel.app",
      },
    },
  },
});
