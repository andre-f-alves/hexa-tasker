import {
  getTasksFromIDB,
} from './local-tasks-db.js'

import TaskListItem from './task-list-item.js'

export default class TaskList {
  constructor(element) {
    this.element = element
    // this.observer = new MutationObserver(this.handleMutations.bind(this))
  }

  async init() {
    const tasks = await getTasksFromIDB()
    if (tasks.length > 0) {
      this.renderTasks(tasks)
    } else {
      this.renderEmtpyMessage()
    }

    // this.observeList()
  }

  renderTasks(tasks) {
    const fragment = document.createDocumentFragment()

    tasks.forEach(task => {
      const taskListItem = new TaskListItem(task.taskDescription, task.id, task.completed)
      fragment.appendChild(taskListItem)
    })

    this.element.appendChild(fragment)
  }

  renderEmtpyMessage() {
    const emptyMessage = document.createElement('p')
    emptyMessage.className = 'empty-message'
    emptyMessage.textContent = 'Nenhuma tarefa encontrada. Crie uma nova tarefa para começar!'
    this.element.appendChild(emptyMessage)
  }

  clearEmtpyMessage() {
    const emptyMessage = this.element.querySelector('.empty-message')
    if (emptyMessage) {
      emptyMessage.remove()
    }
  }

  addTask(taskDescription, taskId, completed=false) {
    const taskListItem = new TaskListItem(taskDescription, taskId, completed)
    this.element.appendChild(taskListItem)
  }

  observeList() {
    this.observer.observe(this.element, { childList: true })
  }

  handleMutations() {
    return
  }
}
