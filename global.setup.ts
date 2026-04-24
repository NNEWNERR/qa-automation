import { Browser, chromium, FullConfig } from '@playwright/test'
import * as fs from 'fs'

async function globalSetup(config: FullConfig) {
    const baseURL = config.projects.find(p => p.name === 'login-tests')?.use?.baseURL ?? 'http://localhost:8100'
    const browser = await chromium.launch()
    try {
        await loginAs(browser, baseURL, 'admin', '123456', 'auth/admin.json')
        await loginAs(browser, baseURL, 'user', 'password', 'auth/user.json')
    } catch (e) {
        // App not reachable or login failed — write empty stubs so fixtures don't crash.
        console.warn(`\n⚠  Auth setup skipped — ${(e as Error).message}\n`)
        const emptyState = JSON.stringify({ cookies: [], origins: [] })
        fs.mkdirSync('auth', { recursive: true })
        fs.writeFileSync('auth/admin.json', emptyState)
        fs.writeFileSync('auth/user.json', emptyState)
    } finally {
        await browser.close()
    }
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
