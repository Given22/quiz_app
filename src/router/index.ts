import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "different",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/quiz",
    name: "quiz",
    component: () =>
      import(/* webpackChunkName: "quizview" */ "@/views/QuizView.vue"),
  },
  {
    path: "/answers",
    name: "answers",
    component: () =>
      import(/* webpackChunkName: "answersview" */ "@/views/AnswersView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
