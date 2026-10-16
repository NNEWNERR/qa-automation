// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Toggle-all and Clear completed', { tag: ['@ui', '@agent'] }, () => {
  test('Clear completed button is absent when nothing is completed', async ({ todoPage }) => {
    // 1. Add 'A'.
    await todoPage.addTodo('A')
    await expect(todoPage.page.locator('.todo-count')).toBeVisible()
    await expect(todoPage.page.getByRole('button', { name: 'Clear completed' })).toHaveCount(0)
  })
})
