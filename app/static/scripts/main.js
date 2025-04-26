import {
  getTasks,
  createTask,
  updateTask,
  editTask,
  deleteTask
} from './tasks-api.js'

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

  const taskText = taskListItem.querySelector('.task-text')
  const taskCheckbox = taskListItem.querySelector('.task-checkbox')
  const taskEditButton = taskListItem.querySelector('.edit-task-button')
  const checkTaskButton = taskListItem.querySelector('.check-task-button')
  const taskDeleteButton = taskListItem.querySelector('.delete-task-button')

  taskListItem.setAttribute('id', `task-list-item-${taskId}`)

  taskText.textContent = task

  taskCheckbox.dataset.taskId = taskId
  taskCheckbox.addEventListener('change', async (event) => handleTaskUpdate(event.target))

  if (completed) {
    taskCheckbox.setAttribute('checked', '')
    checkTaskButton.textContent = 'Desmarcar'

  } else {
    taskCheckbox.removeAttribute('checked')
    checkTaskButton.textContent = 'Marcar como concluída'
  }

  checkTaskButton.dataset.taskId = taskId
  checkTaskButton.addEventListener('click', () => taskCheckbox.click())

  taskEditButton.dataset.taskId = taskId
  taskEditButton.addEventListener('click', (event) => handleTaskEditing(event.target))

  taskDeleteButton.dataset.taskId = taskId
  taskDeleteButton.addEventListener('click', async (event) => handleTaskDeletion(event.target))

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

async function handleTaskUpdate(element) {
  const { taskId } = element.dataset
  const completed = Number(element.checked)

  const checkTaskButton = document.querySelector(`.check-task-button[data-task-id="${taskId}"]`)

  await updateTask(taskId, completed)

  if (completed) {
    element.setAttribute('checked', '')
    checkTaskButton.textContent = 'Desmarcar'

  } else {
    element.removeAttribute('checked')
    checkTaskButton.textContent = 'Marcar como concluída'
  }
}

function handleTaskEditing(element) {
  const { taskId } = element.dataset

  const taskEditor = getTemplateContent('task-editor-template', '.task-editor')
  const taskEditorInput = taskEditor.querySelector('.task-editor-input')

  const taskListItem = document.getElementById(`task-list-item-${taskId}`)

  taskListItem.querySelector('.task-wrapper').classList.add('hidden')

  taskListItem.appendChild(taskEditor)

  taskEditorInput.value = taskListItem.querySelector('.task-text').textContent
  taskEditorInput.select()
  taskEditorInput.focus()

  taskEditor.querySelector('.cancel-button').addEventListener('click', () => {
    taskListItem.querySelector('.task-wrapper').classList.remove('hidden')
    taskEditor.remove()
  })

  taskEditor.querySelector('.save-button').addEventListener('click', async (event) => {
    event.preventDefault()
    const task = taskEditorInput.value

    const res = await editTask(taskId, task)

    console.log(res)

    taskListItem.querySelector('.task-wrapper').classList.remove('hidden')
    taskListItem.querySelector('.task-text').textContent = res['task']
    taskEditor.remove()
  })
}

async function handleTaskDeletion(element) {
  const { taskId } = element.dataset

  await deleteTask(taskId)

  document.getElementById(`task-list-item-${taskId}`).remove()
}

function getTemplateContent(templateId, content) {
  const template = document.getElementById(templateId)
  const templateContent = template.content.cloneNode(true)
  return templateContent.querySelector(content)
}
