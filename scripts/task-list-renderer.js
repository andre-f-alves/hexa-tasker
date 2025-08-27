// import { fetchTasks } from './tasks-api.js'
import {
  getTasksFromIDB,
  saveTaskToIDB
} from './local-tasks-db.js'
import TaskListItem from './task-list-item.js'

async function renderTaskList(taskList) {
  // const userTasks = await fetchTasks()

  // if (userTasks.error) {
  //   console.error(userTasks.error)

  // } else {
  //   for (const task of userTasks) {
  //     await saveTaskToIDB({
  //       id: task.id,
  //       taskDescription: task.taskDescription,
  //       completed: task.completed,
  //       synced: true,
  //       deleted: false
  //     })
  //   }
  // }

  const tasksFromIDB = await getTasksFromIDB()
  if (tasksFromIDB.length > 0) {
    const fragment = document.createDocumentFragment()
    
    tasksFromIDB.forEach(task => {
      const taskListItem = new TaskListItem(task.taskDescription, task.id, task.completed)
      fragment.appendChild(taskListItem)
    })

    taskList.appendChild(fragment)
  
  } else {
    const noTasksMessage = document.createElement('p')
    noTasksMessage.classList.add('no-tasks-message')
    noTasksMessage.textContent = 'Sua lista está vazia. Crie uma nova tarefa para começar.'
    taskList.appendChild(noTasksMessage)
  }

  const observer = new MutationObserver((_, observer) => {
    observer.disconnect()

    if (!taskList.querySelectorAll('.task-list-item').length) {
      renderElement('p', taskList, {
        className: 'no-tasks-message',
        textContent: 'Sua lista está vazia. Crie uma nova tarefa para começar.'
      })
    
    } else {
      const noTasksMessage = taskList.querySelector('.no-tasks-message')
      if (noTasksMessage) {
        noTasksMessage.remove()
      }
    }

    observer.observe(taskList, { childList: true })
  })
  observer.observe(taskList, { childList: true })
}

export { renderTaskList }
