// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Whitespace trimming on add and edit', { tag: ['@ui', '@agent'] }, () => {
  test('Whitespace-only input is not added', async ({ todoPage }) => {
    // 1. Fill input with '     ' and press Enter.
    await todoPage.addTodo('     ')

    await expect(todoPage.items).toHaveCount(0)
    await expect(todoPage.page.locator('.todo-count')).toBeHidden()
  })
})
