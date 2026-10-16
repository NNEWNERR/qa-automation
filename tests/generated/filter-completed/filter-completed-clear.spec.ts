// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Completed filter and #/completed route', { tag: ['@ui', '@agent'] }, () => {
  test('Clear completed while on Completed filter', async ({ todoPage, page }) => {
    // 1. Add 'A','B'; complete 'A'; click 'Completed'; click 'Clear completed'.
    await todoPage.addTodo('A')
    await todoPage.addTodo('B')
    await todoPage.completeTodo('A')
    await todoPage.filterBy('Completed')
    await page.getByRole('button', { name: 'Clear completed' }).click()

    await expect(todoPage.items).toHaveCount(0)
    await expect(page).toHaveURL(/#\/completed$/)

    await todoPage.filterBy('All')
    await expect(todoPage.items).toHaveCount(1)
    await expect(todoPage.items.first()).toContainText('B')
  })
})
