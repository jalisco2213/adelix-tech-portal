<script setup>
import Adl_du110 from './components/device/Adl_du110.vue';
import Adl_du100 from './components/device/Adl_du100.vue';
import Adl_du120 from './components/device/Adl_du120.vue';
import Adl_P1 from './components/device/Adl_p1.vue';
import Adl_P3 from './components/device/Adl_p3.vue';
import Adl_M12 from './components/device/Adl_M12.vue';
import Adl_M15 from './components/device/Adl_M15.vue';
import Adl_M20 from './components/device/Adl_M20.vue';

import { ref } from 'vue';

const selectedDevice = ref('standart');
</script>

<template>
  <div class="container">
    <select v-model="selectedDevice">
      <option value="standart">Выберите устройство</option>
      <optgroup label="Твердомеры">
        <option value="ADL-DU100">ADL-DU100</option>
        <option value="ADL-DU110">ADL-DU110</option>
        <option value="ADL-DU120">ADL-DU120</option>
      </optgroup>
      <optgroup label="Виброметры">
        <option value="ADL-P1">P1</option>
        <option value="ADL-P3">P3</option>
        <option value="ADL-M12">M12</option>
        <option value="ADL-M15">M15</option>
        <option value="ADL-M20">M20</option>
      </optgroup>
    </select>
  </div>

  <Adl_du100 v-if="selectedDevice === 'ADL-DU100'" />
  <Adl_du110 v-if="selectedDevice === 'ADL-DU110'" />
  <Adl_du120 v-if="selectedDevice === 'ADL-DU120'" />
  <Adl_P1 v-if="selectedDevice === 'ADL-P1'" />
  <Adl_P3 v-if="selectedDevice === 'ADL-P3'" />
  <Adl_M12 v-if="selectedDevice === 'ADL-M12'" />
  <Adl_M15 v-if="selectedDevice === 'ADL-M15'" />
  <Adl_M20 v-if="selectedDevice === 'ADL-M20'" />
</template>

<style lang="scss" scoped>
input {
  width: 100%;
}
</style>
