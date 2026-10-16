// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Edit todo by double-click', { tag: ['@ui', '@agent'] }, () => {
  test('Clicking outside while editing saves (blur)', async ({ todoPage }) => {
    const title = todoPage.page.getByTestId('todo-title')
    const editBox = todoPage.page.getByRole('textbox', { name: 'Edit' })

    // 1. Add todo 'Before'. Double-click it, fill 'After', then click the new-todo input.
    await todoPage.addTodo('Before')
    await title.dblclick()
    await editBox.fill('After')
    await todoPage.input.click()
    await expect(editBox).toBeHidden()
    await expect(title).toHaveText('After')
    await expect(todoPage.items).toHaveCount(1)
  })
})
