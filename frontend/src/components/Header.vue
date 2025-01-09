<template>
  <v-app-bar app color="primary" dark>
    <v-container fluid>
      <v-row class="align-center">
        <!-- Conteneur du titre et des boutons Accueil / Inscription -->
        <v-col class="d-flex align-center">
          <v-toolbar-title>M1 IM et IMDS</v-toolbar-title>
          <v-btn text to="/" aria-label="Accueil">Accueil</v-btn>
          <v-btn text to="/inscription" aria-label="Inscription">Inscription</v-btn>
        </v-col>

        <!-- Conteneur des boutons Vote, Admin, Logout (aligné à droite) -->
        <v-col class="d-flex justify-end align-center">
          <v-btn text to="/vote" v-if="isLoggedIn" aria-label="Vote">Vote</v-btn>
          <v-btn text to="/admin" v-if="isAdmin" aria-label="Admin">Admin</v-btn>
          <v-btn text @click="logout" v-if="isLoggedIn" aria-label="Logout">Logout</v-btn>
          <v-btn text to="/login" v-if="!isLoggedIn" aria-label="Login">Login</v-btn>
        </v-col>
      </v-row>
    </v-container>
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
