import { test, expect } from '../fixtures'
import { appBaseURL, isAppReachable } from '../utils/appAvailability'

const BASE_URL = appBaseURL()

/**
 * Role-based access tests against a local Ionic app.
 *
 * Unlike the rest of the suite these need an app running on BASE_URL, so they
 * skip (not fail) when nothing is listening — `npm test` stays green on a fresh
 * clone and in CI. Point BASE_URL at a running app to exercise them:
 *   BASE_URL=http://localhost:8100 npm run test:login
 */
test.describe('Auth flow', { tag: ['@regression', '@local-app'] }, () => {

  test.beforeEach(async () => {
    test.skip(
      !(await isAppReachable(BASE_URL)),
      `No app listening on ${BASE_URL} — set BASE_URL to a running instance.`,
    )
  })

  test('admin reaches dashboard after login', async ({ adminPage }) => {
    await adminPage.goto('/dashboard')
    await expect(adminPage).toHaveURL(/\/dashboard/)
    await expect(adminPage.locator('ion-title').first()).toContainText('dashboard')
  })

  test('user reaches dashboard after login', async ({ userPage }) => {
    await userPage.goto('/dashboard')
    await expect(userPage).toHaveURL(/\/dashboard/)
    await expect(userPage.locator('ion-title').first()).toContainText('dashboard')
  })

  test('guest is redirected to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})
