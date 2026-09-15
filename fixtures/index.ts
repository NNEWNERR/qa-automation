// fixtures/index.ts
import { test as base, Page } from '@playwright/test'
import { TodoPage } from '../pages/TodoPage'

type Fixtures = {
  todoPage: TodoPage
  adminPage: Page
  userPage: Page
}

export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    // clear localStorage before every test so todos don't bleed across runs
    await page.addInitScript(() => localStorage.clear())
    const todoPage = new TodoPage(page)
    await todoPage.goto('./')
    await use(todoPage)
  },

  adminPage: async ({ browser, baseURL }, use) => {
    const ctx = await browser.newContext({ storageState: 'auth/admin.json', baseURL })
    const page = await ctx.newPage()
    await use(page)
    await ctx.close()
  },

  userPage: async ({ browser, baseURL }, use) => {
    const ctx = await browser.newContext({ storageState: 'auth/user.json', baseURL })
    const page = await ctx.newPage()
    await use(page)
    await ctx.close()
  },
})

export { expect } from '@playwright/test'