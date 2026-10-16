// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Toggle-all and Clear completed', { tag: ['@ui', '@agent'] }, () => {
  test('Toggle-all a second time reactivates all items', async ({ todoPage }) => {
    // 1. Add 'A','B'. Click toggle-all twice.
    await todoPage.addTodo('A')
    await todoPage.addTodo('B')
    const toggleAll = todoPage.page.getByText('Mark all as complete')
    await toggleAll.click()
    await toggleAll.click()
    await expect(todoPage.page.locator('.todo-list li.completed')).toHaveCount(0)
    await expect(todoPage.items).toHaveCount(2)
    await todoPage.expectCount(2)
    await expect(todoPage.page.getByRole('button', { name: 'Clear completed' })).toBeHidden()
  })
})
