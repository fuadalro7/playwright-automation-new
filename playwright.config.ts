import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "reports/html", open: "never" }],
  ],

  globalSetup: "./src/fixtures/global-setup.ts",
  globalTeardown: "./src/fixtures/global-teardown.ts",

  use: {
    baseURL: "https://www.saucedemo.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chrome",
      use: {
        browserName: "chromium",
        channel: "chromium",
        viewport: null,
        launchOptions: {
          args: ["--start-maximized"],
        },
      },
    },
    {
      name: "firefox",
      use: {
        browserName: "firefox",
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          firefoxUserPrefs: {},
        },
      },
    },
  ],
});
