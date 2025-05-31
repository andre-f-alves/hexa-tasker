async function getTasks() {
  try {
    const res = await fetch('api/get-tasks')
    return await res.json()
  
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return { 'error': 'Falha ao buscar as tarefas.' }
  }
}

async function createTask(task) {
  try {
    const res = await fetch('api/create-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'task': task})
    })

    const data = await res.json()
    
    return { resFulfilled: res.ok, resStatus: res.status, resData: data }

  } catch (error) {
    console.error('Error creating task:', error)
    return { 'error': 'Falha ao criar a tarefa.' }
  }
}

async function updateTask(taskId, completed) {
  try {
    const res = await fetch(`api/update-task/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'completed': completed})
    })

    return await res.json()

  } catch (error) {
    console.error('Error updating task:', error)
    return { 'error': 'Falha ao atualizar a tarefa.' }
  }
}

async function editTask(taskId, task) {
  try {
    const res = await fetch(`api/edit-task/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'task': task})
    })

    const data = await res.json()

    return { resFulfilled: res.ok, resStatus: res.status, resData: data }

  } catch (error) {
    console.error('Error editing task:', error)
    return { 'error': 'Falha ao editar a tarefa.' }
  }
}

async function deleteTask(taskId) {
  try {
    await fetch(`api/delete-task/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  
  } catch (error) {
    console.error('Error deleting task:', error)
    alert('Falha ao excluir a tarefa.')
  }
}

export { getTasks, createTask, updateTask, editTask, deleteTask }
