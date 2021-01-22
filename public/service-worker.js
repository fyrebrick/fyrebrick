// Check that service workers are supported
var CACHE_NAME = 'fyrebrick-cach';
var urlsToCache = [
  '/dist/bootstrap@4.5.3/bootstrap.min.css',
  '/css/navbar.css',
  '/css/main.css',
  '/dist/popper.js@1.16.1/popper.min.js',
  '/dist/jquery@3.5.1/jquery-3.5.1.slim.min.js',
  '/dist/jquery@3.5.1/ajax.min.js',
  '/dist/bootstrap@4.5.3/bootstrap.min.js',
  '/dist/fontawesome/96bf49b15d.js',
  '/text/javascript',
  '/fn/orderList.js',
  '/js/navbar.js',
  '/js/main.js',
  '/js/service-worker.js',
  '/css/global.css',
  '/my/settings',
  '/my/orders',
  '/my/dasboard'
];


if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
    self.addEventListener('install', function(event) {
        // Perform install steps
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then(function(cache) {
              return cache.addAll(urlsToCache);
            })
        );
      });
      self.addEventListener('fetch', function(event) {
        event.respondWith(
          caches.match(event.request)
            .then(function(response) {
              // Cache hit - return response
              if (response) {
                return response;
              }
              return fetch(event.request);
            }
          )
        );
      });
      self.addEventListener('fetch', function(event) {
        event.respondWith(
          caches.match(event.request)
            .then(function(response) {
              // Cache hit - return response
              if (response) {
                return response;
              }
      
              return fetch(event.request).then(
                function(response) {
                  // Check if we received a valid response
                  if(!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                  }
      
                  // IMPORTANT: Clone the response. A response is a stream
                  // and because we want the browser to consume the response
                  // as well as the cache consuming the response, we need
                  // to clone it so we have two streams.
                  var responseToCache = response.clone();
      
                  caches.open(CACHE_NAME)
                    .then(function(cache) {
                      cache.put(event.request, responseToCache);
                    });
      
                  return response;
                }
              );
            })
          );
      });


      
  }