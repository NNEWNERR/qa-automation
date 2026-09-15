import { test, expect } from '../fixtures'

/**
 * Visual regression — pixel baselines for the TodoMVC demo.
 *
 * Baselines are per-OS (Playwright suffixes the platform) because font
 * rasterisation differs between Windows and the Linux CI image. CI therefore
 * excludes this suite with `--grep-invert @visual`; see README → "Visual tests
 * and CI" for how to regenerate baselines inside the Playwright container.
 *
 * Accessibility assertions live in a11y.spec.ts, not here.
 */
test.describe('Visual regression — TodoMVC', { tag: ['@visual', '@ui'] }, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('./')
  })

  test('homepage matches baseline', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.1,
    })
  })

  test('header matches baseline with dynamic regions masked', async ({ page }) => {
    // Masking keeps a live counter from turning every run into a diff. The
    // counter sits outside <header>, so this is the pattern applied to a real
    // dynamic node rather than a placeholder selector.
    await expect(page.locator('header')).toHaveScreenshot('navigation.png', {
      mask: [page.locator('.todo-count')],
    })
  })

  test('todo input matches baseline — desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await expect(page.locator('.new-todo')).toHaveScreenshot('todo-input-desktop.png', {
      animations: 'disabled',
    })
  })

  test('todo input matches baseline — mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('.new-todo')).toHaveScreenshot('todo-input-mobile.png', {
      animations: 'disabled',
    })
  })

  test('full layout matches baseline — desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await expect(page).toHaveScreenshot('todo-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('full layout matches baseline — mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page).toHaveScreenshot('todo-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })
})
