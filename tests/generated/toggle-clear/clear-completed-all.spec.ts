// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Toggle-all and Clear completed', { tag: ['@ui', '@agent'] }, () => {
  test('Clear completed after toggle-all empties list and hides footer', async ({ todoPage }) => {
    // 1. Add 'A','B'; click toggle-all; click 'Clear completed'.
    await todoPage.addTodo('A')
    await todoPage.addTodo('B')
    await todoPage.page.getByText('Mark all as complete').click()
    await todoPage.page.getByRole('button', { name: 'Clear completed' }).click()
    await expect(todoPage.items).toHaveCount(0)
    await expect(todoPage.page.locator('.todo-count')).toBeHidden()
    await expect(todoPage.page.getByRole('link', { name: 'All' })).toBeHidden()
    await expect(todoPage.page.getByRole('link', { name: 'Active' })).toBeHidden()
    await expect(todoPage.page.getByRole('link', { name: 'Completed' })).toBeHidden()
    await expect(todoPage.input).toBeVisible()
    await expect(todoPage.input).toHaveValue('')
  })
})
