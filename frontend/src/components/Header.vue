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
  </v-app-bar>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authState, clearAuth } from '../auth'

export default {
  name: 'Header',
  setup() {
    const router = useRouter()

    const isLoggedIn = computed(() => !!authState.token)
    const isAdmin = computed(() => authState.role === 'admin')

    const logout = () => {
      clearAuth()
      // Redirection après déconnexion
      router.push('/login')
    }

    return {
      isLoggedIn,
      isAdmin,
      logout,
    }
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
</style>
