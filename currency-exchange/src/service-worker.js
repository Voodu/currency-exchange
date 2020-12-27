import moment from "moment-timezone";
import { registerRoute } from "workbox-routing";
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst
} from "workbox-strategies";
import { Plugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute([]);

const fiatCacheExpTime = moment()
  .tz("Europe/Berlin")
  .add(1, "day")
  .startOf("day");
const fiatCacheTimeLeft = moment
  .duration(fiatCacheExpTime.diff(moment()))
  .asSeconds();

registerRoute(
  new RegExp("https://api.exchangeratesapi.io/latest"),
  new CacheFirst({
    cacheName: "fiat-rates",
    plugins: [
      new Plugin({
        maxAgeSeconds: fiatCacheTimeLeft // start of the next day
      })
    ]
  })
);

const cryptoCacheTimeLeft = fiatCacheTimeLeft;
registerRoute(
  new RegExp("https://api.binance.com/api/v3/ticker/price"),
  new CacheFirst({
    cacheName: "crypto-rates",
    plugins: [
      new Plugin({
        maxAgeSeconds: cryptoCacheTimeLeft // TODO - Should it be cached at all?
      })
    ]
  })
);

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
