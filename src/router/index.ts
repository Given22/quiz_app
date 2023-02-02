import { createRouter, createWebHistory } from "vue-router";
import { defineAsyncComponent } from "vue";

const routes = [
  // Home page
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  // If path not exist it shows home page
  {
    path: "/:pathMatch(.*)*",
    name: "different",
    redirect: '/home'
  },
  // Page with form
  {
    path: "/form",
    name: "form",
    component: defineAsyncComponent(() => import("@/views/FormView.vue")),
  },
  // Page with quiz
  {
    path: "/quiz",
    name: "quiz",
    component: defineAsyncComponent(() => import("@/views/QuizView.vue")),
  },
  // Page with final stats and answers
  {
    path: "/answers",
    name: "answers",
    component: defineAsyncComponent(() => import("@/views/FinalView.vue")),
  },
  {
    path: "/statistics",
    name: "statistics",
    component: defineAsyncComponent(() => import("@/views/StatisticsView.vue")),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
