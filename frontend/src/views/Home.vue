<template>
  <v-container>
    <!-- Section Informatique et Mobilité -->
    <v-row class="im-section">
      <v-col cols="12" md="6">
        <img :src="fstImage" alt="IM Building" class="w-100 section-image" />
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
        <img :src="team1Image" alt="IM Team" class="w-100 section-image" />
      </v-col>
    </v-row>

    <!-- Section Membres -->
    <h2 class="mt-12 section-title">Nos Membres</h2>
    <v-row>
      <v-col cols="12" md="3" v-for="member in members" :key="member.id">
        <v-card class="mb-4 equal-height-card d-flex flex-column">
          <v-img :src="member.image" :alt="member.name" height="150px"></v-img>
          <v-card-title>{{ member.name }}</v-card-title>
          <v-card-subtitle>{{ member.role }}</v-card-subtitle>
          <v-card-text class="flex-grow-1">
            {{ member.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section Actualités -->
    <h2 class="mt-12 section-title">Actualités</h2>

    <!-- News Carousel -->
    <div class="news-carousel">
      <v-btn icon @click="prevCard">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <div class="news-cards">
        <v-card
          v-for="(news, index) in visibleNews"
          :key="news.id"
          class="news-card"
          elevation="3"
          @click="viewNews(news)"
        >
          <v-img
            :src="news.image_url"
            height="200px"
            class="rounded-t"
            alt="News Image"
          ></v-img>
          <v-card-text>
            <div class="news-date">{{ formatDate(news.date) }}</div>
            <h3 class="news-title">{{ news.title }}</h3>
            <p class="news-content">
              {{ truncateContent(news.content) }}
            </p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary" depressed @click.stop="viewNews(news)">
              Lire la suite
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <v-btn icon @click="nextCard">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <!-- News Modal -->
    <v-dialog v-model="showNewsModal" max-width="600px">
      <v-card>
        <v-card-title>{{ selectedNews?.title }}</v-card-title>
        <v-card-text>
          <v-img
            :src="selectedNews?.image_url"
            height="300px"
            alt="News Image"
            class="mb-4"
          ></v-img>
          <p>{{ selectedNews?.content }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeNewsModal">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script>
import axios from "axios";
import fstImage from "@/assets/fst.jpg"; // Import fst.jpg
import team1Image from "@/assets/team1.avif"; // Import team1.avif
import placeholderAvatar from "@/assets/placeholder-avatar.jpg"; // Import placeholder

export default {
  name: "Home",
  data() {
    return {
      newsItems: [
        {
          id: 1,
          title: "La révolution de l'IA",
          content: "Plongez dans l'impact de l'intelligence artificielle.",
          image_url: "https://via.placeholder.com/300x200",
          date: "2025-01-10",
        },
        {
          id: 2,
          title: "Hackathon 2024",
          content: "Participez à notre hackathon et collaborez avec des experts.",
          image_url: "https://via.placeholder.com/300x200",
          date: "2025-01-15",
        },
        {
          id: 3,
          title: "Conférence IoT",
          content: "Apprenez les nouvelles tendances de l'IoT.",
          image_url: "https://via.placeholder.com/300x200",
          date: "2025-01-20",
        },
        {
          id: 4,
          title: "Atelier Cloud Computing",
          content: "Introduction pratique au cloud computing.",
          image_url: "https://via.placeholder.com/300x200",
          date: "2025-02-01",
        },
      ],
      members: [
        {
          id: 1,
          name: "Samy Midouni",
          role: "Président",
          description: "Sami est en charge de la gestion de l'association.",
          image: placeholderAvatar,
        },
        {
          id: 2,
          name: "Badr Boukries",
          role: "Trésorier",
          description: "Badr gère les finances de l'association.",
          image: placeholderAvatar,
        },
        {
          id: 3,
          name: "Mehdi Kaidi",
          role: "Secrétaire",
          description: "Mehdi s'occupe de l'administration.",
          image: placeholderAvatar,
        },
        {
          id: 4,
          name: "Romain Broutin",
          role: "Responsable événementiel",
          description: "Romain organise les événements de l'association.",
          image: placeholderAvatar,
        },
      ],
      currentIndex: 0,
      showNewsModal: false,
      selectedNews: null,
      fstImage,
      team1Image,
    };
  },
  computed: {
    visibleNews() {
      const visible = [];
      for (let i = 0; i < 3; i++) {
        const index = (this.currentIndex + i) % this.newsItems.length;
        visible.push(this.newsItems[index]);
      }
      return visible;
    },
  },
  methods: {
    nextCard() {
      this.currentIndex = (this.currentIndex + 1) % this.newsItems.length;
    },
    prevCard() {
      this.currentIndex =
        (this.currentIndex - 1 + this.newsItems.length) %
        this.newsItems.length;
    },
    truncateContent(content) {
      const maxLength = 100;
      return content.length > maxLength
        ? content.substring(0, maxLength) + "..."
        : content;
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("fr-FR", options);
    },
    viewNews(news) {
      this.selectedNews = news;
      this.showNewsModal = true;
    },
    closeNewsModal() {
      this.showNewsModal = false;
      this.selectedNews = null;
    },
  },
};
</script>

<style scoped>
.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.news-carousel {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.news-cards {
  display: flex;
  gap: 16px;
}

.news-card {
  flex: 0 0 300px;
  border-radius: 12px;
  transition: transform 0.2s;
  background: #fff;
}

.news-card:hover {
  transform: scale(1.05);
}

.news-card .rounded-t {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.news-date {
  font-size: 14px;
  color: #777;
  text-align: center;
  margin-bottom: 8px;
}

.news-title {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
  text-align: center;
  margin-bottom: 12px;
}

.news-content {
  font-size: 14px;
  color: #555;
  text-align: center;
  margin-bottom: 16px;
}

.v-btn[icon] {
  border-radius: 50%;
  background-color: #f5f5f5;
  color: #555;
  height: 40px;
  width: 40px;
}

.v-btn[icon]:hover {
  background-color: #e0e0e0;
}

.section-image {
  border-radius: 8px;
  object-fit: cover;
}

.equal-height-card {
  height: 100%;
}
</style>
