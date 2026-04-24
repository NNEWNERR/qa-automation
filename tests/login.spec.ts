import { test, expect } from '../fixtures'

test.describe('Auth flow', () => {

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
