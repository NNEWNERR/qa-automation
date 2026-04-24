import { Page } from "@playwright/test"

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(path: string) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' })
  }

  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded')
  }

  async screenshotOnFail(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` })
  }
}