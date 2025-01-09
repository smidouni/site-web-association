<template>
  <v-app-bar app color="primary" dark>
    <!-- Conteneur flex pour gérer l'alignement du logo et du texte -->
    <div class="d-flex align-center">
      <!-- Logo à gauche -->
      <img
        :src="logo"
        alt="Logo"
        class="logo mr-2"
      />
      <!-- Texte "M1 IM et IMDS" -->
      <v-toolbar-title class="mr-0">M1 IM et IMDS</v-toolbar-title>

      <!-- Boutons Accueil et Inscription -->
      <v-btn text to="/" aria-label="Accueil" class="ml-0">Accueil</v-btn>
      <v-btn text to="/inscription" aria-label="Inscription" class="ml-0">Inscription</v-btn>
    </div>

    <!-- Spacer pour repousser les autres boutons à droite -->
    <v-spacer></v-spacer>

    <!-- Placer les boutons Vote, Admin, Logout à droite -->
    <v-btn text to="/vote" v-if="isLoggedIn" aria-label="Vote">Vote</v-btn>
    <v-btn text to="/admin" v-if="isAdmin" aria-label="Admin">Admin</v-btn>
    <v-btn text @click="logout" v-if="isLoggedIn" aria-label="Logout">Logout</v-btn>

    <!-- Bouton Login tout à droite -->
    <v-btn text to="/login" v-if="!isLoggedIn" aria-label="Login">Login</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      logo: require('./artwork.png'), // Import the logo file
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

<style scoped>
.ml-0 {
  margin-left: 0px; /* Aucun espacement entre les éléments */
}

.mr-0 {
  margin-right: 0px; /* Aucun espacement entre le texte et les éléments suivants */
}

.logo {
  height: 60px; /* Increase the height of the logo */
  width: auto; /* Maintain aspect ratio */
  display: inline-block;
  vertical-align: middle;
}
</style>
