import {
  getUserTasks,
  createTask,
  updateTask,
  deleteTask
} from './tasks-api.js'

(async function() {
  const res = await getUserTasks()
  
  for (const task of res['user_tasks']) {
    addTask(task['task'], task['id'], task['completed'])
  }
})()

const newTaskForm = document.getElementById('new-task-form')

function addTask(task, taskId, completed=0) {
  const taskTemplate = document.getElementById('task-template')
  const taskElement = taskTemplate.content.cloneNode(true)
  const taskList = document.getElementById('task-list')
  const taskText = taskElement.querySelector('.task-text')
  const taskCheckbox = taskElement.querySelector('input[type="checkbox"]')
  const taskDeleteButton = taskElement.querySelector('.delete-button')
  const listItem = taskElement.querySelector('li')

  listItem.setAttribute('id', taskId)

  taskText.textContent = task

  taskCheckbox.setAttribute('id', taskId)

  taskCheckbox.addEventListener('change', async (event) => {
    const taskId = event.target.id
    const completed = Number(event.target.checked)

    const res = await updateTask(taskId, completed)
    console.log(res)

    if (completed) {
      taskCheckbox.setAttribute('checked', '')
    } else {
      taskCheckbox.removeAttribute('checked')
    }
  })

  if (completed) {
    taskCheckbox.setAttribute('checked', '')
  } else {
    taskCheckbox.removeAttribute('checked')
  }

  taskDeleteButton.setAttribute('id', taskId)

  taskDeleteButton.addEventListener('click', async (event) => {
    const taskId = event.target.id

    const res = await deleteTask(taskId)
    console.log(res)

    taskList.removeChild(listItem)
  })

  taskList.appendChild(taskElement)
}

newTaskForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const taskInput = document.getElementById('new-task-input')
  const task = taskInput.value

  const res = await createTask(task)

  taskInput.value = ''
  addTask(res['task'], res['task_id'])
})
