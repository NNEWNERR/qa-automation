// types/index.ts
// กฎ: ทุก type ใน project import มาจากที่นี่ที่เดียว
// ห้าม declare type ใน .spec.ts โดยตรง

// ─── Section 1: Primitives ────────────────────────────────────────────────
// union type แทน string ดิบ — ทำให้ typo กลายเป็น compile error ทันที

export type TestStatus  = 'passed' | 'failed' | 'skipped' | 'pending'
export type Priority    = 'low' | 'medium' | 'high' | 'critical'
export type Environment = 'local' | 'staging' | 'production'
export type HttpMethod  = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// ─── Section 2: Core entities ─────────────────────────────────────────────
// interface (ไม่ใช่ type alias) เพราะต้องการ extends ใน section ถัดไป

export interface TestCase {
  id:           string
  title:        string
  status:       TestStatus
  priority:     Priority
  description?: string
  tags?:        string[]
  createdAt:    Date
  updatedAt:    Date
}

export interface TestSuite {
  id:        string
  name:      string
  cases:     TestCase[]
  env:       Environment
  createdAt: Date
}

// ─── Section 3: Results (discriminated union) ──────────────────────────────
// pattern นี้ทำให้ TypeScript narrow type อัตโนมัติ
// พอ if (result.status === 'failed') → errorMessage พร้อมใช้เลย ไม่ต้อง cast

export type PassedResult = {
  status:      'passed'
  durationMs:  number
  screenshot?: string
}

export type FailedResult = {
  status:       'failed'
  durationMs:   number
  errorMessage: string   // required เฉพาะ failed
  stackTrace?:  string
  screenshot?:  string
}

export type SkippedResult = {
  status:     'skipped'
  durationMs: 0          // literal type — skipped ใช้เวลา 0 เสมอ
  reason?:    string
}

export type TestResult = PassedResult | FailedResult | SkippedResult

// ─── Section 4: API shapes ────────────────────────────────────────────────
// Generic wrapper — เขียนครั้งเดียว ใช้ได้กับทุก endpoint

export interface ApiResponse<T> {
  data:    T
  status:  number
  message: string
  traceId: string        // สำหรับ debug กับ backend team
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page:       number
    pageSize:   number
    totalItems: number
    totalPages: number
  }
}

export interface ApiError {
  status:  number
  code:    string        // e.g. 'UNAUTHORIZED', 'NOT_FOUND'
  message: string
  details?: unknown
}

// ─── Section 5: Utility types ──────────────────────────────────────────────
// derived จาก TestCase — ไม่ copy fields เอง
// ถ้า TestCase เปลี่ยน types เหล่านี้อัปเดตตาม automatically

export type DraftTestCase    = Partial<TestCase>
export type CompleteTestCase = Required<TestCase>

// Update: id บังคับ (ต้องรู้ว่า update ใคร), field อื่น optional
export type TestCaseUpdate =
  { id: string } & Partial<Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>>
//                                         ↑ timestamps อัปเดตโดย backend ไม่ใช่ client

// ─── Section 6: Report types ───────────────────────────────────────────────
// combine TestCase + TestResult สำหรับ reporter

export type ExecutedTest = TestCase & {
  result:        TestResult
  executedAt:    Date
  runnerVersion: string
  retryCount:    number    // 0 = ไม่ retry, 1+ = retry แล้ว
}

export interface SummaryReport {
  total:        number
  passed:       number
  failed:       number
  skipped:      number
  passRate:     number     // 0–100
  avgDurationMs:number
  slowestTest:  string
  failedTitles: string[]
  env:          Environment
  generatedAt:  Date
}

export interface JPUser {
  id:       number
  name:     string
  username: string
  email:    string
}

export interface JPPost {
  userId: number
  id:     number
  title:  string
  body:   string
}