import { test, expect } from '@playwright/test'

// Smoke: are the targets up at all? No business-logic assertions here —
// those belong in api.spec.ts / todo.spec.ts. Keep this suite fast enough to
// gate the rest of the run.
test('API is reachable', { tag: ['@smoke', '@api'] }, async ({ request }) => {
  const res = await request.get('/users/1')
  expect(res.ok()).toBe(true)
})

test('web app loads', { tag: ['@smoke', '@ui'] }, async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc')
  await expect(page).toHaveTitle(/TodoMVC/)
  await expect(
    page.getByPlaceholder('What needs to be done?')
  ).toBeVisible()
})