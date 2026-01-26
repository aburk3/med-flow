import { defineConfig } from "@playwright/test";

process.env.PLAYWRIGHT_BROWSERS_PATH = "0";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3100";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "npm --prefix backend run dev",
      url: "http://localhost:4000/health",
      timeout: 120_000,
      reuseExistingServer: true,
    },
    {
      command: "npm run dev",
      url: "http://localhost:3100",
      timeout: 120_000,
      reuseExistingServer: true,
      env: {
        VITE_API_BASE_URL: "http://localhost:4000",
      },
    },
  ],
});
