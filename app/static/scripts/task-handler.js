import {
  updateTask,
  editTask,
  deleteTask
} from './tasks-api.js'

import { getTemplateContent } from './utils.js'

export default class TaskHandler {
  constructor(element) {
    this.element = element
    element.onclick = this.handleClick.bind(this)
    element.onchange = this.handleChange.bind(this)
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

    this.element.querySelector('.task-wrapper').classList.add('hidden')
    this.element.appendChild(taskEditor)

    const saveButton = taskEditor.querySelector('.save-button')
    saveButton.dataset.taskId = taskId

    taskEditorInput.value = this.element.querySelector('.task-text').textContent
    taskEditorInput.select()
    taskEditorInput.focus()
  }

  closeEditor() {
    this.element.querySelector('.task-wrapper').classList.remove('hidden')
    this.element.querySelector('.task-editor').remove()
  }

  async save(target) {
    const { taskId } = target.dataset
    const taskEditorInput = this.element.querySelector('.task-editor-input')
    const task = taskEditorInput.value

    const res = await editTask(taskId, task)
    this.element.querySelector('.task-text').textContent = res['task']

    this.closeEditor()
  }

  async deleteTask(target) {
    const { taskId } = target.dataset
    await deleteTask(taskId)
    this.element.remove()
  }

  parseAction(action) {
    const splitted = action.split('-')
    if (splitted.length === 1) return action
    const parsed = splitted[1].replace(/^\w/, (char) => char.toUpperCase())
    return splitted[0] + parsed
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
