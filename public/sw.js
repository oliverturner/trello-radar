(function () {
  const cacheName = 'v1'

  this.addEventListener('install', (e) => {
    // once the SW is installed, go ahead and fetch the resources
    // to make this work offline
    e.waitUntil(
      caches.open(cacheName)
        .then((cache) =>
          cache.matchAll('/')
            .then(() => this.skipWaiting())
        )
    )
  })

  // when the browser fetches a url, either response with
  // the cached object or go ahead and fetch the actual url
  this.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((res) => res || this.fetch(event.request))
    )
  })
}())
