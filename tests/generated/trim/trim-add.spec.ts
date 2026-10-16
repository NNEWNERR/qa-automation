// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Whitespace trimming on add and edit', { tag: ['@ui', '@agent'] }, () => {
  test('Leading and trailing spaces are trimmed on add', async ({ todoPage }) => {
    // 1. Fill input with '   Padded title   ' and press Enter.
    await todoPage.addTodo('   Padded title   ')

    await expect(todoPage.items).toHaveCount(1)
    await expect(todoPage.items.getByTestId('todo-title')).toHaveText(/^Padded title$/)
    await expect(todoPage.input).toHaveValue('')
  })
})
