import {
  saveTaskToIDB
} from './local-tasks-db.js'

import TaskList from './task-list.js'

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { type: 'module' })
      .catch(error => console.error('Service Worker registration failed:', error))
  }
})

const taskListElement = document.getElementById('task-list')
const taskList = new TaskList(taskListElement)
taskList.init()

const newTaskForm = document.getElementById('new-task-form')
newTaskForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  
  const taskInput = document.getElementById('new-task-input')
  const taskDescription = taskInput.value.trim()

  const idbResult = await saveTaskToIDB({
    id: crypto.randomUUID(),
    taskDescription: taskDescription,
    completed: false,
  })

  taskInput.value = ''
  document.getElementById('submit-task').disabled = true
  
  taskList.addTask(idbResult.taskDescription, idbResult.id, idbResult.completed)
})

const taskInput = document.getElementById('new-task-input')
taskInput.addEventListener('input', (event) => {
  const taskDescription = event.target.value.trim()
  document.getElementById('submit-task').disabled = !taskDescription
})
