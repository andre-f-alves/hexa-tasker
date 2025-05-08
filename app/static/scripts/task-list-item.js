import {
  updateTask,
  editTask,
  deleteTask
} from './tasks-api.js'

import { getTemplateContent } from './utils.js'

export default class TaskListItem {
  constructor(task, taskId, completed) {
    this.taskId = taskId
    
    this.element = getTemplateContent('task-list-item-template', '.task-list-item')
    this.element.setAttribute('id', `task-${this.taskId}`)
    this.element.onclick = this.handleClick.bind(this)
    this.element.onchange = this.handleChange.bind(this)

    this.taskWrapper = this.element.querySelector('.task-wrapper')
    
    this.taskCheckbox = this.element.querySelector('.task-checkbox')

    if (completed) {
      this.taskCheckbox.setAttribute('checked', '')
    } else {
      this.taskCheckbox.removeAttribute('checked')
    }

    this.taskEditorButton = this.element.querySelector('.edit-task-button')
    
    this.taskDeleteButton = this.element.querySelector('.delete-task-button')
    
    this.taskText = this.element.querySelector('.task-text')
    this.taskText.textContent = task

    return this.element
  }

  async updateTask(target) {
    const completed = Number(target.checked)

    await updateTask(this.taskId, completed)

    if (completed) {
      target.setAttribute('checked', '')
    } else {
      target.removeAttribute('checked')
    }
  }

  openEditor() {
    if (this.element.querySelector('.task-editor')) return

    if (document.querySelector('.task-editor')) {
      document.querySelector('.task-wrapper.hidden').classList.remove('hidden')
      document.querySelector('.task-editor').remove()
    }

    const taskEditor = getTemplateContent('task-editor-template', '.task-editor')
    const taskEditorInput = taskEditor.querySelector('.task-editor-input')

    this.taskWrapper.classList.add('hidden')
    this.element.appendChild(taskEditor)

    document.onclick = (event) => {
      if (
        !this.element.contains(event.target) &&
        this.element.querySelector('.task-editor')
      ) {
        this.closeEditor()
      }
    }

    taskEditorInput.value = this.taskText.textContent
    taskEditorInput.select()
    taskEditorInput.focus()
  }

  closeEditor() {
    this.taskWrapper.classList.remove('hidden')
    this.element.querySelector('.task-editor').remove()

    if (document.onclick) document.onclick = null
  }

  async save() {
    const taskEditorInput = this.element.querySelector('.task-editor-input')
    const task = taskEditorInput.value

    const res = await editTask(this.taskId, task)
    this.taskText.textContent = res['task']

    this.closeEditor()
  }

  async deleteTask() {
    await deleteTask(this.taskId)
    this.element.remove()
  }

  parseAction(action) {
    return action.replace(/-\w/, (str) => str[1].toUpperCase())
  }

  handleClick(event) {
    if (event.target.type === 'checkbox') return
    
    if (event.target.type === 'submit') event.preventDefault()

    const { action } = event.target.dataset
    if (!action) return

    const method = this.parseAction(action)
    if (!this[method]) return
    
    this[method](event.target)
  }

  handleChange(event) {
    if (event.target.type !== 'checkbox') return
    const { action } = event.target.dataset
    if (!action) return
    const method = this.parseAction(action)
    this[method](event.target)
  }
}
