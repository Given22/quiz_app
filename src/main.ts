import { createApp } from "vue";
import { store } from "@/stores/quiz";

import App from "./App.vue";
import router from "./router";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import VueApexCharts from "vue3-apexcharts";

import "./assets/main.css";

createApp(App)
  .use(router)
  .use(store)
  .use(VueApexCharts)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
