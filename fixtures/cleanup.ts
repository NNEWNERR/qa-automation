import { test as base } from '@playwright/test'

/**
 * Reference pattern: track resources created during a test and delete them in
 * teardown (which runs even when the test fails).
 *
 * Not wired into any spec here — JSONPlaceholder fakes its writes, so there is
 * nothing real to clean up. Kept as the shape to copy into a suite that hits a
 * real backend.
 */

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
