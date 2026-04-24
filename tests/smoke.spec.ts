import { test, expect } from '@playwright/test'

// Smoke: verify the API is reachable before running the full suite.
// No business-logic assertions here — that belongs in api.spec.ts.
test('API connectivity check', async ({ request }) => {
  const res = await request.get('/users/1')
  expect(res.ok()).toBe(true)
})
