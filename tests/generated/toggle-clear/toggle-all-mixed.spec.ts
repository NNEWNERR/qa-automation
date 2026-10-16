// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Toggle-all and Clear completed', { tag: ['@ui', '@agent'] }, () => {
  test('Toggle-all with mixed state completes the remaining items', async ({ todoPage }) => {
    // 1. Add 'A','B','C'; complete 'A'. Click 'Mark all as complete'.
    await todoPage.addTodo('A')
    await todoPage.addTodo('B')
    await todoPage.addTodo('C')
    await todoPage.completeTodo('A')
    await todoPage.page.getByText('Mark all as complete').click()
    await expect(todoPage.items).toHaveClass([/completed/, /completed/, /completed/])
    await todoPage.expectCount(0)
  })
})
