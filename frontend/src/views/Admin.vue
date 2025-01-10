<template>
  <v-container>
    <h1>Administration</h1>

    <v-tabs v-model="activeTab">
      <v-tab value="users">Gestion des Utilisateurs</v-tab>
      <v-tab value="add-user">Ajouter un Utilisateur</v-tab>
      <v-tab value="add-news">Ajouter une Actualité</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- Users Management Tab -->
      <v-window-item value="users">
        <v-card class="pa-4">
          <v-alert
            v-if="userMessage"
            :type="userError ? 'error' : 'success'"
            class="mt-4"
          >
            {{ userMessage }}
          </v-alert>
          
          <v-data-table
            :headers="userHeaders"
            :items="users"
            :items-per-page="5"
            class="elevation-1 mt-4"
            :loading="loadingUsers"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn color="info" text @click="openEditDialog(item)">
                Modifier
              </v-btn>
              <v-btn color="error" text @click="confirmDelete(item)">
                Supprimer
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>

      <!-- Add User Tab -->
      <v-window-item value="add-user">
        <v-card class="pa-4">
          <v-form @submit.prevent="addUser">
            <v-text-field
              v-model="newUser.username"
              label="Nom d'utilisateur"
              :rules="[v => !!v || 'Nom d\'utilisateur requis']"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="newUser.password"
              label="Mot de passe"
              type="password"
              :rules="[v => !!v || 'Mot de passe requis']"
              required
            ></v-text-field>
            
            <v-select
              v-model="newUser.role"
              :items="roles"
              label="Rôle"
              :rules="[v => !!v || 'Rôle requis']"
              required
            ></v-select>
            
            <v-btn
              type="submit"
              color="success"
              :loading="loadingAddUser"
              class="mt-4"
            >
              Ajouter
            </v-btn>
          </v-form>
          
          <v-alert
            v-if="addUserMessage"
            :type="addUserError ? 'error' : 'success'"
            class="mt-4"
          >
            {{ addUserMessage }}
          </v-alert>
        </v-card>
      </v-window-item>

      <!-- Add News Tab -->
      <v-window-item value="add-news">
        <v-card class="pa-4">
          <v-form @submit.prevent="addNews">
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
            
            <v-file-input
              v-model="newsImage"
              label="Image"
              accept="image/*"
              :rules="[v => !!v || 'Image requise']"
              required
              prepend-icon="mdi-image"
            ></v-file-input>
            
            <v-btn
              type="submit"
              color="success"
              :loading="loadingAddNews"
              class="mt-4"
            >
              Ajouter
            </v-btn>
          </v-form>
          
          <v-alert
            v-if="newsMessage"
            :type="newsError ? 'error' : 'success'"
            class="mt-4"
          >
            {{ newsMessage }}
          </v-alert>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Dialogs -->
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Confirmer la Suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer l'utilisateur
          <strong>{{ selectedUser?.username }}</strong> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" text @click="deleteDialog = false">
            Annuler
          </v-btn>
          <v-btn color="red-darken-1" text @click="deleteUser">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit User Dialog -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Modifier l'Utilisateur</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updateUser">
            <v-text-field
              v-model="editUser.username"
              label="Nom d'utilisateur"
              :rules="[v => !!v || 'Nom d\'utilisateur requis']"
              required
            ></v-text-field>
            
            <v-select
              v-model="editUser.role"
              :items="roles"
              label="Rôle"
              :rules="[v => !!v || 'Rôle requis']"
              required
            ></v-select>
            
            <v-text-field
              v-model="editUser.password"
              label="Nouveau Mot de passe"
              type="password"
              :rules="[v => !v || v.length >= 6 || 'Au moins 6 caractères']"
              hint="Laisser vide pour ne pas changer le mot de passe"
            ></v-text-field>
            
            <v-btn
              type="submit"
              color="primary"
              :loading="loadingUpdateUser"
              class="mt-4"
            >
              Mettre à Jour
            </v-btn>
            <v-btn text @click="editDialog = false" class="mt-4 ml-2">
              Annuler
            </v-btn>
          </v-form>
          
          <v-alert
            v-if="editUserMessage"
            :type="editUserError ? 'error' : 'success'"
            class="mt-4"
          >
            {{ editUserMessage }}
          </v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'Admin',
  setup() {
    // Tabs state
    const activeTab = ref('users')

    // Users state
    const users = ref([])
    const userHeaders = [
      { text: 'ID', value: 'id' },
      { text: 'Nom d\'utilisateur', value: 'username' },
      { text: 'Rôle', value: 'role' },
      { text: 'Créé le', value: 'created_at' },
      { text: 'Actions', value: 'actions', sortable: false }
    ]
    const loadingUsers = ref(false)
    const userMessage = ref('')
    const userError = ref(false)

    // Add User state
    const newUser = ref({
      username: '',
      password: '',
      role: 'user'
    })
    const roles = ['user', 'admin']
    const loadingAddUser = ref(false)
    const addUserMessage = ref('')
    const addUserError = ref(false)

    // Edit User state
    const editDialog = ref(false)
    const editUser = ref({
      id: null,
      username: '',
      role: 'user',
      password: ''
    })
    const loadingUpdateUser = ref(false)
    const editUserMessage = ref('')
    const editUserError = ref(false)

    // Delete User state
    const deleteDialog = ref(false)
    const selectedUser = ref(null)

    // News state
    const newsTitle = ref('')
    const newsContent = ref('')
    const newsImage = ref(null)
    const loadingAddNews = ref(false)
    const newsMessage = ref('')
    const newsError = ref(false)

    // Users methods
    const fetchUsers = async () => {
      loadingUsers.value = true
      try {
        const response = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        users.value = response.data
        userMessage.value = 'Liste des utilisateurs chargée avec succès.'
        userError.value = false
      } catch (error) {
        console.error('Error fetching users:', error)
        userMessage.value = 'Erreur lors du chargement des utilisateurs.'
        userError.value = true
      } finally {
        loadingUsers.value = false
      }
    }

    // Add User methods
    const addUser = async () => {
      if (!newUser.value.username || !newUser.value.password || !newUser.value.role) {
        addUserMessage.value = 'Tous les champs sont requis.'
        addUserError.value = true
        return
      }

      loadingAddUser.value = true
      try {
        await axios.post('/api/users', newUser.value, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        addUserMessage.value = 'Utilisateur ajouté avec succès.'
        addUserError.value = false
        newUser.value = { username: '', password: '', role: 'user' }
        await fetchUsers()
        // Switch to users tab after successful addition
        activeTab.value = 'users'
      } catch (error) {
        console.error('Error adding user:', error)
        addUserMessage.value = 'Erreur lors de l\'ajout de l\'utilisateur.'
        addUserError.value = true
      } finally {
        loadingAddUser.value = false
      }
    }

    // Edit User methods
    const openEditDialog = (user) => {
      editUser.value = {
        id: user.id,
        username: user.username,
        role: user.role,
        password: ''
      }
      editDialog.value = true
    }

    const updateUser = async () => {
      if (!editUser.value.username || !editUser.value.role) {
        editUserMessage.value = 'Nom d\'utilisateur et rôle sont requis.'
        editUserError.value = true
        return
      }

      loadingUpdateUser.value = true
      try {
        const payload = {
          username: editUser.value.username,
          role: editUser.value.role
        }
        if (editUser.value.password) {
          payload.password = editUser.value.password
        }

        await axios.put(`/api/users/${editUser.value.id}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        editUserMessage.value = 'Utilisateur mis à jour avec succès.'
        editUserError.value = false
        await fetchUsers()
        setTimeout(() => {
          editDialog.value = false
        }, 1000)
      } catch (error) {
        console.error('Error updating user:', error)
        editUserMessage.value = 'Erreur lors de la mise à jour de l\'utilisateur.'
        editUserError.value = true
      } finally {
        loadingUpdateUser.value = false
      }
    }

    // Delete User methods
    const confirmDelete = (user) => {
      selectedUser.value = user
      deleteDialog.value = true
    }

    const deleteUser = async () => {
      if (!selectedUser.value) return

      try {
        await axios.delete(`/api/users/${selectedUser.value.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        userMessage.value = 'Utilisateur supprimé avec succès.'
        userError.value = false
        await fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
        userMessage.value = 'Erreur lors de la suppression de l\'utilisateur.'
        userError.value = true
      } finally {
        deleteDialog.value = false
      }
    }

    // Add News methods
    const addNews = async () => {
      if (!newsTitle.value || !newsContent.value || !newsImage.value) {
        newsMessage.value = 'Tous les champs sont requis.'
        newsError.value = true
        return
      }

      loadingAddNews.value = true
      try {
        const formData = new FormData()
        formData.append('title', newsTitle.value)
        formData.append('content', newsContent.value)
        formData.append('image', newsImage.value)

        await axios.post('/api/news', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        newsMessage.value = 'Actualité ajoutée avec succès.'
        newsError.value = false
        newsTitle.value = ''
        newsContent.value = ''
        newsImage.value = null
      } catch (error) {
        console.error('Error adding news:', error)
        newsMessage.value = 'Erreur lors de l\'ajout de l\'actualité.'
        newsError.value = true
      } finally {
        loadingAddNews.value = false
      }
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      activeTab,
      users,
      userHeaders,
      loadingUsers,
      userMessage,
      userError,
      newUser,
      roles,
      loadingAddUser,
      addUserMessage,
      addUserError,
      editDialog,
      editUser,
      loadingUpdateUser,
      editUserMessage,
      editUserError,
      deleteDialog,
      selectedUser,
      newsTitle,
      newsContent,
      newsImage,
      loadingAddNews,
      newsMessage,
      newsError,
      addUser,
      updateUser,
      deleteUser,
      addNews,
      openEditDialog,
      confirmDelete
    }
  }
}
</script>

<style scoped>
.v-container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: var(--v-primary-base);
  font-weight: 600;
}

.v-card {
  margin-top: 1rem;
}

.v-data-table {
  margin-top: 1rem;
  min-height: 300px;
}

.v-form {
  max-width: 600px;
  margin: 0 auto;
}

.v-btn {
  margin-right: 0.5rem;
}

.v-alert {
  margin-top: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.headline {
  font-weight: 600;
  color: var(--v-primary-base);
}

.v-window-item {
  padding: 1rem 0;
}

.v-card-text {
  padding-top: 1.5rem;
}

.v-dialog .v-card {
  padding: 1rem;
}

/* Form fields spacing */
.v-text-field,
.v-select,
.v-textarea,
.v-file-input {
  margin-bottom: 1rem;
}

/* Table actions buttons alignment */
.v-data-table .v-btn {
  margin: 0.25rem;
}

/* Alert messages */
.v-alert {
  margin-bottom: 1rem;
}

/* Dialog form buttons */
.v-card-actions {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
}

/* Tab content transition */
.v-window-item {
  transition: all 0.3s ease-in-out;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .v-container {
    padding: 0.5rem;
  }
  
  .v-form {
    padding: 0 1rem;
  }
  
  .v-data-table {
    font-size: 0.875rem;
  }
  
  .v-btn {
    font-size: 0.875rem;
  }
  
  h1 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
</style>