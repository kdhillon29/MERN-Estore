import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig((config) => {
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: `${
            config.mode === "production"
              ? "https://mern-estore-sh15.onrender.com"
              : "http://localhost:5000"
          }`,
        },
      },
    },
  };
});
