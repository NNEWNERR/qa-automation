import { test, expect } from '../fixtures'

// Seed for the Playwright Test Agents (see README → "Playwright Test Agents").
// The planner and generator run this test first and take over the page it
// leaves behind, so it defines the starting state every generated test assumes:
// TodoMVC open, localStorage cleared, empty list. It goes through the same
// `todoPage` fixture as the hand-written specs so both start identically.
test.describe('Seed', { tag: ['@agent'] }, () => {
  test('seed', async ({ todoPage }) => {
    await expect(todoPage.input).toBeVisible()
    await expect(todoPage.items).toHaveCount(0)
  })
})
