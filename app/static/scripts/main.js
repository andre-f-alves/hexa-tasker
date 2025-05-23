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

newTaskForm.addEventListener('submit', async (event) => handleTaskSubmit(event))

async function handleTaskSubmit(event) {
  event.preventDefault()

  const taskInput = document.getElementById('new-task-input')
  const task = taskInput.value

  const res = await createTask(task)

  taskInput.value = ''
  addTask(res['task'], res['task_id'])
}
