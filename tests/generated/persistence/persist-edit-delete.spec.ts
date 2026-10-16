// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Persistence across reload', { tag: ['@ui', '@agent'] }, () => {
  test('Edits and deletions persist across reload', async ({ todoPage }) => {
    const page = todoPage.page

    // 1. Add 'X','Y'; edit 'X' to 'X edited'; delete 'Y'. Reload.
    await todoPage.addTodo('X')
    await todoPage.addTodo('Y')
    await page.getByText('X', { exact: true }).dblclick()
    const editBox = page.getByRole('textbox', { name: 'Edit' })
    await editBox.fill('X edited')
    await editBox.press('Enter')
    await todoPage.deleteTodo('Y')
    await expect(todoPage.items).toHaveCount(1)
    await page.reload()

    await expect(todoPage.items).toHaveCount(1)
    await expect(todoPage.items.first()).toHaveText('X edited')
    await todoPage.expectItemHidden('Y')
  })
})
