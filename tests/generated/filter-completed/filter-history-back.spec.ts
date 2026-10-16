// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Completed filter and #/completed route', { tag: ['@ui', '@agent'] }, () => {
  test('Browser Back returns to previous filter', async ({ todoPage, page }) => {
    // 1. Add 'A'; complete it. Click 'Completed', then go back.
    await todoPage.addTodo('A')
    await todoPage.completeTodo('A')
    await todoPage.filterBy('Completed')
    await expect(page).toHaveURL(/#\/completed$/)

    await page.goBack()

    await expect(page).toHaveURL(/#\/$/)
    await expect(page.getByRole('link', { name: 'All' })).toHaveClass(/selected/)
    await todoPage.expectItemVisible('A')
  })
})
