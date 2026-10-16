// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Edit todo by double-click', { tag: ['@ui', '@agent'] }, () => {
  test('Edit box with only spaces is treated as empty and deletes the item', async ({ todoPage }) => {
    // 1. Add todo 'Spacey'. Double-click it, fill edit box with '   ' (3 spaces), press Enter.
    await todoPage.addTodo('Spacey')
    await todoPage.page.getByTestId('todo-title').dblclick()
    const editBox = todoPage.page.getByRole('textbox', { name: 'Edit' })
    await editBox.fill('   ')
    await editBox.press('Enter')
    await expect(todoPage.items).toHaveCount(0)
  })
})
