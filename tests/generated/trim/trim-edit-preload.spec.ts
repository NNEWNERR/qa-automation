// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Whitespace trimming on add and edit', { tag: ['@ui', '@agent'] }, () => {
  test('Edit box preloads the trimmed value', async ({ todoPage }) => {
    // 1. Add '  Spaced  '. Double-click the item.
    await todoPage.addTodo('  Spaced  ')
    await todoPage.items.getByTestId('todo-title').dblclick()

    await expect(todoPage.items.getByRole('textbox', { name: 'Edit' })).toHaveValue('Spaced')
  })
})
