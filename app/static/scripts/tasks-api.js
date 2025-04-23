async function getUserTasks() {
  const res = await fetch('api/get-tasks')
    .then(res => res.json())

  return res
}

async function createTask(task) {
  const res = await fetch('api/create-task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'task': task})
  })
    .then(res => res.json())

  return res
}

async function updateTask(taskId, completed) {
  const res = await fetch(`api/update-task/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'completed': completed})
  })
    .then(res => res.json())

  return res
}

async function deleteTask(taskId) {
  const res = await fetch(`api/delete-task/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
  
  return res
}

export { getUserTasks, createTask, updateTask, deleteTask }
