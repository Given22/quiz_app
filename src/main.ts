import { createApp } from "vue";
import { store } from "@/stores/quiz";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

createApp(App).use(router).use(store).mount("#app");
