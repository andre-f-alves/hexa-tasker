import { renderTaskList } from './task-list-renderer.js'
import {
  registerSync,
} from './utils.js'
import TaskListItem from './task-list-item.js'

renderTaskList(document.getElementById('task-list'))

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { type: 'module' })
      .catch(error => console.error('Service Worker registration failed:', error))
  }
})

function renderTask(taskDescription, taskId, completed=false) {
  const taskList = document.getElementById('task-list')
  const taskListItem = new TaskListItem(taskDescription, taskId, completed)
  taskList.appendChild(taskListItem)
}

async function handleTaskSubmit(event) {
  event.preventDefault()
  
  const taskInput = document.getElementById('new-task-input')
  const taskDescription = taskInput.value.trim()

  const idbResult = await saveTaskToIDB({
    id: crypto.randomUUID(),
    taskDescription: taskDescription,
    completed: false,
    synced: false,
    deleted: false
  })

  taskInput.value = ''
  document.getElementById('submit-task').disabled = true
  
  renderTask(idbResult.taskDescription, idbResult.id, idbResult.completed)
  registerSync('sync-tasks')
}

const newTaskForm = document.getElementById('new-task-form')
newTaskForm.addEventListener('submit', (event) => handleTaskSubmit(event))

const taskInput = document.getElementById('new-task-input')
taskInput.addEventListener('input', (event) => {
  const taskDescription = event.target.value.trim()
  document.getElementById('submit-task').disabled = !taskDescription
})
