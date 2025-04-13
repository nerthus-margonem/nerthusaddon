import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "./test/vitest-environment-jquery.js",
    globals: true,
  },
});
