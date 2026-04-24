import { test as base, Page } from '@playwright/test'

type AuthFixtures = {
  adminPage: Page
  userPage:  Page
}

export const test = base.extend<AuthFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth/admin.json',
    })
    const page = await context.newPage()
    await use(page)
    await context.close()
  },

  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth/user.json',
    })
    const page = await context.newPage()
    await use(page)
    await context.close()
  },
})