<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <RouterView />
</template>

<style>
/* Remove scoped so it applies to whole page */
body,
#app {
  background-color: white;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style>
