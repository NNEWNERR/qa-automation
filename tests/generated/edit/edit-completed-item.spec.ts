// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Edit todo by double-click', { tag: ['@ui', '@agent'] }, () => {
  test('Editing a completed item keeps it completed', async ({ todoPage }) => {
    const title = todoPage.page.getByTestId('todo-title')
    const editBox = todoPage.page.getByRole('textbox', { name: 'Edit' })

    // 1. Add 'Done task', mark complete, double-click title, fill 'Done task v2', press Enter.
    await todoPage.addTodo('Done task')
    await todoPage.completeTodo('Done task')
    await title.dblclick()
    await editBox.fill('Done task v2')
    await editBox.press('Enter')
    await expect(title).toHaveText('Done task v2')
    await expect(todoPage.items.first()).toHaveClass(/completed/)
    await todoPage.expectCount(0)
  })
})
