importScripts(
  "https://momentjs.com/downloads/moment.min.js",
  "https://momentjs.com/downloads/moment-timezone-with-data-10-year-range.min.js"
);

workbox.precaching.precacheAndRoute(self.__precacheManifest);

const fiatCacheExpTime = moment()
  .tz("Europe/Berlin")
  .add(1, "day")
  .startOf("day");
const fiatCacheTimeLeft = moment
  .duration(fiatCacheExpTime.diff(moment()))
  .asSeconds();

workbox.routing.registerRoute(
  /https:\/\/api\.exchangeratesapi\.io.*/,
  new workbox.strategies.CacheFirst({
    cacheName: "fiat-rates",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: fiatCacheTimeLeft // start of the next day
      })
    ]
  })
);

const cryptoCacheTimeLeft = fiatCacheTimeLeft;
workbox.routing.registerRoute(
  /https:\/\/api\.binance\.com.*/,
  new workbox.strategies.CacheFirst({
    cacheName: "crypto-rates",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: cryptoCacheTimeLeft // TODO - Should it be cached at all?
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
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

workbox.routing.registerRoute(
  new RegExp("https://newsapi.org/v2/top-headlines(.*)"),
  new workbox.strategies.NetworkFirst({
    cacheName: "news-api"
  })
);
