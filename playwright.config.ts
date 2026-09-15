import { defineConfig } from '@playwright/test'

const isCI = !!process.env.CI

/**
 * Shared settings for the JSONPlaceholder API projects.
 * Declared once so a header change can't drift between projects.
 */
const jsonPlaceholder = {
  baseURL: 'https://jsonplaceholder.typicode.com',
  extraHTTPHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}

/**
 * Locally we drive real Google Chrome (closer to what users run); CI installs
 * only chromium, so the channel is dropped there rather than failing to launch
 * a browser the runner may not ship.
 */
const browserChannel = isCI ? undefined : 'chrome'

const todoMvc = {
  // Trailing slash matters: relative navigation resolves against it, so
  // without it './' would land on the site root instead of the app.
  baseURL: 'https://demo.playwright.dev/todomvc/',
  channel: browserChannel,
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? '50%' : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },

  // CI runs sharded, so each shard emits a blob report that `merge-reports`
  // stitches back into one HTML report. Locally we want the HTML report directly.
  reporter: isCI
    ? [['blob'], ['list']]
    : [['html', { open: 'never' }], ['list']],

  globalSetup: './global.setup.ts',

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:8100',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 5_000,
  },

  projects: [
    {
      name: 'smoke',
      testMatch: '**/smoke.spec.ts',
      use: { ...jsonPlaceholder, channel: browserChannel },
    },
    {
      name: 'api-tests',
      testMatch: '**/api.spec.ts',
      use: jsonPlaceholder,
    },
    {
      name: 'user-crud-tests',
      testMatch: '**/user-crud.spec.ts',
      use: { ...jsonPlaceholder, channel: browserChannel },
    },
    {
      name: 'ui-tests',
      testMatch: '**/todo.spec.ts',
      use: todoMvc,
    },
    {
      name: 'a11y-tests',
      testMatch: '**/a11y.spec.ts',
      use: todoMvc,
    },
    {
      // Screenshot baselines are OS-specific (font rendering differs between
      // win32 and the Linux CI runner), so CI excludes this project via
      // `--grep-invert @visual`. See README → "Visual tests and CI".
      name: 'visual-tests',
      testMatch: '**/visual.spec.ts',
      use: todoMvc,
    },
    {
      // Requires a local app on BASE_URL (default :8100). The suite skips
      // itself when that app isn't reachable — see tests/login.spec.ts.
      name: 'login-tests',
      testMatch: '**/login.spec.ts',
      use: {
        baseURL: process.env.BASE_URL ?? 'http://localhost:8100',
        channel: browserChannel,
      },
    },
  ],
})
