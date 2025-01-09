// frontend/src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import { authState } from "../auth"; // Importer l'état d'authentification réactif

// Import des vues
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Admin from "../views/Admin.vue";
import Vote from "../views/Vote.vue";
import Inscription from "../views/Inscription.vue"; // Import Inscription view

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guest: true }, // Ajouter le meta field 'guest'
  },
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
  const isLoggedIn = !!authState.token; // Utiliser l'état réactif
  const role = authState.role;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: "Login" });
  } else if (to.meta.requiresAdmin && role !== "admin") {
    next({ name: "Home" });
  } else if (to.meta.guest && isLoggedIn) {
    // Si la route est réservée aux invités et que l'utilisateur est connecté
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
