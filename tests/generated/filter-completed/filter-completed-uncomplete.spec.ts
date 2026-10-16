// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Completed filter and #/completed route', { tag: ['@ui', '@agent'] }, () => {
  test('Completing an item in the Completed view keeps list consistent; un-completing removes it from view', async ({ todoPage, page }) => {
    // 1. Add 'A'; complete it; click 'Completed'; uncheck 'A'.
    await todoPage.addTodo('A')
    await todoPage.completeTodo('A')
    await todoPage.filterBy('Completed')
    await expect(todoPage.items).toHaveCount(1)

    // click(), not uncheck(): the item leaves the Completed view on click, so
    // uncheck()'s post-action "is it unchecked?" check waits on a detached node.
    await todoPage.items
      .filter({ hasText: 'A' })
      .getByRole('checkbox', { name: 'Toggle Todo' })
      .click()

    await expect(todoPage.items).toHaveCount(0)
    await todoPage.expectCount(1)
  })
})
