<!-- frontend/src/components/Footer.vue -->

<template>
    <v-footer app color="primary" dark>
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="6">
            <p>© 2025 Master IM & IMDS - Tous droits réservés</p>
            <p>Contact : association@masterimimds.com</p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <v-btn icon href="https://facebook.com" target="_blank" aria-label="Facebook">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon href="https://instagram.com" target="_blank" aria-label="Instagram">
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
            <v-btn icon href="https://discord.com" target="_blank" aria-label="Discord">
              <v-icon>mdi-discord</v-icon>
            </v-btn>
            <v-btn icon href="mailto:association@masterimimds.com" aria-label="Email">
              <v-icon>mdi-email</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script>
  export default {
    name: 'Footer',
  }
  </script>
  
  <style scoped>
  p {
    margin: 0;
  }
  </style>
  