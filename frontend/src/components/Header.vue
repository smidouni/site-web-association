<template>
  <v-app-bar app color="primary" dark height="64">
    <!-- Left Section: Logo, Title, and Navigation -->
    <div class="d-flex align-center left-section">
      <div class="logo-container">
        <v-img
          :src="logo"
          alt="Logo"
          max-height="48"
          max-width="48"
          contain
        ></v-img>
      </div>
      <div class="text-h6 mr-6 site-title">M1 IM et IMDS</div>
      
      <v-btn text to="/" aria-label="Accueil" class="ml-2">Accueil</v-btn>
      <v-btn text to="/inscription" aria-label="Inscription">Inscription</v-btn>
      <v-btn text to="/vote" v-if="isLoggedIn" aria-label="Vote">Vote</v-btn>
      <v-btn text to="/admin" v-if="isAdmin" aria-label="Admin">Admin</v-btn>
    </div>

    <!-- Right Section: Login/Logout Button -->
    <v-spacer></v-spacer>
    <v-btn text @click="logout" v-if="isLoggedIn" aria-label="Logout">Logout</v-btn>
    <v-btn text to="/login" v-else aria-label="Login">Login</v-btn>
  </v-app-bar>
</template>

<script>
import logo from '@/assets/logo.png';
import { authState, clearAuth } from '@/auth';

export default {
  name: 'Header',
  data() {
    return {
      logo: logo,
    };
  },
  computed: {
    isLoggedIn() {
      return !!authState.token;
    },
    isAdmin() {
      return authState.role === 'admin';
    },
  },
  methods: {
    logout() {
      clearAuth();
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.site-title {
  white-space: nowrap;
  overflow: visible;
}

.logo-container {
  width: 48px;
  height: 48px;
  margin-right: 12px;
}

.left-section {
  min-width: 0;
  flex: 1;
}
</style>