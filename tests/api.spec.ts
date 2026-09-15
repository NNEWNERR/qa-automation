import { test, expect } from '@playwright/test'
import type { JPUser, JPPost, ExecutedTest } from '../types'
import { toExecutedTest, generateReport } from '../utils/reporter'

/**
 * Contract-level checks against JSONPlaceholder.
 *
 * Doubles as the demo of the custom reporter in utils/reporter.ts: each test
 * feeds its TestInfo into a typed ExecutedTest, and afterAll prints the
 * aggregated SummaryReport.
 */
const executedTests: ExecutedTest[] = []

test.describe('JSONPlaceholder API', { tag: ['@api', '@regression'] }, () => {

  test.afterEach(async ({}, testInfo) => {
    executedTests.push(toExecutedTest(testInfo))
  })

  test('GET /users/1 returns a user matching the JPUser shape', async ({ request }) => {
    const res = await request.get('/users/1')
    expect(res.status()).toBe(200)

    const user: JPUser = await res.json()
    expect(user).toMatchObject({
      id: 1,
      name: expect.any(String),
      username: expect.any(String),
      email: expect.stringContaining('@'),
    })
  })

  test('GET /posts returns a list that can be filtered by userId', async ({ request }) => {
    const res = await request.get('/posts')
    expect(res.status()).toBe(200)

    const posts: JPPost[] = await res.json()
    expect(posts.length).toBeGreaterThan(10)

    const userPosts = posts.filter(p => p.userId === 1)
    expect(userPosts.length).toBeGreaterThan(0)
    expect(userPosts.every(p => p.title.length > 0)).toBe(true)
  })

  test('POST /posts echoes the payload back with a new id', async ({ request }) => {
    const payload = {
      title: 'QA Automation Test Post',
      body: 'Written by Playwright',
      userId: 1,
    }
    const res = await request.post('/posts', { data: payload })
    expect(res.status()).toBe(201)

    const created: JPPost = await res.json()
    expect(created.id).toBeTruthy()
    expect(created.title).toBe(payload.title)
  })

  test.afterAll(async () => {
    const report = generateReport(executedTests)
    console.log('\n══ API suite summary ══')
    console.log(`Total:    ${report.total}`)
    console.log(`Passed:   ${report.passed}  (${report.passRate}%)`)
    console.log(`Failed:   ${report.failed}`)
    console.log(`Avg time: ${report.avgDurationMs}ms`)
    console.log(`Slowest:  ${report.slowestTest}`)
    if (report.failedTitles.length > 0) {
      console.log(`Failed:   ${report.failedTitles.join(', ')}`)
    }
  })
})
