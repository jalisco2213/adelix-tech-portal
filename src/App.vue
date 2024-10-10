<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { applyRedirects } from './ts/client/redirect'

onMounted(() => {
  applyRedirects();
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>