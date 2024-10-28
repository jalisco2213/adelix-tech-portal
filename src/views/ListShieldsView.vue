<script setup lang="ts">
import Navigation from "../components/Navigation.vue";
import Greetings from "../components/Greetings/Greetings.vue";
import ListShields from "../components/Shields/List/ListShields.vue";
</script>

<template>
  <div class="wrapper">

    <Navigation/>

    <div class="container">
      <Greetings/>

      <ListShields/>
    </div>

  </div>
</template>
