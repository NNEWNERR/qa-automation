import { test, expect } from '@playwright/test'
import { createUser, createUserWithFaker, createUsers } from '../factories/userFactory'

// ─── API CRUD ────────────────────────────────────────────────────────────────

test.describe('User CRUD — API', () => {

  test('GET /users — list is non-empty and matches JPUser shape', async ({ request }) => {
    const res = await request.get('/users')
    expect(res.status()).toBe(200)

    const users = await res.json()
    expect(users.length).toBeGreaterThan(0)
    expect(users[0]).toMatchObject({
      id:       expect.any(Number),
      name:     expect.any(String),
      username: expect.any(String),
      email:    expect.any(String),
    })
  })

  test('GET /users/:id — returns specific user', async ({ request }) => {
    const res = await request.get('/users/1')
    expect(res.status()).toBe(200)

    const user = await res.json()
    expect(user.id).toBe(1)
    expect(user.name).toBeTruthy()
  })

  test('POST /users — creates user with faker data', async ({ request }) => {
    const payload = createUserWithFaker()
    const res = await request.post('/users', { data: payload })
    expect(res.status()).toBe(201)

    const created = await res.json()
    expect(created.name).toBe(payload.name)
    expect(created.email).toBe(payload.email)
  })

  test('PUT /users/:id — updates user fields', async ({ request }) => {
    const payload = createUser({ name: 'Updated Name', email: 'updated@example.com' })
    const res = await request.put('/users/1', { data: payload })
    expect(res.status()).toBe(200)

    const updated = await res.json()
    expect(updated.name).toBe(payload.name)
  })

  test('DELETE /users/:id — returns 200', async ({ request }) => {
    const res = await request.delete('/users/1')
    expect(res.status()).toBe(200)
  })

})

// ─── page.route() mock pattern ───────────────────────────────────────────────

test.describe('User CRUD — route mock', () => {

  test('GET /users — mock returns factory data', async ({ page }) => {
    const users = createUsers(3)

    await page.route('**/users', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(users),
      })
    )

    await page.goto('https://jsonplaceholder.typicode.com')
    const result: unknown[] = await page.evaluate(async () => {
      const res = await fetch('/users')
      return res.json()
    })

    expect(result).toHaveLength(3)
    expect((result[0] as { name: string }).name).toBe(users[0].name)
  })

  test('stateful mock — DELETE removes item from subsequent GET', async ({ page }) => {
    const list = createUsers(2)

    // single route handler covers GET and DELETE on the same path
    await page.route('**/users**', async route => {
      if (route.request().method() === 'DELETE') {
        list.splice(0, 1)
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(list),
        })
      }
    })

    await page.goto('https://jsonplaceholder.typicode.com')

    await page.evaluate(async () => {
      await fetch('/users/1', { method: 'DELETE' })
    })

    const remaining: unknown[] = await page.evaluate(async () => {
      const res = await fetch('/users')
      return res.json()
    })

    expect(remaining).toHaveLength(1)
  })

})
