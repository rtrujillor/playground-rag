import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import { vuetify } from './shared/ui/vuetify';
import { readEnvironment } from './shared/config/environment';
import { useUploadStore } from './features/upload/uploadStore';
import { restoreUploadSession } from './features/upload/uploadSession';

readEnvironment(import.meta.env);
async function start() {
  const pinia = createPinia();
  await restoreUploadSession(useUploadStore(pinia));
  createApp(App).use(pinia).use(router).use(vuetify).mount('#app');
}
void start();
