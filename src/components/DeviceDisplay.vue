<script setup>
import {computed} from "vue";
import adlStandard from "@/components/device/adlStandart.vue";
import adlVibrometrP from "@/components/device/adlVibrometrP.vue";

const props = defineProps({
  device: Object
});

const componentToRender = computed(() => {
  if (props.device.type === 'hardness') {
    return adlStandard;
  } else if (props.device.type === 'vibrometr') {
    return adlVibrometrP;
  }
});

const emit = defineEmits(['updateData']);

const handleUpdateData = (data) => {
  emit('updateData', data);
};
</script>

<template>
  <div class="device-display">
    <component
      v-for="(serial, index) in device.serialNumbers"
      :key="index"
      :is="componentToRender"
      :id="device.id"
      :label="device.label"
      :labelUkrainian="device.labelUkrainian"
      :serial="serial"
      :serialType="device.serialType"
      :isUkrainian="device.isUkrainian[index]"
      :class="device.className"
      @updateData="handleUpdateData"
    />
  </div>
</template>

<style scoped>
.device-display {
  position: absolute;
  left: -5000px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
</style>
