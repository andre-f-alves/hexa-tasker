import {
  updateTask,
  editTask,
  deleteTask
} from './tasks-api.js'

import { getTemplateContent } from './utils.js'

export default class TaskListItem {
  constructor(task, taskId, completed) {
    this.element = getTemplateContent('task-list-item-template', '.task-list-item')
    this.element.setAttribute('id', `task-list-item-${taskId}`)
    this.element.onclick = this.handleClick.bind(this)
    this.element.onchange = this.handleChange.bind(this)

    this.taskWrapper = this.element.querySelector('.task-wrapper')
    
    this.taskCheckbox = this.element.querySelector('.task-checkbox')
    this.taskCheckbox.dataset.taskId = taskId

    if (completed) {
      this.taskCheckbox.setAttribute('checked', '')
    } else {
      this.taskCheckbox.removeAttribute('checked')
    }

    this.taskEditorButton = this.element.querySelector('.edit-task-button')
    this.taskEditorButton.dataset.taskId = taskId
    
    this.taskDeleteButton = this.element.querySelector('.delete-task-button')
    this.taskDeleteButton.dataset.taskId = taskId
    
    this.taskText = this.element.querySelector('.task-text')
    this.taskText.textContent = task

    return this.element
  }

  async updateTask(target) {
    const { taskId } = target.dataset
    const completed = Number(target.checked)

    await updateTask(taskId, completed)

    if (completed) {
      target.setAttribute('checked', '')
    } else {
      target.removeAttribute('checked')
    }
  }

  openEditor(target) {
    const { taskId } = target.dataset
    const taskEditor = getTemplateContent('task-editor-template', '.task-editor')
    const taskEditorInput = taskEditor.querySelector('.task-editor-input')
    const saveButton = taskEditor.querySelector('.save-button')

    this.taskWrapper.classList.add('hidden')
    this.element.appendChild(taskEditor)

    saveButton.dataset.taskId = taskId

    taskEditorInput.value = this.taskText.textContent
    taskEditorInput.select()
    taskEditorInput.focus()
  }

  closeEditor() {
    this.taskWrapper.classList.remove('hidden')
    this.element.querySelector('.task-editor').remove()
  }

  async save(target) {
    const { taskId } = target.dataset
    const taskEditorInput = this.element.querySelector('.task-editor-input')
    const task = taskEditorInput.value

    const res = await editTask(taskId, task)
    this.taskText.textContent = res['task']

    this.closeEditor()
  }

  async deleteTask(target) {
    const { taskId } = target.dataset
    await deleteTask(taskId)
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
