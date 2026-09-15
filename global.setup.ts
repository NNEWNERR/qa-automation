import { Browser, chromium } from '@playwright/test'
import * as fs from 'fs'
import { appBaseURL, isAppReachable } from './utils/appAvailability'

const EMPTY_STATE = JSON.stringify({ cookies: [], origins: [] })

/**
 * Logs in once per role and stores the session, so `adminPage` / `userPage`
 * fixtures can start authenticated instead of replaying the login UI per test.
 *
 * When the app isn't running we write empty storage states and return: the
 * fixtures still construct, and login.spec.ts skips itself.
 */
async function globalSetup() {
  const baseURL = appBaseURL()

  if (!(await isAppReachable(baseURL))) {
    console.warn(`\n⚠  Auth setup skipped — no app on ${baseURL}; login tests will skip.\n`)
    return writeEmptyStates()
  }

  const browser = await chromium.launch()
  try {
    await loginAs(browser, baseURL, 'admin', '123456', 'auth/admin.json')
    await loginAs(browser, baseURL, 'user', 'password', 'auth/user.json')
  } catch (e) {
    console.warn(`\n⚠  Auth setup failed — ${(e as Error).message}\n`)
    writeEmptyStates()
  } finally {
    await browser.close()
  }
}

function writeEmptyStates() {
  fs.mkdirSync('auth', { recursive: true })
  fs.writeFileSync('auth/admin.json', EMPTY_STATE)
  fs.writeFileSync('auth/user.json', EMPTY_STATE)
}

async function loginAs(
  browser: Browser,
  baseURL: string,
  username: string,
  password: string,
  savePath: string,
) {
  const ctx = await browser.newContext({ baseURL })
  const page = await ctx.newPage()
  await page.goto('/login')
  // ion-input renders <input> inside shadow DOM — pierce with descendant CSS selector
  await page.locator('[data-testid="username"] input').fill(username)
  await page.locator('[data-testid="password"] input').fill(password)
  await page.getByTestId('login-btn').click()
  await page.waitForURL('**/dashboard')
  await ctx.storageState({ path: savePath })
  await ctx.close()
}

export default globalSetup
