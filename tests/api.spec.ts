import { test, expect } from '@playwright/test'
import type { JPUser, JPPost, ExecutedTest } from '../types'
// เพิ่ม 2 บรรทัดนี้:
import { toExecutedTest, generateReport } from '../utils/reporter'
const executedTests: ExecutedTest[] = []  // ← เก็บผลทุก test
const results: string[] = []

test.describe('JSONPlaceholder API', () => {

    test.beforeEach(async ({ }, testInfo) => {
        console.log(`→ Running: ${testInfo.title}`)
    })

    // test.afterEach(async ({ }, testInfo) => {
    //     results.push(`${testInfo.status === 'passed' ? '✓' : '✗'} ${testInfo.title}`)
    // })

    // เปลี่ยน afterEach ให้ใช้ reporter:
    test.afterEach(async ({ }, testInfo) => {
        executedTests.push(toExecutedTest(testInfo))  // ← wire!
    })

    // ── Test 1 ──────────────────────────────────────
    test('GET /users/1 — returns valid user', async ({ request }) => {
        const res = await request.get('/users/1')
        expect(res.status()).toBe(200)

        const user: JPUser = await res.json()
        expect(user.id).toBe(1)
        expect(user.email).toContain('@')
        expect(user.name).toBeTruthy()
    })

    // ── Test 2 ──────────────────────────────────────
    test('GET /posts — list is non-empty and filterable', async ({ request }) => {
        const res = await request.get('/posts')
        expect(res.status()).toBe(200)

        const posts: JPPost[] = await res.json()
        expect(posts.length).toBeGreaterThan(10)

        const userPosts = posts.filter(p => p.userId === 1)
        expect(userPosts.length).toBeGreaterThan(0)
        userPosts.every(p => expect(p.title).toBeTruthy())
    })

    // ── Test 3 ──────────────────────────────────────
    test('POST /posts — creates and returns new post', async ({ request }) => {
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

    // test.afterAll(async () => {
    //     console.log('\\n── Test Results ──')
    //     results.forEach(r => console.log(r))
    // })

    // เปลี่ยน afterAll ให้ print report:
    test.afterAll(async () => {
        const report = generateReport(executedTests)
        console.log('\n══ Week 1 Summary Report ══')
        console.log(`Total:    ${report.total}`)
        console.log(`Passed:   ${report.passed}  (${report.passRate}%)`)
        console.log(`Failed:   ${report.failed}`)
        console.log(`Avg time: ${report.avgDurationMs}ms`)
        console.log(`Slowest:  ${report.slowestTest}`)
        if (report.failedTitles.length > 0)
            console.log(`Failed:   ${report.failedTitles.join(', ')}`)
    })
})