// pages/TodoPage.ts
import { Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class TodoPage extends BasePage {
    readonly input = this.page.getByPlaceholder('What needs to be done?')
    readonly items = this.page.getByRole('listitem')

    async addTodo(text: string) {
        await this.input.fill(text)
        await this.input.press('Enter')
    }

    async completeTodo(text: string) {
        await this.items
            .filter({ hasText: text })
            .getByRole('checkbox')
            .check()
    }

    async expectCount(n: number) {
        const label = n === 1 ? '1 item left' : `${n} items left`
        await expect(this.page.getByText(label)).toBeVisible()
    }

    async deleteTodo(text: string) {
        const item = this.items.filter({ hasText: text })
        await item.hover()   // hover เพื่อให้ปุ่ม × ปรากฏ
        await item.getByRole('button', { name: 'Delete' }).click()
    }

    async filterBy(filter: 'All' | 'Active' | 'Completed') {
        await this.page
            .getByRole('link', { name: filter })
            .click()
    }

    async expectItemVisible(text: string) {
        await expect(
            this.items.filter({ hasText: text })
        ).toBeVisible()
    }

    async expectItemHidden(text: string) {
        await expect(
            this.items.filter({ hasText: text })
        ).not.toBeVisible()
    }
}
