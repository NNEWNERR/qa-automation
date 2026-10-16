// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Completed filter and #/completed route', { tag: ['@ui', '@agent'] }, () => {
  test('Direct navigation to #/completed applies the filter', async ({ todoPage, page, baseURL }) => {
    // 1. Add 'Active task' and 'Done task'; complete 'Done task'. Navigate hash-only to #/completed.
    await todoPage.addTodo('Active task')
    await todoPage.addTodo('Done task')
    await todoPage.completeTodo('Done task')
    await page.goto(baseURL + '#/completed')
    await expect(page).toHaveURL(/#\/completed$/)
    await expect(todoPage.items).toHaveCount(1)
    await todoPage.expectItemVisible('Done task')
    await todoPage.expectItemHidden('Active task')
    await expect(page.getByRole('link', { name: 'Completed' })).toHaveClass(/selected/)
  })
})
