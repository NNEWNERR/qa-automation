// fixtures/index.ts
import { test as base } from '@playwright/test'
import { TodoPage } from '../pages/TodoPage'

type Fixtures = {
  todoPage: TodoPage
}

export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page)
    await todoPage.goto('https://demo.playwright.dev/todomvc')
    await use(todoPage)
    // teardown อยู่หลัง use() — รันหลัง test จบ
    // เช่น: await todoPage.screenshotOnFail('cleanup')
  }
})

export { expect } from '@playwright/test'