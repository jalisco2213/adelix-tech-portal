<script setup>
import {defineEmits} from 'vue';

const emit = defineEmits(['updateData']);

const props = defineProps({
  id: String,
  label: String,
  serial: String,
  isUkrainian: Boolean,
  labelUkrainian: String,
  serialType: String,
});
</script>

<template>
  <div :class="`${id}-container`">
    <div class="shields-container">
      <div class="uci-sensor">

        <div class="uci-header">
          <h1>{{ serialType }}</h1>
        </div>

        <div class="uci-main">
          <img src="/svg/sensors/adllogo.svg" alt="">
        </div>

        <div class="uci-footer">
          <h1>№{{serial}}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.uci-sensor {
  user-select: none;
  border: 1px solid #111111;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  align-items: center;
  color: #2B2A29;
  font-weight: 900;
  font-size: 18px;
}

.uci-main {
  img {
    width: 282px;
  }
}
</style>