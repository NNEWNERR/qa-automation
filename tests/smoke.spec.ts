import { JPUser } from '../types/index';
import { test, expect } from '@playwright/test'

test('API reachable + types work', async ({ request }) => {
  const res = await request.get('/users/1')
  expect(res.status()).toBe(200)

  const user: JPUser = await res.json()
  expect(user.id).toBe(1)
  expect(user.email).toContain('@')

  console.log(`✓ Got user: ${user.name} <${user.email}>`)
})