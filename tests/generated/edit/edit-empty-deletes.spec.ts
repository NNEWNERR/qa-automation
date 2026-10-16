// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Edit todo by double-click', { tag: ['@ui', '@agent'] }, () => {
  test('Editing to empty text deletes the item', async ({ todoPage }) => {
    // 1. Add todos 'Keep me' and 'Remove me'.
    await todoPage.addTodo('Keep me')
    await todoPage.addTodo('Remove me')
    await expect(todoPage.items).toHaveCount(2)

    // 2. Double-click 'Remove me', clear the edit box, press Enter.
    await todoPage.page.getByText('Remove me').dblclick()
    const editBox = todoPage.page.getByRole('textbox', { name: 'Edit' })
    await editBox.fill('')
    await editBox.press('Enter')
    await expect(todoPage.items).toHaveCount(1)
    await expect(todoPage.items.first()).toHaveText('Keep me')
    await expect(todoPage.page.getByText('Remove me')).toHaveCount(0)
    await todoPage.expectCount(1)
  })
})
