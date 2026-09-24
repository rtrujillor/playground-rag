import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/search',
      name: 'search',
      component: () => import('./features/search/SearchPage.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('./features/home/HomePage.vue'),
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('./features/upload/UploadPage.vue'),
    },
  ],
});
