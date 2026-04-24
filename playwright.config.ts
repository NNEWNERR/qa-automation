import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  globalSetup: './global.setup.ts',
  use: {
    baseURL: 'http://localhost:8100',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'smoke',
      testMatch: '**/smoke.spec.ts',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
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
        launchOptions: {
          slowMo: 500, // ⏳ 0.5 วินาทีต่อ action
        },
      },
      // inherits baseURL: 'https://your-app.com' from global use
    },
  ],

  // use: {
  //   baseURL: 'https://demo.playwright.dev/todomvc',
  //   screenshot: 'only-on-failure',
  //   video:      'retain-on-failure',
  //   trace:      'on-first-retry',
  // },
  // projects: [{ name: 'chromium', use: { channel: 'chrome' } }],
})