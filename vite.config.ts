import { solidStart } from "@solidjs/start/config";
import { defineConfig } from "vite";
import { nitroV2Plugin } from "@solidjs/vite-plugin-nitro-2";

export default defineConfig(() => ({
  plugins: [solidStart(), nitroV2Plugin()],
  nitro: {
    preset: "cloudflare-pages",
    rollupConfig: {
      external: ["node:async_hooks"],
    },
  },
}));
