import { createApp } from "vue";
import { store } from "@/stores/quiz";

import App from "./App.vue";
import router from "./router";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";

import VueApexCharts from "vue3-apexcharts";

import "./assets/main.css";

/* add icons to the library */
library.add(faArrowDownLong);

createApp(App)
  .use(router)
  .use(store)
  .use(VueApexCharts)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
