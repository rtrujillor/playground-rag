import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { VApp, VMain, VContainer, VSheet, VBtn } from 'vuetify/components';

export const vuetify = createVuetify({
  components: { VApp, VMain, VContainer, VSheet, VBtn },
  theme: {
    defaultTheme: 'playground',
    themes: {
      playground: {
        dark: false,
        colors: {
          background: '#F4F6F8',
          surface: '#FFFFFF',
          primary: '#355E52',
        },
      },
    },
  },
});
