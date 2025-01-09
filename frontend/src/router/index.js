// frontend/src/router/index.js

import { createRouter, createWebHistory } from "vue-router";

// Import des vues
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Admin from "../views/Admin.vue";
import Vote from "../views/Vote.vue";
import Inscription from "../views/Inscription.vue"; // Import Inscription view

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/vote",
    name: "Vote",
    component: Vote,
    meta: { requiresAuth: true },
  },
  {
    path: "/inscription", // New route for Inscription
    name: "Inscription",
    component: Inscription,
  },
  // Route 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
];

// Création du routeur
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (to.meta.requiresAuth && !token) {
    next({ name: "Login" });
  } else if (to.meta.requiresAdmin && role !== "admin") {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
