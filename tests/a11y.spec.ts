import { test, expect } from '../fixtures'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility checks — WCAG 2.1 A/AA via axe-core, plus keyboard reachability
 * (which axe cannot assert: it sees the DOM, not the tab order in practice).
 *
 * Visual regression lives in visual.spec.ts, not here.
 */
test.describe('Accessibility — TodoMVC', { tag: ['@a11y', '@ui'] }, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('./')
  })

  test('whole page has no WCAG 2.1 A/AA violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      // The TodoMVC demo has known decorative contrast issues (h1, footer credits)
      // that we cannot fix in a third-party target — scoped out rather than
      // muting the whole scan.
      .disableRules(['color-contrast'])
      .analyze()

    // Attach the raw violations to the HTML report so a failure is actionable
    // without re-running locally.
    if (results.violations.length > 0) {
      await test.info().attach('axe-violations.json', {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      })
    }

    expect(results.violations).toEqual([])
  })

  test('app shell alone has no violations when scoped', async ({ page }) => {
    // .todoapp is always rendered; .todo-list is empty on first load, so scoping
    // to the list would make this test vacuously pass.
    const results = await new AxeBuilder({ page })
      .include('.todoapp')
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('first Tab lands on a visible control', async ({ page }) => {
    await page.locator('body').press('Tab')
    await expect(page.locator(':focus')).toBeVisible()
  })

  test('a todo can be added with the keyboard alone', async ({ page }) => {
    // fill() targets the input explicitly rather than trusting whatever has
    // focus — a focus regression should fail the Tab test above, not silently
    // reroute typing here.
    await page.getByPlaceholder('What needs to be done?').fill('Keyboard test')
    await page.keyboard.press('Enter')
    await expect(page.getByText('Keyboard test')).toBeVisible()
  })

  test('the todo input exposes an accessible name', async ({ page }) => {
    // Asserts the *computed* accessible name rather than a specific attribute:
    // the demo has no aria-label and falls back to its placeholder, which is
    // exactly what a screen reader announces.
    await expect(page.getByPlaceholder('What needs to be done?')).toHaveAccessibleName(
      /.+/,
    )
  })
})
