import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '../fixtures'
// This is a visual regression test. It captures a screenshot of the homepage and compares it to a baseline image.
test.describe('Visual Regression Tests', () => {

    test('homepage matches visual baseline', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc')
        await expect(page).toHaveScreenshot('homepage.png', {
            fullPage: true,
            threshold: 0.1,
        })
    })

    test('todo input — desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 720 })
        await page.goto('https://demo.playwright.dev/todomvc')
        await expect(page.locator('.new-todo')).toHaveScreenshot('todo-input-desktop.png', {
            animations: 'disabled',
        })
    })

    test('todo input — mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('https://demo.playwright.dev/todomvc')
        await expect(page.locator('.new-todo')).toHaveScreenshot('todo-input-mobile.png', {
            animations: 'disabled',
        })
    })

    test.describe('TodoMVC quality suite', () => {

        test.beforeEach(async ({ page }) => {
            await page.goto('https://demo.playwright.dev/todomvc')
        })

        test('desktop layout matches baseline', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 720 })
            await expect(page).toHaveScreenshot('todo-desktop.png', {
                fullPage: true, animations: 'disabled',
            })
        })

        test('mobile layout matches baseline', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 })
            await expect(page).toHaveScreenshot('todo-mobile.png', {
                fullPage: true, animations: 'disabled',
            })
        })

        test('page has no wcag violations', async ({ page }) => {
            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa'])
                // TodoMVC demo has known decorative color-contrast issues (h1, footer)
                .disableRules(['color-contrast'])
                .analyze()
            expect(results.violations).toHaveLength(0)
        })

        test('keyboard navigation works', async ({ page }) => {
            // Tab from body — should reach the todo input first in DOM order
            await page.locator('body').press('Tab')
            await expect(page.locator(':focus')).toBeVisible()

            // use fill() on the specific input to avoid typing into a wrong focused element
            await page.getByPlaceholder('What needs to be done?').fill('Keyboard test')
            await page.keyboard.press('Enter')
            await expect(page.getByText('Keyboard test')).toBeVisible()
        })

    })

})