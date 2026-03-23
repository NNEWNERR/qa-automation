import { test, expect } from '../fixtures'

test.describe('TodoMVC — Week 2 mini project', () => {

  test('add todo item appears in list', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk')
    await todoPage.expectItemVisible('Buy milk')
    await todoPage.expectCount(1)
  })

  test('complete todo reduces active count', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk')
    await todoPage.addTodo('Write tests')
    await todoPage.completeTodo('Buy milk')
    await todoPage.expectCount(1)
    expect.soft(
      todoPage.items.filter({ hasText: 'Buy milk' })
    ).toHaveClass(/completed/)
  })

  test('delete todo removes it from list', async ({ todoPage }) => {
    await todoPage.addTodo('Temporary task')
    await todoPage.expectItemVisible('Temporary task')
    await todoPage.deleteTodo('Temporary task')
    await todoPage.expectItemHidden('Temporary task')
  })

  test('filter Active shows only uncompleted', async ({ todoPage }) => {
    await todoPage.addTodo('Active task')
    await todoPage.addTodo('Done task')
    await todoPage.completeTodo('Done task')
    await todoPage.filterBy('Active')
    await todoPage.expectItemVisible('Active task')
    await todoPage.expectItemHidden('Done task')
  })

  test('add multiple todos shows correct count', async ({ todoPage }) => {
    const todos = ['Task A', 'Task B', 'Task C']
    for (const t of todos) {
      await todoPage.addTodo(t)
    }
    await todoPage.expectCount(3)
    await expect(todoPage.items).toHaveCount(3)
  })

})