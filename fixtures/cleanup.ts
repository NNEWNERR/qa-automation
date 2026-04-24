import { test as base } from '@playwright/test'

type CleanupFixture = {
    trackCreated: (id: number) => void
}

export const test = base.extend<CleanupFixture>({
    trackCreated: async ({ request }, use) => {
        const createdIds: number[] = []

        await use((id: number) => createdIds.push(id))

        // teardown — รันแม้ test fail
        for (const id of createdIds) {
            await request.delete(`/api/users/${id}`)
        }
    },
})
