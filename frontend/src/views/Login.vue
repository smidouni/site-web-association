<!-- frontend/src/views/Login.vue -->

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">Connexion</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="username"
                label="Nom d'utilisateur"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Mot de passe"
                type="password"
                autocomplete="current-password"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" :loading="loading">Se connecter</v-btn>
            </v-form>
            <v-alert v-if="error" type="error" class="mt-4">
              {{ error }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import { setAuth } from '../auth'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: null,
      loading: false,
    }
  },
  methods: {
    async login() {
      this.error = null
      this.loading = true
      try {
        const response = await axios.post('/api/users/login', {
          username: this.username,
          password: this.password,
        })
        const { token, role, userId } = response.data
        setAuth(token, role || 'user', userId) // Mise à jour de l'état réactif
        this.$router.push('/')
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          'Échec de la connexion. Veuillez vérifier vos informations.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
