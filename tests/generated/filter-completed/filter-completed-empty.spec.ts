// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Completed filter and #/completed route', { tag: ['@ui', '@agent'] }, () => {
  test('Completed filter with no completed items shows an empty list', async ({ todoPage, page }) => {
    // 1. Add 'A'. Click 'Completed'.
    await todoPage.addTodo('A')
    await todoPage.filterBy('Completed')
    await expect(page).toHaveURL(/#\/completed$/)
    await expect(todoPage.items).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Completed' })).toHaveClass(/selected/)
  })
})
