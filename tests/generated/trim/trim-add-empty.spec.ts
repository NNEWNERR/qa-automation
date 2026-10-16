// spec: specs/todo-gaps.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../fixtures'

test.describe('Whitespace trimming on add and edit', { tag: ['@ui', '@agent'] }, () => {
  test('Empty input is not added', async ({ todoPage }) => {
    // 1. Focus the input and press Enter with no text.
    await todoPage.input.focus()
    await todoPage.input.press('Enter')

    await expect(todoPage.items).toHaveCount(0)
  })
})
