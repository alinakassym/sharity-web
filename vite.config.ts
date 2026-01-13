import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const isVercel = !!process.env.VERCEL;

export default defineConfig({
  base: isVercel ? "/" : "/sharity-web/",
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    port: 5175,
    allowedHosts: [".ngrok-free.dev", ".ngrok.io", "slow-trains-shout.loca.lt"],
  },
  build: {
    outDir: isVercel ? "dist" : "docs",
    assetsDir: "assets",
    emptyOutDir: true,
  },
});
