import {
  getTasks,
  createTask,
} from './tasks-api.js'

import TaskListItem from './task-list-item.js'

(async function () {
  const res = await getTasks()

  const taskList = document.getElementById('task-list')

  const observer = new MutationObserver((_, observer) => {
    observer.disconnect()

    if (!taskList.querySelectorAll('.task-list-item').length) {
      const noTasksMessage = document.createElement('p')
      noTasksMessage.classList.add('no-tasks-message')
      noTasksMessage.textContent = 'Sua lista está vazia. Crie uma nova tarefa para começar.'
      taskList.appendChild(noTasksMessage)
    
    } else {
      const noTasksMessage = taskList.querySelector('.no-tasks-message')
      if (noTasksMessage) {
        noTasksMessage.remove()
      }
    }

    observer.observe(taskList, { childList: true })
  })

  if (res['user_tasks'].length > 0) {
    res['user_tasks'].forEach((task) => addTask(task['task'], task['id'], task['completed']))
  
  } else {
    const noTasksMessage = document.createElement('p')
    noTasksMessage.classList.add('no-tasks-message')
    noTasksMessage.textContent = 'Sua lista está vazia. Crie uma nova tarefa para começar.'
    taskList.appendChild(noTasksMessage)
  }

  observer.observe(taskList, { childList: true })
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

  if (!resFulfilled) {
    alert(`Error creating task: ${resData['error']}`)
    return
  }

  addTask(resData['task'], resData['task_id'])
}
