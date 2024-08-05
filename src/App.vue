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
    <div class="select-wrapper">
      <select v-model="selectedDevice" class="device-select">
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
        <optgroup label="Виброанализаторы">
          
        </optgroup>
      </select>
    </div>

    <div v-if="selectedDevice !== 'standart'" class="device-display">
      <Adl_du100 v-if="selectedDevice === 'ADL-DU100'" />
      <Adl_du110 v-if="selectedDevice === 'ADL-DU110'" />
      <Adl_du120 v-if="selectedDevice === 'ADL-DU120'" />
      <Adl_P1 v-if="selectedDevice === 'ADL-P1'" />
      <Adl_P3 v-if="selectedDevice === 'ADL-P3'" />
      <Adl_M12 v-if="selectedDevice === 'ADL-M12'" />
      <Adl_M15 v-if="selectedDevice === 'ADL-M15'" />
      <Adl_M20 v-if="selectedDevice === 'ADL-M20'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.select-wrapper {
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
}

.device-select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.device-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.device-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
