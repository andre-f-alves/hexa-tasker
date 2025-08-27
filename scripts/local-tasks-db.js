const DB_NAME = 'local-tasks-db'
const DB_VERSION = 1
const STORE = 'tasks'

let dbInstance = null

async function openDB() {
  if (dbInstance) return dbInstance

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onerror = () => {
      console.error('Erro ao abrir o banco de dados local.')
      reject(request.error)
    }
  })
}

async function handleAction(mode, callback) {
  return openDB().then(db => {
    const transaction = db.transaction(STORE, mode)
    transaction.onerror = () => {
      console.error('Transaction error:', transaction.error)
    }

    const objectStore = transaction.objectStore(STORE)
    return callback(objectStore)
  })
}

async function getTasksFromIDB() {
  return handleAction('readonly', (store) => {
    return new Promise((resolve, reject) => {
      const request = store.getAll()

      request.onerror = () => {
        console.error('Request error:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => resolve(request.result)
    })
  })
}

async function saveTaskToIDB(task) {
  return handleAction('readwrite', (store) => {
    return new Promise((resolve, reject) => {
      const request = store.put(task)

      request.onerror = () => {
        console.error('Request error:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => resolve(task)
    })
  })
}

async function updateTaskInIDB(taskId, updatedData) {
  return handleAction('readwrite', (store) => {
    return new Promise((resolve, reject) => {
      const request = store.get(taskId)

      request.onerror = () => {
        console.error('Request error:', request.error)
        reject({ error: request.error })
      }

      request.onsuccess = () => {
        const taskData = request.result
        if (!taskData) {
          console.warn('Tarefa não encontrada para atualização.')
          return resolve(null)
        }

        const update = Object.assign(taskData, updatedData)
        const updateRequest = store.put(update)

        updateRequest.onerror = () => {
          console.error('Update request error:', updateRequest.error)
          reject({ error: updateRequest.error })
        }

        updateRequest.onsuccess = () => {
          console.log('Tarefa atualizada:', update)
          resolve(update)
        }
      }
    })
  })
}

async function deleteTaskFromIDB(taskId) {
  return handleAction('readwrite', (store) => {
    return new Promise((resolve, reject) => {
      const request = store.delete(taskId)

      request.onerror = () => {
        console.error('Request error:', request.error)
        reject({ error: request.error })
      }

      request.onsuccess = () => {
        console.log('Tarefa deletada:', taskId)
        resolve({ success: true })
      }
    })
  })
}

export {
  openDB,
  getTasksFromIDB,
  saveTaskToIDB,
  updateTaskInIDB,
  deleteTaskFromIDB
}
