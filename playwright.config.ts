import { defineConfig } from '@playwright/test'

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests',
  // fullyParallel: true,
  // forbidOnly: isCI,
  // retries: isCI ? 2 : 0,
  // workers: isCI ? '50%' : undefined,
  // reporter: isCI ? 'github' : 'list',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? '50%' : undefined,
  expect: { timeout: 10_000 },
  // retries: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  globalSetup: './global.setup.ts',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:8100',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 5_000,
    // launchOptions: {
    //   slowMo: 1000,
    // },
  },
  projects: [
    {
      name: 'smoke',
      testMatch: '**/smoke.spec.ts',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
        channel: 'chrome',
        extraHTTPHeaders: {
          'Accept': 'application/json',
        },
      },
    },
    {
      name: 'api-tests',
      testMatch: '**/api.spec.ts',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
    },
    {
      name: 'ui-tests',
      testMatch: '**/todo.spec.ts',
      use: {
        baseURL: 'https://demo.playwright.dev/todomvc',
        channel: 'chrome',
      },
    },
    {
      name: 'user-crud-tests',
      testMatch: '**/user-crud.spec.ts',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
        channel: 'chrome',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
    },
    {
      name: 'login-tests',
      testMatch: '**/login.spec.ts',
      use: {
        baseURL: 'http://localhost:8100',
        channel: 'chrome',
      },
    },
    {
      name: 'a11y-tests',
      testMatch: '**/a11y.spec.ts',
      use: {
        baseURL: 'https://demo.playwright.dev/todomvc',
        channel: 'chrome',
      },
    },
    {
      name: 'visual-tests',
      testMatch: '**/visual.spec.ts',
      use: {
        baseURL: 'https://demo.playwright.dev/todomvc',
        channel: 'chrome',
      },
    },
  ],
})