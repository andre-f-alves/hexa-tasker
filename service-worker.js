import {
  getTasksFromIDB,
  updateTaskInIDB,
  deleteTaskFromIDB
} from './scripts/local-tasks-db.js'

const CACHE_VERSION = 1
const CACHE_NAME = `hexa-tasker-cache-v${CACHE_VERSION}`
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/scripts/main.js',
  '/scripts/local-tasks-db.js',
  '/scripts/task-list-item.js',
  '/scripts/utils.js',
  '/styles/globals.css',
  '/styles/user-page.css',
  '/favicon.ico',
  '/manifest.json',
  '/imgs/hexa-tasker-icon.png',
]

self.addEventListener('install', event => {
  console.log('Service Worker installing.')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  )
  self.skipWaiting()
})

async function deleteOldCaches(exceptions=[]) {
  const cachesNames = await caches.keys()
  return Promise.all(
    cachesNames.map(cacheName => {
      if (exceptions.includes(cacheName)) {
        return caches.delete(cacheName)
      }
      return undefined
    })
  )
}

self.addEventListener('activate', event => {
  console.log('Service Worker activating.')

  event.waitUntil(deleteOldCaches([CACHE_NAME]))

  event.waitUntil(self.clients.claim())
  self.skipWaiting()
})

async function putInCache(request, response) {
  const cache = await caches.open(CACHE_NAME)
  return await cache.put(request, response)
}

async function cacheFirst({ request, fallbackURL }) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    fetch(request)
      .then(networkResponse => {
        if (networkResponse.ok) putInCache(request, networkResponse.clone())
        console.info('Cache updated.')
      })
      .catch(error => console.warn('Cache update failed:', error))

    console.info('Returning cached response.', request.url)
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      putInCache(request, networkResponse.clone())

      console.info('Returning network response.', request.url)
      return networkResponse
    }
  
  } catch (error) {
    console.error('Network request failed:', error)

    if (fallbackURL) {
      const fallbackResponse = await caches.match(fallbackURL)

      if (fallbackResponse) {
        console.info('Returning fallback response.', fallbackURL)
        return fallbackResponse
      }
    }

    return new Response('Network request failed and no fallback available.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

self.addEventListener('fetch', event => {
  const { request } = event

  if (request.method !== 'GET') return

  event.respondWith(cacheFirst({
    request: request,
    fallbackURL: '/'
  }))
})
