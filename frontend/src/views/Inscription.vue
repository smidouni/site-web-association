<template>
    <v-container class="center-container">
      <h1 class="my-8">Inscription</h1>
      <p>
        Bienvenue sur la page d'inscription de notre association ! Remplissez
        le formulaire ci-dessous pour compléter votre inscription.
      </p>
  
      <!-- Inscription Form -->
      <v-form v-model="valid" ref="form" lazy-validation class="form-container">
        <v-text-field
          v-model="form.name"
          label="Nom complet"
          required
          dense
          class="mb-4"
          :rules="[rules.required, rules.minLength(3)]"
        ></v-text-field>
  
        <v-text-field
          v-model="form.email"
          label="Adresse e-mail"
          required
          dense
          class="mb-4"
          :rules="[rules.required, rules.email]"
        ></v-text-field>
  
        <v-text-field
          v-model="form.phone"
          label="Numéro de téléphone"
          required
          dense
          class="mb-4"
          :rules="[rules.required, rules.phone]"
        ></v-text-field>
  
        <v-file-input
          v-model="form.rib"
          label="Joindre votre RIB"
          accept=".pdf, .jpg, .png"
          required
          dense
          class="mb-4"
          :rules="[rules.required]"
        ></v-file-input>
  
        <v-btn
          :disabled="!valid"
          color="primary"
          class="mt-4"
          @click="submitForm"
        >
          Envoyer le formulaire
        </v-btn>
      </v-form>
  
      <v-alert
        v-if="submissionMessage"
        :type="submissionSuccess ? 'success' : 'error'"
        class="mt-6"
      >
        {{ submissionMessage }}
      </v-alert>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "Inscription",
    data() {
      return {
        valid: false,
        form: {
          name: "",
          email: "",
          phone: "",
          rib: null,
        },
        rules: {
          required: (value) => !!value || "Ce champ est requis.",
          minLength: (length) => (value) =>
            (value || "").length >= length ||
            `Minimum ${length} caractères requis.`,
          email: (value) =>
            /.+@.+\..+/.test(value) || "Adresse e-mail invalide.",
          phone: (value) =>
            /^\d{10}$/.test(value) || "Le numéro doit contenir 10 chiffres.",
        },
        submissionMessage: "",
        submissionSuccess: false,
      };
    },
    methods: {
      submitForm() {
        if (this.$refs.form.validate()) {
          // Simulate form submission
          this.submissionSuccess = true;
          this.submissionMessage =
            "Votre formulaire a été soumis avec succès. Nous vous contacterons bientôt.";
          this.resetForm();
        } else {
          this.submissionSuccess = false;
          this.submissionMessage =
            "Veuillez corriger les erreurs dans le formulaire avant de soumettre.";
        }
      },
      resetForm() {
        this.form = {
          name: "",
          email: "",
          phone: "",
          rib: null,
        };
        this.$refs.form.reset();
      },
    },
  };
  </script>
  
  <style scoped>
  /* Center the form container with reduced height */
  .center-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 70vh; /* Adjust to take up less space */
    text-align: center;
    padding: 0 16px; /* Add padding for smaller screens */
  }
  
  h1 {
    font-size: 28px; /* Slightly smaller for smaller screens */
    font-weight: bold;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 16px; /* Adjust font size for better fit */
    margin-bottom: 24px;
  }
  
  .form-container {
    width: 100%;
    max-width: 400px;
  }
  
  .mb-4 {
    margin-bottom: 16px !important; /* Ensure consistent spacing */
  }
  
  .mt-4 {
    margin-top: 16px !important; /* Ensure spacing above button */
  }
  
  .v-alert {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
  