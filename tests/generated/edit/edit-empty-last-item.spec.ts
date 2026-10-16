// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Edit todo by double-click', { tag: ['@ui', '@agent'] }, () => {
  test('Editing the only item to empty removes the footer', async ({ todoPage }) => {
    // 1. Add todo 'Solo'. Double-click it, clear the edit box, press Enter.
    await todoPage.addTodo('Solo')
    await todoPage.page.getByTestId('todo-title').dblclick()
    const editBox = todoPage.page.getByRole('textbox', { name: 'Edit' })
    await editBox.fill('')
    await editBox.press('Enter')
    await expect(todoPage.items).toHaveCount(0)
    await expect(todoPage.page.locator('.todo-count')).toBeHidden()
    await expect(todoPage.page.getByRole('button', { name: 'Clear completed' })).toBeHidden()
    await expect(todoPage.page.getByRole('link', { name: 'All' })).toBeHidden()
    await expect(todoPage.page.getByRole('link', { name: 'Active' })).toBeHidden()
    await expect(todoPage.page.getByRole('link', { name: 'Completed' })).toBeHidden()
  })
})
