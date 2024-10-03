<script setup lang="ts">
import Navigation from "@/components/Navigation.vue";
import StorageHome from "@/components/Warehouse/StorageHome.vue";
import Greetings from "@/components/Greetings.vue";
</script>

<template>
  <div class="wrapper">

    <Navigation/>

    <div class="container">
      <Greetings/>
      <StorageHome/>
    </div>

  </div>
</template>
