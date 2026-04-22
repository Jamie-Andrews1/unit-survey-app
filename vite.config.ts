import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  // In 1.3.2, these are root properties
  ssr: true,
  server: {
    preset: "cloudflare-pages",
    unenv: {
      aliases: {
        node: true,
      },
    },
  },
});
