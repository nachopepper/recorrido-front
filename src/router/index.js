import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/show",
    name: "show",
    component: () =>
      import(/* webpackChunkName: "show" */ "../views/ShowView.vue"),
  },
  {
    path: "/:pathMatch(.*)*", // Esto captura todas las rutas no definidas
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(), // Usa la API de historial HTML5
  routes,
});

export default router;
