import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import runtime from "serviceworker-webpack-plugin/lib/runtime";

if ("serviceWorker" in navigator) {
  runtime.register();
}

createApp(App).mount("#app");
