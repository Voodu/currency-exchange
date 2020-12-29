import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import runtime from "serviceworker-webpack-plugin/lib/runtime";
import "bootstrap/dist/css/bootstrap.min.css";

const useSw = false;
if ("serviceWorker" in navigator && useSw) {
  runtime.register();
} else {
  console.log("Service worker has been disabled in main.js");
}

createApp(App).mount("#app");
