// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Whitespace trimming on add and edit', { tag: ['@ui', '@agent'] }, () => {
  test('Inner spaces are preserved on add', async ({ todoPage }) => {
    // 1. Fill input with '  a  b  ' and press Enter.
    await todoPage.addTodo('  a  b  ')

    // Regex matches raw text content; string matching would collapse the inner double space.
    await expect(todoPage.items.getByTestId('todo-title')).toHaveText(/^a {2}b$/)
  })
})
