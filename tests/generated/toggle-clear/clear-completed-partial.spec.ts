// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Toggle-all and Clear completed', { tag: ['@ui', '@agent'] }, () => {
  test('Clear completed removes only completed items', async ({ todoPage }) => {
    const clearCompleted = todoPage.page.getByRole('button', { name: 'Clear completed' })

    // 1. Add 'Keep','Drop1','Drop2'; complete the two 'Drop' items.
    await todoPage.addTodo('Keep')
    await todoPage.addTodo('Drop1')
    await todoPage.addTodo('Drop2')
    await todoPage.completeTodo('Drop1')
    await todoPage.completeTodo('Drop2')
    await expect(clearCompleted).toBeVisible()
    await todoPage.expectCount(1)

    // 2. Click 'Clear completed'.
    await clearCompleted.click()
    await expect(todoPage.items).toHaveCount(1)
    await expect(todoPage.items).toHaveText(['Keep'])
    await expect(todoPage.items).not.toHaveClass(/completed/)
    await expect(clearCompleted).toBeHidden()
    await todoPage.expectCount(1)
  })
})
