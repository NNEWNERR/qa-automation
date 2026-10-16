// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Edit todo by double-click', { tag: ['@ui', '@agent'] }, () => {
  test('Enter saves edited text', async ({ todoPage }) => {
    const title = todoPage.page.getByTestId('todo-title')
    const editBox = todoPage.page.getByRole('textbox', { name: 'Edit' })

    // 1. Add todo 'Buy milk'.
    await todoPage.addTodo('Buy milk')
    await expect(todoPage.items).toHaveCount(1)
    await expect(title).toHaveText('Buy milk')

    // 2. Double-click the 'Buy milk' title.
    await title.dblclick()
    await expect(todoPage.items.first()).toHaveClass(/editing/)
    await expect(editBox).toBeVisible()
    await expect(editBox).toHaveValue('Buy milk')

    // 3. Fill the edit textbox with 'Buy oat milk' and press Enter.
    await editBox.fill('Buy oat milk')
    await editBox.press('Enter')
    await expect(editBox).toBeHidden()
    await expect(title).toHaveText('Buy oat milk')
    await expect(todoPage.items.filter({ hasText: 'Buy milk' })).toHaveCount(0)
    await expect(todoPage.items).toHaveCount(1)
  })
})
