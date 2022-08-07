import { createRouter, createWebHistory } from "vue-router";

import { defineAsyncComponent } from "vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => Promise.resolve(defineAsyncComponent(() => import("../views/HomeView.vue"))),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "different",
    component: () => Promise.resolve(defineAsyncComponent(() => import("../views/HomeView.vue"))),
  },
  {
    path: "/quiz",
    name: "quiz",
    component: () => Promise.resolve(defineAsyncComponent(() =>
      import(/* webpackChunkName: "quizview" */ "@/views/QuizView.vue"))),
  },
  {
    path: "/answers",
    name: "answers",
    component: () => Promise.resolve(defineAsyncComponent(() =>
      import(/* webpackChunkName: "answersview" */ "@/views/AnswersView.vue"))),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
