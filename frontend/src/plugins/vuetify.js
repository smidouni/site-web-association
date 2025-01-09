// frontend/src/plugins/vuetify.js

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css"; // Assurez-vous que les icônes sont importées

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          background: "#F5F5F5",
          surface: "#FFFFFF",
          primary: "#1E3A8A",
          secondary: "#22D3EE",
          error: "#E53E3E",
        },
      },
      dark: {
        dark: true,
        colors: {
          background: "#121212",
          surface: "#1e1e1e",
          primary: "#bb86fc",
          secondary: "#03dac6",
          error: "#cf6679",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",

  },
});
