// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Toggle-all and Clear completed', { tag: ['@ui', '@agent'] }, () => {
  test('Completing every item individually checks toggle-all', async ({ todoPage }) => {
    const toggleAll = todoPage.page.getByRole('checkbox', { name: /Mark all as complete/ })

    // 1. Add 'A','B'; check each item's checkbox.
    await todoPage.addTodo('A')
    await todoPage.addTodo('B')
    await todoPage.completeTodo('A')
    await todoPage.completeTodo('B')
    await expect(toggleAll).toBeChecked()

    // 2. Uncheck 'A'.
    await todoPage.items.filter({ hasText: 'A' }).getByRole('checkbox').uncheck()
    await expect(toggleAll).not.toBeChecked()
    await todoPage.expectCount(1)
  })
})
