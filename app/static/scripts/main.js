(async function() {
  const response = await fetch('api/get-tasks').then(res => res.json())

  for (const task of response['user_tasks']) {
    addTask(task['task'])
  }
})()

const newTaskForm = document.getElementById('new-task-form')

function addTask(task) {
  const taskList = document.getElementById('task-list')
  const listItem = document.createElement('li')
  listItem.textContent = task
  taskList.appendChild(listItem)
}

newTaskForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const taskInput = document.getElementById('new-task-input')
  const task = taskInput.value

  const response = await fetch('api/create-task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'task': task})
  })
  .then(res => res.json())

  taskInput.value = ''

  console.log(response)
  addTask(response.task)
})
