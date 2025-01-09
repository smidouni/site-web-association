// frontend/src/auth.js

import { reactive } from "vue";

const authState = reactive({
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  userId: localStorage.getItem("userId") || null,
});

const setAuth = (token, role, userId) => {
  authState.token = token;
  authState.role = role;
  authState.userId = userId;
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("userId", userId);
};

const clearAuth = () => {
  authState.token = null;
  authState.role = null;
  authState.userId = null;
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};

export { authState, setAuth, clearAuth };
