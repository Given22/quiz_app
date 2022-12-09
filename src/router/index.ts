import { createRouter, createWebHistory } from "vue-router";
import { defineAsyncComponent } from "vue";

const routes = [
  // Home page with form to search quiz
  {
    path: "/",
    name: "home",
    component: () => Promise.resolve(defineAsyncComponent(() => import("../views/HomeView.vue"))),
  },
  // If path not exist it shows home page
  {
    path: "/:pathMatch(.*)*",
    name: "different",
    component: () => Promise.resolve(defineAsyncComponent(() => import("../views/HomeView.vue"))),
  },
  // Page with quiz 
  {
    path: "/quiz",
    name: "quiz",
    component: () => Promise.resolve(defineAsyncComponent(() =>
      import("@/views/QuizView.vue"))),
  },
  // Page with final stats and answers
  {
    path: "/answers",
    name: "answers",
    component: () => Promise.resolve(defineAsyncComponent(() =>
      import("@/views/AnswersView.vue"))),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
