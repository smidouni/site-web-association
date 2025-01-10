<template>
  <v-container>
    <h1>Administration</h1>

    <v-tabs v-model="tab" background-color="primary" dark>
      <v-tab :value="0">Ajouter une Actualité</v-tab>
      <v-tab :value="1">Gestion des Utilisateurs</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <!-- Gestion des Utilisateurs -->
      <v-tab-item :value="0" v-if="tab === 1">
        <v-card class="pa-4">
          <v-btn color="primary" class="mb-4" @click="fetchUsers">Charger les utilisateurs</v-btn>
          <v-alert v-if="userMessage" :type="userError ? 'error' : 'success'" class="mt-4">
            {{ userMessage }}
          </v-alert>
          <v-data-table
            :headers="userHeaders"
            :items="users"
            :items-per-page="5"
            class="elevation-1 mt-4"
          >
            <template #item.actions="{ item }">
              <v-btn color="error" text @click="confirmDelete(item)">Supprimer</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>

      <!-- Ajouter une Actualité -->
      <v-tab-item :value="1" v-if="tab === 0">
        <v-card class="pa-4">
          <v-form ref="newsForm" @submit.prevent="addNews">
            <v-text-field
              v-model="newsTitle"
              label="Titre"
              :rules="[v => !!v || 'Titre requis']"
              required
            ></v-text-field>
            <v-textarea
              v-model="newsContent"
              label="Contenu"
              :rules="[v => !!v || 'Contenu requis']"
              required
            ></v-textarea>
            <v-text-field
              v-model="newsImage"
              label="URL de l'image"
              :rules="[v => !!v || 'URL de l\'image requise', v => validURL(v) || 'URL invalide']"
              required
            ></v-text-field>
            <v-btn type="submit" color="success" :loading="loading">Ajouter</v-btn>
          </v-form>
          <v-alert v-if="newsMessage" :type="newsError ? 'error' : 'success'" class="mt-4">
            {{ newsMessage }}
          </v-alert>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Admin",
  data() {
    return {
      tab: 0, // Définit l'onglet actif par défaut
      users: [],
      userHeaders: [
        { text: "ID", value: "id" },
        { text: "Nom d'utilisateur", value: "username" },
        { text: "Rôle", value: "role" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      selectedUser: null,
      dialog: false,
      userMessage: "",
      userError: false,
      newsTitle: "",
      newsContent: "",
      newsImage: "",
      newsMessage: "",
      newsError: false,
      loading: false,
    };
  },
  methods: {
    async fetchUsers() {
      this.userMessage = "";
      this.userError = false;
      try {
        const response = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (Array.isArray(response.data)) {
          this.users = response.data;
          this.userMessage = "Liste des utilisateurs chargée avec succès.";
          this.userError = false;
        } else {
          throw new Error("Données invalides reçues du serveur.");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs :", err);
        this.users = [];
        this.userMessage =
          "Erreur lors du chargement des utilisateurs. Veuillez réessayer.";
        this.userError = true;
      }
    },
    confirmDelete(user) {
      this.selectedUser = user;
      this.dialog = true;
    },
    async deleteUser() {
      try {
        await axios.delete(`/api/users/${this.selectedUser.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.userMessage = "Utilisateur supprimé avec succès.";
        this.userError = false;
        this.fetchUsers(); // Refresh the user list
      } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
        this.userMessage =
          "Erreur lors de la suppression de l'utilisateur. Veuillez réessayer.";
        this.userError = true;
      } finally {
        this.dialog = false;
      }
    },
    validURL(str) {
      const pattern = new RegExp(
        "^(https?:\\/\\/)?([\\w.-]+)+([\\w]{2,})(:[0-9]{1,5})?(\\/\\S*)?$",
        "i"
      );
      return !!pattern.test(str);
    },
    async addNews() {
      this.newsMessage = "";
      this.newsError = false;
      this.loading = true;
      try {
        await axios.post(
          "/api/news",
          {
            title: this.newsTitle,
            content: this.newsContent,
            image_url: this.newsImage,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.newsMessage = "Actualité ajoutée avec succès.";
        this.newsError = false;
        this.newsTitle = "";
        this.newsContent = "";
        this.newsImage = "";
      } catch (err) {
        console.error("Erreur lors de l'ajout de l'actualité :", err);
        this.newsMessage =
          "Erreur lors de l'ajout de l'actualité. Veuillez réessayer.";
        this.newsError = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
