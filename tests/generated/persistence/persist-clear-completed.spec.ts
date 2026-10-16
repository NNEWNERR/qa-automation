// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Persistence across reload', { tag: ['@ui', '@agent'] }, () => {
  test('Clear completed persists across reload', async ({ todoPage }) => {
    const page = todoPage.page

    // 1. Add 'A','B'; complete 'A'; click 'Clear completed'; reload.
    await todoPage.addTodo('A')
    await todoPage.addTodo('B')
    await todoPage.completeTodo('A')
    await page.getByRole('button', { name: 'Clear completed' }).click()
    await expect(todoPage.items).toHaveCount(1)
    await page.reload()

    await expect(todoPage.items).toHaveCount(1)
    await expect(todoPage.items.first()).toHaveText('B')
    await todoPage.expectItemHidden('A')
  })
})
