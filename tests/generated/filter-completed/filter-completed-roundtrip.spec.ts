// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Completed filter and #/completed route', { tag: ['@ui', '@agent'] }, () => {
  test('Switching All → Completed → All restores the full list', async ({ todoPage, page }) => {
    // 1. Add 'A','B'; complete 'A'. Click 'Completed', then 'All'.
    await todoPage.addTodo('A')
    await todoPage.addTodo('B')
    await todoPage.completeTodo('A')

    await todoPage.filterBy('Completed')
    await expect(todoPage.items).toHaveCount(1)
    await expect(todoPage.items.first()).toContainText('A')

    await todoPage.filterBy('All')
    await expect(page).toHaveURL(/#\/$/)
    await expect(todoPage.items).toHaveCount(2)
    await expect(page.getByRole('link', { name: 'All' })).toHaveClass(/selected/)
  })
})
