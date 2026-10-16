// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Toggle-all and Clear completed', { tag: ['@ui', '@agent'] }, () => {
  test('Toggle-all completes every item', async ({ todoPage }) => {
    // 1. Add 'One', 'Two', 'Three'.
    await todoPage.addTodo('One')
    await todoPage.addTodo('Two')
    await todoPage.addTodo('Three')
    await expect(todoPage.items).toHaveCount(3)
    await todoPage.expectCount(3)

    // 2. Click 'Mark all as complete'.
    await todoPage.page.getByText('Mark all as complete').click()
    await expect(todoPage.items).toHaveClass([/completed/, /completed/, /completed/])
    await todoPage.expectCount(0)
    await expect(todoPage.page.getByRole('button', { name: 'Clear completed' })).toBeVisible()
  })
})
