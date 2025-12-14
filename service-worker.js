{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww12720\viewh7800\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const CACHE_NAME = "og-planner-cache-v1";\
const ASSETS = [\
  "/OG-planner1/",\
  "/OG-planner1/index.html",\
  "/OG-planner1/icon-192.png",\
  "/OG-planner1/icon-512.png",\
  "/OG-planner1/manifest.json"\
];\
\
// install \'96 static asset-\uc0\u1091 \u1091 \u1076 \u1099 \u1075  cache-\u1076  \u1093 \u1072 \u1076 \u1075 \u1072 \u1083 \u1085 \u1072 \
self.addEventListener("install", (event) => \{\
  event.waitUntil(\
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))\
  );\
\});\
\
// activate \'96 \uc0\u1093 \u1091 \u1091 \u1095 \u1080 \u1085  cache-\u1091 \u1091 \u1076 \u1099 \u1075  \u1094 \u1101 \u1074 \u1101 \u1088 \u1083 \u1101 \u1085 \u1101 \
self.addEventListener("activate", (event) => \{\
  event.waitUntil(\
    caches.keys().then((keys) =>\
      Promise.all(keys.map((key) => \{\
        if (key !== CACHE_NAME) return caches.delete(key);\
      \}))\
    )\
  );\
\});\
\
// fetch \'96 offline \uc0\u1199 \u1077 \u1076  cache-\u1101 \u1101 \u1089  \u1091 \u1085 \u1096 \u1080 \u1085 \u1072 \
self.addEventListener("fetch", (event) => \{\
  event.respondWith(\
    caches.match(event.request).then((cached) => cached || fetch(event.request))\
  );\
\});\
\
// push event \'96 \uc0\u1076 \u1072 \u1088 \u1072 \u1072  \u1085 \u1100  web push \u1085 \u1101 \u1084 \u1101 \u1093 \u1101 \u1076  \u1072 \u1096 \u1080 \u1075 \u1083 \u1072 \u1085 \u1072 \
self.addEventListener("push", (event) => \{\
  const data = event.data ? event.data.json() : \{\};\
  const title = data.title || "OG Planner reminder";\
  const options = \{\
    body: data.body || "",\
    icon: "icon-192.png",\
    badge: "icon-192.png",\
    data: data.url || "/OG-planner1/"\
  \};\
  event.waitUntil(self.registration.showNotification(title, options));\
\});\
\
self.addEventListener("notificationclick", (event) => \{\
  event.notification.close();\
  const url = event.notification.data || "/OG-planner1/";\
  event.waitUntil(\
    clients.matchAll(\{ type: "window", includeUncontrolled: true \}).then((clientsArr) => \{\
      const hadWindow = clientsArr.some((w) => \{\
        if (w.url.includes(url)) \{ w.focus(); return true; \}\
        return false;\
      \});\
      if (!hadWindow) return clients.openWindow(url);\
    \})\
  );\
\});\
}