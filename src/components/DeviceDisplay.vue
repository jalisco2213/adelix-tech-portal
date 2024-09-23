<script setup>
import {computed} from "vue";
import AdlDu from "@/components/device/AdlDu.vue";
import Adl_p1 from "@/components/device/Adl_p1.vue";

const props = defineProps({
  device: Object
});

const componentToRender = computed(() => {
  if (props.device.type === 'hardness') {
    return AdlDu;
  } else if (props.device.type === 'vibrometr') {
    return Adl_p1;
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
