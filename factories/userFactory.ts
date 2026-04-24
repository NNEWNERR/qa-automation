import { JPPost, JPUser } from './../types/index';
import { faker } from '@faker-js/faker'

let counter = 0

export function createUser(overrides?: Partial<JPUser>): JPUser {
    counter++
    return {
        id: counter,
        name: `Test User ${counter}`,
        username: `testuser${counter}`,
        email: `testuser${counter}@example.com`,
        ...overrides,
    }
}

export function createUserWithFaker(overrides?: Partial<JPUser>): JPUser {
    return {
        id: faker.number.int({ min: 100, max: 9999 }),
        name: faker.person.fullName(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        ...overrides,
    }
}

export function createPost(overrides?: Partial<JPPost>): JPPost {
  counter++
  return {
    userId: 1,
    id:     counter,
    title:  `Test Post ${counter}`,
    body:   faker.lorem.paragraph(),
    ...overrides,
  }
}

export function createPostForUser(userId: number, overrides?: Partial<JPPost>) {
  return createPost({ userId, ...overrides })
}

export function createPosts(n: number, overrides?: Partial<JPPost>): JPPost[] {
  return Array.from({ length: n }, () => createPost(overrides))
}

export function createUsers(n: number, overrides?: Partial<JPUser>): JPUser[] {
  return Array.from({ length: n }, () => createUser(overrides))
}