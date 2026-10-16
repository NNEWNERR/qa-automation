// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Persistence across reload', { tag: ['@ui', '@agent'] }, () => {
  test('Todos and completed state survive reload', async ({ todoPage }) => {
    const page = todoPage.page

    // 1. Add 'Persist A' and 'Persist B'; complete 'Persist A'.
    await todoPage.addTodo('Persist A')
    await todoPage.addTodo('Persist B')
    await todoPage.completeTodo('Persist A')
    await expect(todoPage.items).toHaveCount(2)
    await todoPage.expectCount(1)
    await expect
      .poll(() =>
        page.evaluate(() => JSON.parse(localStorage.getItem('react-todos') ?? '[]').length)
      )
      .toBe(2)

    // 2. Call page.reload().
    await page.reload()
    await expect(todoPage.items).toHaveCount(2)
    await expect(todoPage.items.nth(0)).toContainText('Persist A')
    await expect(todoPage.items.nth(1)).toContainText('Persist B')
    await expect(todoPage.items.filter({ hasText: 'Persist A' })).toHaveClass(/completed/)
    await todoPage.expectCount(1)
  })
})
