import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    // ลบ baseURL ออกจาก global use
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
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
  ],
  // use: {
  //   baseURL: 'https://demo.playwright.dev/todomvc',
  //   screenshot: 'only-on-failure',
  //   video:      'retain-on-failure',
  //   trace:      'on-first-retry',
  // },
  // projects: [{ name: 'chromium', use: { channel: 'chrome' } }],
})