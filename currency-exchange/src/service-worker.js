import { registerRoute } from "workbox-routing";
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst
} from "workbox-strategies";
import { Plugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute([]);

registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      new Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);

registerRoute(
  new RegExp("https://newsapi.org/v2/top-headlines(.*)"),
  new NetworkFirst({
    cacheName: "news-api"
  })
);

registerRoute(
  new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
  new CacheFirst({
    cacheName: "googleapis",
    plugins: [
      new Plugin({
        maxEntries: 30
      })
    ]
  })
);
