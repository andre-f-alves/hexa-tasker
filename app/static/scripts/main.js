import {
  getTasks,
  createTask,
} from './tasks-api.js'

import TaskListItem from './task-list-item.js'

(async function () {
  const res = await getTasks()
  
  res['user_tasks'].forEach((task) => addTask(task['task'], task['id'], task['completed']))
})()

function addTask(task, taskId, completed=false) {
  const taskList = document.getElementById('task-list')
  const taskListItem = new TaskListItem(task, taskId, completed)
  taskList.appendChild(taskListItem)
}

const newTaskForm = document.getElementById('new-task-form')

const taskInput = document.getElementById('new-task-input')

taskInput.addEventListener('input', (event) => {
  const task = event.target.value.trim()
  document.getElementById('submit-task').disabled = !task
})

newTaskForm.addEventListener('submit', async (event) => handleTaskSubmit(event))

async function handleTaskSubmit(event) {
  event.preventDefault()
  
  const taskInput = document.getElementById('new-task-input')
  const task = taskInput.value.trim()

  const { resFulfilled, resData } = await createTask(task)

  taskInput.value = ''
  document.getElementById('submit-task').disabled = true

  if (resFulfilled) {
    alert(`Error creating task: ${res['error']}`)
    return
  }

  addTask(resData['task'], resData['task_id'])
}
