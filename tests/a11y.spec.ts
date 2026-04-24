import { test, expect } from '../fixtures'
import AxeBuilder from '@axe-core/playwright'

// This test captures a screenshot of the navigation header with dynamic content masked out, and compares it to a baseline image.
test.describe('Accessibility Tests', () => {

    test('navigation snapshot with masked content', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc')
        const nav = page.locator('header')
        await expect(nav).toHaveScreenshot('navigation.png', {
            mask: [page.locator('.timestamp'), page.locator('.live-count')],
        })
    })

    test('homepage has no a11y violations V.1', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc')

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            // TodoMVC demo has known decorative color-contrast issues (h1, footer)
            // that are outside our control — exclude from this scan
            .disableRules(['color-contrast'])
            .analyze()

        if (results.violations.length > 0) {
            console.log('A11y violations:', JSON.stringify(results.violations, null, 2))
        }

        expect(results.violations).toHaveLength(0)
    })

    test('homepage has no a11y violations V.2', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc')

        // scope scan to the app shell (.todoapp is always present, unlike .todo-list which is empty by default)
        const results = await new AxeBuilder({ page })
            .include('.todoapp')
            .withTags(['wcag2a', 'wcag2aa'])
            .disableRules(['color-contrast'])
            .analyze()

        expect(results.violations).toHaveLength(0)

        // keyboard nav
        await page.keyboard.press('Tab')
        await expect(page.locator(':focus')).toBeVisible()

        // accessible label
        await expect(
            page.getByPlaceholder('What needs to be done?')
        ).toHaveAttribute('placeholder')
    })
})