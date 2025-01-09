<template>
  <v-app-bar app color="primary" dark>
    <!-- Conteneur flex pour gérer l'alignement du texte et des boutons -->
    <div class="d-flex align-center">
      <!-- Texte "M1 IM et IMDS" sans marge -->
      <v-toolbar-title class="mr-0">M1 IM et IMDS</v-toolbar-title>
      
      <!-- Boutons Accueil et Inscription collés au texte -->
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

    <!-- Bouton de thème sombre -->
    <v-switch
      v-model="isDarkTheme"
      @change="toggleTheme"
      label="Thème Sombre"
      class="ml-4"
      hide-details
      inset
      aria-label="Basculer le thème sombre"
    ></v-switch>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isDarkTheme: false,
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    },
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    },
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark'
      this.$vuetify.theme.dark = this.isDarkTheme
    }
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = this.isDarkTheme
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light')
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.ml-0 {
  margin-left: 0px; /* Aucun espacement entre les éléments */
}

.mr-0 {
  margin-right: 0px; /* Aucun espacement entre le texte et les éléments suivants */
}

.ml-4 {
  margin-left: 16px; /* Marge pour le bouton de thème sombre */
}
</style>
