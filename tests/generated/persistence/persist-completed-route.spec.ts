// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Persistence across reload', { tag: ['@ui', '@agent'] }, () => {
  test('Reload on #/completed keeps filter and data', async ({ todoPage }) => {
    const page = todoPage.page

    // 1. Add 'A','B'; complete 'A'; click 'Completed'; reload.
    await todoPage.addTodo('A')
    await todoPage.addTodo('B')
    await todoPage.completeTodo('A')
    await todoPage.filterBy('Completed')
    await page.reload()

    await expect(page).toHaveURL(/#\/completed$/)
    await expect(todoPage.items).toHaveCount(1)
    await expect(todoPage.items.first()).toHaveText('A')
    await expect(page.getByRole('link', { name: 'Completed' })).toHaveClass(/selected/)
  })
})
