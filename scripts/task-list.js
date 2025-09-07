import {
  getTasksFromIDB,
} from './local-tasks-db.js'

import TaskListItem from './task-list-item.js'

export default class TaskList {
  constructor(element) {
    this.element = element

    this.element.addEventListener('taskDeletion', (event) => this.removeTask(event.detail.taskId))
  }

  async init() {
    const tasks = await getTasksFromIDB()
    if (tasks.length > 0) {
      this.renderTasks(tasks)
    } else {
      this.renderEmptyListMessage()
    }
  }

  renderTasks(tasks) {
    const fragment = document.createDocumentFragment()

    tasks.forEach(task => {
      const taskListItem = new TaskListItem(task.taskDescription, task.id, task.completed)
      fragment.appendChild(taskListItem)
    })

    this.element.appendChild(fragment)
  }

  renderEmptyListMessage() {
    const emptyMessage = document.createElement('p')
    emptyMessage.classList.add('empty-list-message')
    emptyMessage.textContent = 'Nenhuma tarefa encontrada. Crie uma nova tarefa para começar!'
    this.element.appendChild(emptyMessage)
  }

  removeEmptyListMessage() {
    const emptyMessage = this.element.querySelector('.empty-list-message')
    if (emptyMessage) {
      emptyMessage.remove()
    }
  }

  addTask(taskDescription, taskId, completed=false) {
    const taskListItem = new TaskListItem(taskDescription, taskId, completed)
    this.element.appendChild(taskListItem)

    if (this.element.querySelector('.empty-list-message')) {
      this.removeEmptyListMessage()
    }
  }

  removeTask(taskId) {
    const taskElement = document.getElementById(`task-${taskId}`)
    if (taskElement) {
      taskElement.remove()
    }

    if (this.element.querySelectorAll('.task-list-item').length === 0) {
      this.renderEmptyListMessage()
    }
  }
}
