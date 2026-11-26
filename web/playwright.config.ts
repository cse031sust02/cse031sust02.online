import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
// Set E2E_BASE_URL to test an already-running server (e.g. the Docker image).
const externalBaseURL = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: externalBaseURL ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: externalBaseURL
    ? undefined
    : {
        command: `npm run build && PORT=${PORT} npm start`,
        // Hermetic: explicit values win over any local web/.env*, so tests never use real
        // keys or SMTP and always see the default site URL.
        env: {
          NEXT_PUBLIC_SITE_URL: "https://cse031sust02.online",
          OPENROUTER_API_KEY: "",
          SMTP_HOST: "",
          CONTACT_TO_EMAIL: "",
          TURNSTILE_SECRET_KEY: "",
          NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
        },
        url: `http://localhost:${PORT}/api/health`,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
      },
});
