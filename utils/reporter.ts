// utils/reporter.ts
import type { TestInfo } from '@playwright/test'
import type {
    ExecutedTest, TestStatus, TestResult, SummaryReport
} from '../types'

// map Playwright status → TestStatus union
function toStatus(s: TestInfo['status']): TestStatus {
    if (s === 'passed') return 'passed'
    if (s === 'failed') return 'failed'
    if (s === 'skipped') return 'skipped'
    return 'pending'
}

// เขียน toExecutedTest ด้านล่าง:
export function toExecutedTest(info: TestInfo): ExecutedTest {
    const result: TestResult = info.error
        ? {
            status: 'failed',
            durationMs: info.duration,
            errorMessage: info.error.message ?? String(info.error),
            stackTrace: info.error.stack,
        }
        : {
            status: 'passed',
            durationMs: info.duration,
        }

    return {
        id: info.testId,
        title: info.title,
        status: toStatus(info.status),
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
        result,
        executedAt: new Date(),
        runnerVersion: '1.0',
        retryCount: info.retry,
    }
}

export function generateReport(tests: ExecutedTest[]): SummaryReport {
    const passed = tests.filter(t => t.result.status === 'passed').length
    const failed = tests.filter(t => t.result.status === 'failed').length
    const skipped = tests.filter(t => t.result.status === 'skipped').length
    const totalMs = tests.reduce((sum, t) => sum + t.result.durationMs, 0)
    const slowest = tests.reduce((max, t) =>
        t.result.durationMs > max.result.durationMs ? t : max
    )
    return {
        total: tests.length,
        passed, failed, skipped,
        passRate: tests.length === 0 ? 0 : Math.round(passed / tests.length * 100),
        avgDurationMs: tests.length === 0 ? 0 : Math.round(totalMs / tests.length),
        slowestTest: slowest.title,
        failedTitles: tests.filter(t => t.result.status === 'failed').map(t => t.title),
        env: 'staging',
        generatedAt: new Date(),
    }
}