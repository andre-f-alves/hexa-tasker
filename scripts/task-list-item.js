import {
  updateTaskInIDB,
  deleteTaskFromIDB
} from './local-tasks-db.js'

import {
  getTemplateContent,
} from './utils.js'

export default class TaskListItem {
  constructor(taskDescription, taskId, completed) {
    this.taskId = taskId
    
    this.element = getTemplateContent('task-list-item-template', '.task-list-item')
    this.element.setAttribute('id', `task-${this.taskId}`)
    this.element.onclick = this.handleClick.bind(this)
    this.element.onchange = this.handleChange.bind(this)

    this.taskWrapper = this.element.querySelector('.task-wrapper')
    
    this.taskCheckbox = this.element.querySelector('.task-checkbox')
    this.taskCheckbox.checked = completed

    this.taskEditorButton = this.element.querySelector('.edit-task-button')
    
    this.taskDeleteButton = this.element.querySelector('.delete-task-button')
    
    this.taskDescription = this.element.querySelector('.task-description')
    this.taskDescription.textContent = taskDescription

    return this.element
  }

  async updateTask() {
    const completed = this.taskCheckbox.checked
    const idbResult = await updateTaskInIDB(this.taskId, { completed: completed })
    
    if (!idbResult || idbResult.error) {
      alert('Erro ao atualizar a tarefa no banco de dados local.')
      this.taskCheckbox.checked = !completed
      return
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

    taskEditorInput.addEventListener('input', (event) => {
      const taskDescription = event.target.value.trim()
      taskEditor.querySelector('.save-button').disabled = !taskDescription
    })

    taskEditorInput.value = this.taskDescription.textContent
    taskEditorInput.select()
    taskEditorInput.focus()
  }

  closeEditor() {
    this.taskWrapper.classList.remove('hidden')
    this.element.querySelector('.task-editor').remove()

    if (document.onclick) document.onclick = null
  }

  async saveEdition() {
    const taskEditorInput = this.element.querySelector('.task-editor-input')
    const taskDescription = taskEditorInput.value.trim()

    const idbResult = await updateTaskInIDB(this.taskId, { taskDescription: taskDescription })

    if (!idbResult || idbResult.error) {
      alert('Erro ao editar a tarefa no banco de dados local.')
      this.closeEditor()
      return
    }

    this.taskDescription.textContent = idbResult.taskDescription
    this.closeEditor()
  }

  async confirmDeletion() {
    const deletionDialog = document.getElementById('deletion-dialog')
    const cancelDeletion = document.getElementById('cancel-deletion-button')
    const confirmDeletion = document.getElementById('confirm-deletion-button')

    cancelDeletion.addEventListener('click', (event) => {
      deletionDialog.close(event.target.value)
    })

    confirmDeletion.addEventListener('click', (event) => {
      deletionDialog.close(event.target.value)
    })

    deletionDialog.showModal()

    const result = await new Promise((resolve) => {
      deletionDialog.addEventListener('close', () => {
        const value = deletionDialog.returnValue === 'confirm'
        resolve(value)
      })

      deletionDialog.addEventListener('cancel', () => resolve(false))
    })

    return result
  }

  async deleteTask() {
    const deletionConfirmed = await this.confirmDeletion()
    if (!deletionConfirmed) return

    const idbResult = await deleteTaskFromIDB(this.taskId)
    
    if (idbResult.error) {
      alert(idbResult.error)
      return
    }

    const taskDeletionEvent = new CustomEvent('taskDeletion', {
      detail: { taskId: this.taskId },
      bubbles: true,
    })

    this.element.dispatchEvent(taskDeletionEvent)
  }

  parseAction(action) {
    return action.replace(/-\w/, (str) => str[1].toUpperCase())
  }

  handleClick(event) {
    const element = event.target.closest('button')

    if (element.type === 'checkbox') return
    
    if (element.type === 'submit') event.preventDefault()

    const { action } = element.dataset
    if (!action) return

    const method = this.parseAction(action)
    if (!this[method]) return
    
    this[method]()
  }

  handleChange(event) {
    if (event.target.type !== 'checkbox') return
    
    const { action } = event.target.dataset
    if (!action) return

    const method = this.parseAction(action)
    this[method](event.target)
  }
}
