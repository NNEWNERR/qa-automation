// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Edit todo by double-click', { tag: ['@ui', '@agent'] }, () => {
  test('Escape cancels edit and keeps original text', async ({ todoPage }) => {
    const title = todoPage.page.getByTestId('todo-title')
    const editBox = todoPage.page.getByRole('textbox', { name: 'Edit' })

    // 1. Add todo 'Original'. Double-click it, fill edit box with 'Changed', press Escape.
    await todoPage.addTodo('Original')
    await title.dblclick()
    await editBox.fill('Changed')
    await editBox.press('Escape')
    await expect(editBox).toBeHidden()
    await expect(title).toHaveText('Original')
    await expect(todoPage.page.getByText('Changed')).toHaveCount(0)
    await expect(todoPage.items).toHaveCount(1)
  })
})
