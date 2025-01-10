<template>
  <v-container>
    <h1 class="text-h4 mb-6">Vote sur les propositions</h1>
   
    <v-alert
      v-if="loading"
      color="info"
      icon="mdi-loading"
      class="mb-4"
    >
      Chargement des résultats...
    </v-alert>

    <v-carousel
      cycle
      height="400"
      hide-delimiter-background
      show-arrows="hover"
      class="mt-6 voting-carousel"
    >
      <v-carousel-item
        v-for="(proposal, index) in proposals"
        :key="proposal.id"
      >
        <v-card
          elevation="4"
          class="mx-auto h-100"
          max-width="600"
        >
          <v-card-title class="text-center text-h5 py-4">
            {{ proposal.title }}
          </v-card-title>

          <v-card-text>
            
            <template v-if="results[index]">
              <v-row>
                <v-col cols="6">
                  <v-card
                    outlined
                    :loading="voting"
                    class="vote-card"
                    hover
                    @click="vote(proposal.id, 'yes')"
                  >
                    <v-card-text class="text-center">
                      <div class="text-h6 success--text">Oui</div>
                      <div class="text-h4">{{ results[index].yes }}</div>
                      <div class="text-caption">votes</div>
                    </v-card-text>
                    <v-overlay
                      absolute
                      :value="voting"
                      opacity="0.1"
                    ></v-overlay>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card
                    outlined
                    :loading="voting"
                    class="vote-card"
                    hover
                    @click="vote(proposal.id, 'no')"
                  >
                    <v-card-text class="text-center">
                      <div class="text-h6 error--text">Non</div>
                      <div class="text-h4">{{ results[index].no }}</div>
                      <div class="text-caption">votes</div>
                    </v-card-text>
                    <v-overlay
                      absolute
                      :value="voting"
                      opacity="0.1"
                    ></v-overlay>
                  </v-card>
                </v-col>
              </v-row>
            </template>
            
            <div v-else class="text-center py-4">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
              <p class="mt-2">Les résultats seront affichés après le vote.</p>
            </div>
            <p class="text-body-1 mb-4">{{ proposal.description }}</p>
          </v-card-text>
        </v-card>
      </v-carousel-item>
    </v-carousel>

    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
      bottom
    >
      {{ error }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="showError = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'VotingSystem',
  
  data() {
    return {
      proposals: [
        {
          id: 1,
          title: 'Proposition 1',
          description: 'Description détaillée de la proposition 1 expliquant les enjeux et les impacts potentiels.'
        },
        {
          id: 2,
          title: 'Proposition 2',
          description: 'Description détaillée de la proposition 2 expliquant les enjeux et les impacts potentiels.'
        },
      ],
      results: [],
      loading: false,
      voting: false,
      error: null,
      showError: false,
      refreshInterval: null
    }
  },

  methods: {
    async vote(proposalId, option) {
      if (this.voting) return
      
      this.voting = true
      this.error = null
      
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Veuillez vous connecter pour voter.')
        }

        await axios.post(
          '/api/votes',
          { vote_option: option, proposalId },
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000
          }
        )
        
        await this.fetchResults()
      } catch (err) {
        this.error = err.response?.data?.message || 
                     err.message || 
                     'Erreur lors du vote. Veuillez réessayer.'
        this.showError = true
      } finally {
        this.voting = false
      }
    },

    async fetchResults() {
      if (this.loading) return

      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('/api/votes/summary', {
          timeout: 5000
        })
        this.results = response.data
      } catch (err) {
        this.error = 'Erreur lors du chargement des résultats.'
        this.showError = true
        console.error('Error fetching results:', err)
      } finally {
        this.loading = false
      }
    },

    startPolling() {
      this.refreshInterval = setInterval(this.fetchResults, 30000)
    },

    stopPolling() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }
    }
  },

  mounted() {
    this.fetchResults()
    this.startPolling()
  },

  beforeUnmount() {
    this.stopPolling()
  }
}
</script>

<style scoped>
.voting-carousel {
  background: transparent;
}

.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}

.vote-card {
  cursor: pointer;
}

.vote-card:hover {
  opacity: 0.9;
}
</style>