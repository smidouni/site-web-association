<!-- frontend/src/components/Header.vue -->

<template>
  <v-app-bar app color="primary" dark>
    <v-container fluid>
      <v-row align="center" justify="space-between" no-gutters>
        
        <!-- Left Section: Logo and Title -->
        <v-col cols="auto" class="d-flex align-center">
          <v-img
            :src="logo"
            alt="Logo"
            height="60"
            class="mr-2"
          ></v-img>
          <v-toolbar-title>M1 IM et IMDS</v-toolbar-title>
        </v-col>
        
        <!-- Center Section: Navigation Buttons -->
        <v-col cols="auto" class="d-flex">
          <v-btn text to="/" aria-label="Accueil">Accueil</v-btn>
          <v-btn text to="/inscription" aria-label="Inscription">Inscription</v-btn>
          <v-btn text to="/vote" v-if="isLoggedIn" aria-label="Vote">Vote</v-btn>
          <v-btn text to="/admin" v-if="isAdmin" aria-label="Admin">Admin</v-btn>
        </v-col>
        
        <!-- Right Section: Login/Logout Button -->
        <v-col cols="auto" class="d-flex">
          <v-btn text @click="logout" v-if="isLoggedIn" aria-label="Logout">Logout</v-btn>
          <v-btn text to="/login" v-else aria-label="Login">Login</v-btn>
        </v-col>
        
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import logo from '@/assets/logo.png'; // Ensure the path is correct

export default {
  name: 'Header',
  data() {
    return {
      logo: logo, // Assign the imported image to the logo data property
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },
    isAdmin() {
      return localStorage.getItem('role') === 'admin';
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      this.$router.push('/login');
    },
  },
};
</script>