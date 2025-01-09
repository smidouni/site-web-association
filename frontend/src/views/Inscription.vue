<template>
    <v-container class="text-center">
      <h1 class="my-8">Inscription</h1>
      <p>
        Bienvenue sur la page d'inscription de notre association !
        Veuillez suivre les étapes ci-dessous pour compléter votre inscription.
      </p>
  
      <ol class="instructions">
        <li>
          Téléchargez le formulaire d'inscription en cliquant sur le bouton ci-dessous.
        </li>
        <li>
          Remplissez le formulaire avec vos informations personnelles et joignez votre RIB pour le paiement.
        </li>
        <li>
          Envoyez le formulaire rempli à l'adresse e-mail suivante : 
          <strong>association.masterim@example.com</strong>
        </li>
        <li>
          Vous recevrez une confirmation une fois que votre dossier d'inscription sera validé.
        </li>
      </ol>
  
      <!-- Button to download the form -->
      <v-btn
        color="primary"
        large
        href="/inscription-details.pdf"
        target="_blank"
        download
        class="mt-4"
      >
        Télécharger le formulaire
      </v-btn>
  
      <v-alert type="info" class="mt-6">
        <strong>Note :</strong> Le formulaire contient toutes les informations nécessaires, 
        y compris le RIB pour le paiement. Assurez-vous de vérifier vos informations avant de l'envoyer.
      </v-alert>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "Inscription",
  };
  </script>
  
  <style scoped>
  h1 {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  .instructions {
    text-align: left;
    margin: 0 auto;
    max-width: 600px;
    font-size: 16px;
    margin-bottom: 30px;
  }
  
  .instructions li {
    margin-bottom: 10px;
  }
  
  .v-alert {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
  