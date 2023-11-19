<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <ul>
        <li><strong>Quiz Builder</strong></li>
      </ul>
      <ul>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li> <RouterLink to="/about">About</RouterLink></li>
        <li><a href="#" role="button">Button</a></li>
      </ul>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
</style>
