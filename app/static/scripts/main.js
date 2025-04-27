import {
  getTasks,
  createTask,
} from './tasks-api.js'

import { getTemplateContent } from './utils.js'

import TaskHandler from './task-handler.js'

(async function() {
  const res = await getTasks()
  
  for (const task of res['user_tasks']) {
    addTask(task['task'], task['id'], task['completed'])
  }
})()

const newTaskForm = document.getElementById('new-task-form')

function addTask(task, taskId, completed=0) {
  const taskList = document.getElementById('task-list')

  const taskListItem = getTemplateContent('task-list-item-template', '.task-list-item')

  new TaskHandler(taskListItem)

  const taskText = taskListItem.querySelector('.task-text')
  const taskCheckbox = taskListItem.querySelector('.task-checkbox')
  const taskEditButton = taskListItem.querySelector('.edit-task-button')
  const checkTaskButton = taskListItem.querySelector('.check-task-button')
  const taskDeleteButton = taskListItem.querySelector('.delete-task-button')

  taskListItem.setAttribute('id', `task-list-item-${taskId}`)

  taskText.textContent = task

  taskCheckbox.dataset.taskId = taskId

  if (completed) {
    taskCheckbox.setAttribute('checked', '')
    checkTaskButton.textContent = 'Desmarcar'

  } else {
    taskCheckbox.removeAttribute('checked')
    checkTaskButton.textContent = 'Marcar como concluída'
  }

  checkTaskButton.dataset.taskId = taskId

  taskEditButton.dataset.taskId = taskId

  taskDeleteButton.dataset.taskId = taskId

  taskList.appendChild(taskListItem)
}

newTaskForm.addEventListener('submit', async (event) => handleTaskSubmit(event))

async function handleTaskSubmit(event) {
  event.preventDefault()

  const taskInput = document.getElementById('new-task-input')
  const task = taskInput.value

  const res = await createTask(task)

  taskInput.value = ''
  addTask(res['task'], res['task_id'])
}
