<template>
  <v-app>
    <v-container tag="header" class="py-4" max-width="900">
      <nav aria-label="Main navigation" class="d-flex flex-wrap ga-2">
        <v-btn :to="{ name: 'home' }" variant="text" exact>Home</v-btn>
        <v-btn :to="{ name: 'upload' }" variant="text">Upload</v-btn>
        <v-btn :to="{ name: 'search' }" variant="text">Search</v-btn>
      </nav>
    </v-container>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
