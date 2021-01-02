importScripts(
  "https://momentjs.com/downloads/moment.min.js",
  "https://momentjs.com/downloads/moment-timezone-with-data-10-year-range.min.js"
);

workbox.precaching.precacheAndRoute(self.__precacheManifest);

const cacheExpTime = moment()
  .tz("Europe/Berlin")
  .add(1, "day")
  .startOf("day");
const cacheTimeLeft = moment.duration(cacheExpTime.diff(moment())).asSeconds();

// Fiat rates are updated only at midnight (at least with provided API),
// so it's okay to serve them from cache all the time and update only at midnight.
workbox.routing.registerRoute(
  /https:\/\/api\.exchangeratesapi\.io.*/,
  new workbox.strategies.CacheFirst({
    cacheName: "fiat-rates",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: cacheTimeLeft
      })
    ]
  })
);

// Crypto rates are updated very frequently, so it's best to serve them from
// network by default. However, they can be kept in cache to provide some
// functionality (i.e. not up-to-date) even when offline.
workbox.routing.registerRoute(
  /https:\/\/api\.binance\.com.*/,
  new workbox.strategies.NetworkFirst({
    cacheName: "crypto-rates",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: cacheTimeLeft
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\.(?:png|ico|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);
