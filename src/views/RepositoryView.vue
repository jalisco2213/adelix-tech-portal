<script setup lang="ts">
import Navigation from "../components/Navigation.vue";
import Greetings from "../components/Greetings/Greetings.vue";
import Repository from "../components/Repository/Repository.vue";
</script>

<template>
  <div class="wrapper">

    <Navigation/>

    <div class="container">
      <Greetings/>

      <Repository/>
    </div>

  </div>
</template>
