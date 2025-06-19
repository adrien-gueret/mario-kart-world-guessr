import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), mkcert()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  publicDir: "public",
  build: {
    outDir: "dist",
    assetsDir: "./",
  },
});
