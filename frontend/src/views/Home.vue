<!-- frontend/src/views/Home.vue -->

<template>
  <v-container>
    <h1>Bienvenue à l'association Master IM et IMDS</h1>
    <p>
      Nous sommes une association dynamique dédiée à soutenir les étudiants des
      masters Informatique et Mathématiques & Data Science.
    </p>

    <h2>Actualités</h2>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="64"
      class="my-8"
    ></v-progress-circular>
    
    <v-carousel
      v-else
      hide-delimiters
      show-arrows="hover"
      class="mt-4"
    >
      <v-carousel-item
        v-for="news in newsItems"
        :key="news.id"
        :src="news.image_url"
        cover
      >
        <v-sheet
          color="rgba(0, 0, 0, 0.5)"
          height="100%"
          class="d-flex flex-column justify-end pa-4"
        >
          <v-card-title class="white--text">{{ news.title }}</v-card-title>
          <v-card-text class="white--text">
            {{ truncateContent(news.content) }}
          </v-card-text>
          <v-btn
            color="primary"
            @click="viewNews(news.id)"
            class="mt-2"
          >
            Lire la suite
          </v-btn>
          <Comments :newsId="news.id" />
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
    
    <v-alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script>
import axios from 'axios'
import Comments from '../components/Comments.vue'

export default {
  name: 'Home',
  components: {
    Comments,
  },
  data() {
    return {
      newsItems: [],
      loading: false,
      error: null,
    }
  },
  mounted() {
    this.fetchNews()
  },
  methods: {
    async fetchNews() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/news')
        this.newsItems = response.data
      } catch (err) {
        this.error = 'Erreur lors du chargement des actualités.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    truncateContent(content) {
      const maxLength = 150
      return content.length > maxLength
        ? content.substring(0, maxLength) + '...'
        : content
    },
    viewNews(newsId) {
      // Rediriger vers une page détaillée si disponible
      // Sinon, peut-être ouvrir un dialog avec les détails
      // Pour l'instant, simplement alerter l'ID
      this.$router.push(`/news/${newsId}`)
    },
  },
}
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
h2 {
  margin-top: 40px;
  margin-bottom: 20px;
}
.v-carousel-item {
  position: relative;
}
.v-sheet {
  background: rgba(0, 0, 0, 0.5);
}
.white--text {
  color: white !important;
}
</style>
