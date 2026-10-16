// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Whitespace trimming on add and edit', { tag: ['@ui', '@agent'] }, () => {
  test('Leading and trailing spaces are trimmed on edit', async ({ todoPage }) => {
    // 1. Add 'Plain'. Double-click it, fill '   Trimmed edit   ', press Enter.
    await todoPage.addTodo('Plain')
    await todoPage.items.getByTestId('todo-title').dblclick()
    const editBox = todoPage.items.getByRole('textbox', { name: 'Edit' })
    await editBox.fill('   Trimmed edit   ')
    await editBox.press('Enter')

    await expect(todoPage.items.getByTestId('todo-title')).toHaveText(/^Trimmed edit$/)
    await expect(todoPage.items).toHaveCount(1)
  })
})
