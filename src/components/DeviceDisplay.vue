<script setup>
import AdlDu from "@/components/device/AdlDu.vue";

const props = defineProps({
  device: Object
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
      :is="AdlDu"
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
