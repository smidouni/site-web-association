<template>
  <v-container>
    <!-- Section Informatique et Mobilité -->
    <v-row class="im-section">
      <v-col cols="12" md="6">
        <img src="../assets/fst.jpg" alt="IM Building" class="w-100 section-image" />
      </v-col>
      <v-col cols="12" md="6" class="content-section">
        <h3 class="section-title">Qu'est-ce que l'IM ?</h3>
        <p>
          Le parcours Informatique et Mobilité (IM) forme des étudiants aux technologies modernes de l’informatique
          mobile et connectée. Ce programme met l'accent sur le développement d’applications mobiles, les systèmes
          embarqués, l’internet des objets (IoT), ainsi que les infrastructures cloud pour la gestion de données
          distribuées. Les diplômés acquièrent une double compétence technique et pratique, adaptée aux besoins
          des entreprises modernes.
        </p>
      </v-col>
    </v-row>

    <v-row class="im-section mt-12">
      <v-col cols="12" md="6" class="content-section">
        <h3 class="section-title">Qui sommes-nous ?</h3>
        <p>
          Nous sommes une association d'étudiants du Master 1 Informatique et Mobilité (IM). Notre objectif est de
          promouvoir la collaboration, l’entraide et le développement personnel des étudiants dans ce domaine.
          À travers des projets, des événements professionnels, et des activités sociales, nous favorisons une
          atmosphère propice à la réussite académique et à l’épanouissement individuel. Rejoignez-nous pour découvrir
          un univers où technologie et mobilité se rencontrent !
        </p>
      </v-col>
      <v-col cols="12" md="6">
        <img src="../assets/team1.avif" alt="IM Team" class="w-100 section-image" />
      </v-col>
    </v-row>

    <!-- Section Membres -->
    <h2 class="mt-12 section-title">Nos Membres</h2>
    <v-row>
      <v-col cols="12" md="3" v-for="member in members" :key="member.id">
        <v-card class="mb-4 equal-height-card d-flex flex-column">
          <!-- Image -->
          <v-img :src="member.image" alt="member.name" height="150px"></v-img>
          <!-- Content -->
          <v-card-title>{{ member.name }}</v-card-title>
          <v-card-subtitle>{{ member.role }}</v-card-subtitle>
          <v-card-text class="flex-grow-1">
            {{ member.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section Actualités -->
    <h2 class="mt-12">Actualités</h2>
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
import axios from "axios";
import Comments from "../components/Comments.vue";

export default {
  name: "Home",
  components: {
    Comments,
  },
  data() {
    return {
      newsItems: [],
      loading: false,
      error: null,
      members: [
        {
          id: 1,
          name: "Samy Midouni",
          role: "Président",
          description: "Samy est en charge de la gestion de l'association.",
          image: "./assets/alice.jpg",
        },
        {
          id: 2,
          name: "Badr Boukries",
          role: "Trésorier",
          description: "Badr gère les finances de l'association.",
          image: "./assets/jean.jpg",
        },
        {
          id: 3,
          name: "Mehdi Kaidi",
          role: "Secrétaire",
          description: "Mehdi s'occupe de l'administration.",
          image: "./assets/sophie.jpg",
        },
        {
          id: 4,
          name: "Romain Broutin",
          role: "Responsable événementiel",
          description: "Romain organise les événements de l'association.",
          image: "./assets/paul.jpg",
        },
      ],
    };
  },
  mounted() {
    this.fetchNews();
  },
  methods: {
    async fetchNews() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("/api/news");
        this.newsItems = response.data;
      } catch (err) {
        this.error = "Erreur lors du chargement des actualités.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    truncateContent(content) {
      const maxLength = 150;
      return content.length > maxLength
        ? content.substring(0, maxLength) + "..."
        : content;
    },
    viewNews(newsId) {
      this.$router.push(`/news/${newsId}`);
    },
  },
};
</script>

<style scoped>
/* Section Styling */
.im-section {
  align-items: center;
}

.section-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
}

.content-section {
  padding: 20px;
}

.section-image {
  border-radius: 8px;
  object-fit: cover;
}

/* Membres Section */
.equal-height-card {
  height: 100%; /* Ensure all cards stretch to the same height */
}

.flex-grow-1 {
  flex-grow: 1; /* Ensure text expands to fill the available space */
}

.v-card {
  display: flex;
  flex-direction: column; /* Align content vertically */
}

.v-card-title,
.v-card-subtitle {
  text-align: center;
}

/* Carousel Item Styling */
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
