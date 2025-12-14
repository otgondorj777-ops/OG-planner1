const CACHE_NAME = "og-planner-cache-v1";
const ASSETS = [
  "/OG-planner1/",
  "/OG-planner1/index.html",
  "/OG-planner1/icon-192.png",
  "/OG-planner1/icon-512.png",
  "/OG-planner1/manifest.json"
];

// install – static asset-уудыг cache-д хадгална
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// activate – хуучин cache-уудыг цэвэрлэнэ
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// fetch – offline үед cache-ээс уншина
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

// push event – дараа нь web push нэмэхэд ашиглана
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "OG Planner reminder";
  const options = {
    body: data.body || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: data.url || "/OG-planner1/"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data || "/OG-planner1/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      const hadWindow = clientsArr.some((w) => {
        if (w.url.includes(url)) {
          w.focus();
          return true;
        }
        return false;
      });
      if (!hadWindow) return clients.openWindow(url);
    })
  );
});

