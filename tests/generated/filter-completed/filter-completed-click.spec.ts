// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Completed filter and #/completed route', { tag: ['@ui', '@agent'] }, () => {
  test('Completed filter shows only completed items and updates URL', async ({ todoPage, page }) => {
    // 1. Add 'Active task' and 'Done task'; complete 'Done task'.
    await todoPage.addTodo('Active task')
    await todoPage.addTodo('Done task')
    await todoPage.completeTodo('Done task')
    await expect(todoPage.items).toHaveCount(2)

    // 2. Click the 'Completed' link.
    await todoPage.filterBy('Completed')
    await expect(page).toHaveURL(/#\/completed$/)
    await expect(todoPage.items).toHaveCount(1)
    await todoPage.expectItemVisible('Done task')
    await todoPage.expectItemHidden('Active task')
    await expect(page.getByRole('link', { name: 'Completed' })).toHaveClass(/selected/)
    await todoPage.expectCount(1)
  })
})
