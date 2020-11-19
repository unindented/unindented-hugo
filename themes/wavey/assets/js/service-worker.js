/*
{{- $articleListCount := .Site.Params.articleListCount | default 10 -}}
{{- $latestArticles := first $articleListCount (where .Site.RegularPages "Type" "in" (slice "blog" "playground")) -}}
{{- $latestArticles = delimit (apply $latestArticles "partial" "utils/rel-permalink" ".") "\", \"" -}}

{{- $offlineImage := (resources.GetMatch "images/offline.svg").Content -}}

{{- $version := now.Format "v20060102" -}}
*/

const version = "{{ $version }}";
const staticCacheName = version + "-static";
const pagesCacheName = version + "-pages";
const imagesCacheName = version + "-images";
const assetsCacheName = version + "-assets";

const offlinePages = ["/", "/about/", "/blog/", "/playground/", "{{ $latestArticles }}"];

const staticAssets = ["/offline.html", "/css/styles.css", "/js/scripts.mjs"];

const updateStaticCache = () => {
  // These items can be cached after install.
  caches.open(staticCacheName).then((cache) => cache.addAll(offlinePages.map((url) => new Request(url))));
  // These items must be cached for the ServiceWorker to complete installation.
  return caches.open(staticCacheName).then((cache) => cache.addAll(staticAssets.map((url) => new Request(url))));
};

const stashInCache = async (cacheName, request, response) => {
  const cache = await caches.open(cacheName);
  cache.put(request, response);
};

const trimCache = async (cacheName, maxItems) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    trimCache(cacheName, maxItems);
  }
};

const clearOldCaches = async () => {
  const keys = await caches.keys();
  const keysToDelete = keys.filter((key) => key.indexOf(version) !== 0);
  return Promise.all(keysToDelete.map((key) => caches.delete(key)));
};

const isRequestOfType = (request, type) => request.headers.get("Accept").indexOf(type) != -1;

const isRequestForOfflinePage = (request) => {
  const { pathname } = new URL(request.url);
  return offlinePages.includes(pathname) || offlinePages.includes(`${pathname}/`);
};

const isRequestForStaticAsset = (request) => {
  const { pathname } = new URL(request.url);
  return staticAssets.includes(pathname);
};

self.addEventListener("install", (event) => {
  event.waitUntil(updateStaticCache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clearOldCaches().then(() => self.clients.claim()));
});

self.addEventListener("message", (event) => {
  if (event.data.command === "trimCaches") {
    trimCache(pagesCacheName, 25);
    trimCache(imagesCacheName, 10);
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const onNetworkResolve = (response) => {
    const cacheCopy = response.clone();

    if (isRequestOfType(request, "text/html")) {
      if (isRequestForOfflinePage(request)) {
        stashInCache(staticCacheName, request, cacheCopy);
      } else {
        stashInCache(pagesCacheName, request, cacheCopy);
      }
    } else if (isRequestOfType(request, "image")) {
      if (isRequestForStaticAsset(request)) {
        stashInCache(staticCacheName, request, cacheCopy);
      } else {
        stashInCache(imagesCacheName, request, cacheCopy);
      }
    } else {
      if (isRequestForStaticAsset(request)) {
        stashInCache(staticCacheName, request, cacheCopy);
      } else {
        stashInCache(assetsCacheName, request, cacheCopy);
      }
    }

    return response;
  };

  const onNetworkReject = async () => {
    if (isRequestOfType(request, "text/html")) {
      const cachedResponse = await caches.match(request);
      return cachedResponse || caches.match("/offline.html");
    }
    if (isRequestOfType(request, "image")) {
      return new Response(`{{ $offlineImage }}`, { headers: { "Content-Type": "image/svg+xml" } });
    }
  };

  const fetchFromNetworkOrFallback = async () => {
    // DevTools opening will trigger these `only-if-cached` requests, which the ServiceWorker can't handle.
    // https://bugs.chromium.org/p/chromium/issues/detail?id=823392
    if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
      return;
    }

    try {
      const response = await fetch(request);
      return onNetworkResolve(response);
    } catch (err) {
      console.error(err);
      return onNetworkReject();
    }
  };

  const cacheOrFetchFromNetworkOrFallback = async () => {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetchFromNetworkOrFallback();
  };

  // For HTML requests, try the network first, then fall back to the cache.
  if (isRequestOfType(request, "text/html")) {
    return event.respondWith(fetchFromNetworkOrFallback());
  }
  // For non-HTML requests, try the cache first, then network if no cache exists, then fallback.
  event.respondWith(cacheOrFetchFromNetworkOrFallback());
});
