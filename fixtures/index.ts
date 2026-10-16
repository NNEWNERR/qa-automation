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
    // clear localStorage once per test so todos don't bleed across runs.
    // Init scripts re-run on every document load, reload included, so an
    // unguarded clear would wipe the app's own persistence mid-test. The
    // sessionStorage flag survives reload but not a new context (= new test).
    await page.addInitScript(() => {
      if (sessionStorage.getItem('qa:storage-cleared')) return
      localStorage.clear()
      sessionStorage.setItem('qa:storage-cleared', '1')
    })
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