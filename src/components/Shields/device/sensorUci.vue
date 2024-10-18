<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['updateData']);

const props = defineProps({
  id: String,
  label: String,
  serial: String,
  isUkrainian: Boolean,
  labelUkrainian: String,
  serialType: String,
  isTurkey: Boolean,
});
</script>

<template>
  <div :class="`${id}-container`">
    <div class="shields-container">
      <div v-if="!isTurkey" class="uci-sensor">

        <div class="uci-header">
          <h1 style="color: #eee">{{ serialType }}</h1>
        </div>

        <div class="uci-main">
          <img src="/svg/sensors/adllogo.svg" alt="">
        </div>

        <div class="uci-footer">
          <h1 style="color: #eee">№{{ serial }}</h1>
        </div>
      </div>

      <div v-else class="uci-sensor_turkey">

        <div class="uci-header">
          <h1 style="color: #eee">{{ serialType.replace('ADL ', '') }}</h1>
        </div>

        <div class="uci-footer">
          <h1 style="color: #eee">№{{ serial }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.uci-sensor,
.uci-sensor_turkey {
  user-select: none;
  border: 1px solid #111111;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgb(114, 115, 118);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  align-items: center;
  color: #2B2A29;
  font-weight: 900;
  font-size: 18px;
}

.uci-sensor_turkey {
  gap: 5px !important;

  .uci-header {
    margin-top: 20px;
    font-size: 40px;
  }

  .uci-footer {
    font-size: 20px !important;
  }
}

.uci-main {
  img {
    width: 282px;
  }
}
</style>