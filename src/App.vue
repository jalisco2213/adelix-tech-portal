<script setup>
import Adl_du110 from './components/device/Adl_du110.vue';

import { ref } from 'vue';

const selectedDevice = ref('standart');
</script>

<template>
  <div class="container">
    <select v-model="selectedDevice">
      <option value="standart">Выберите устройство</option>
      <option value="ADL-DU110">ADL-DU110</option>
    </select>
  </div>

  <Adl_du110 v-if="selectedDevice === 'ADL-DU110'" />
</template>

<style lang="scss" scoped>
input {
  width: 100%;
}
</style>
