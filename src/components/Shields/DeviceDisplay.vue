<script setup>
import { computed } from "vue";
import adlStandard from "@/components/Shields/device/adlStandart.vue";
import adlVibrometrP from "@/components/Shields/device/adlVibrometrP.vue";
import sensorUci from "@/components/Shields/device/sensorUci.vue";
import adlVibrometrM from "@/components/Shields/device/adlVibrometerM.vue";
import adlVibrometerM20 from '@/components/Shields/device/adlVibrometerM20.vue';
import thicknessSensor from '@/components/Shields/device/thicknessSensor.vue'

const props = defineProps({
  device: Object
});

const componentToRender = computed(() => {
  if (['D100', 'DU110', 'DU120', 'UT20', 'UT25', 'GT10', 'MS30', 'MS30L', 'MS32', 'MS52PRO'].includes(props.device.serialType) || props.device.className === 'MS52PRO') {
    return adlStandard;
  } else if (['P1', 'P3'].includes(props.device.serialType)) {
    return adlVibrometrP;
  } else if (['ADL UCI', 'ADL UCI-S', 'ADL UCI-R'].includes(props.device.serialType)) {
    return sensorUci;
  } else if (['M12', 'M15'].includes(props.device.serialType)) {
    return adlVibrometrM;
  } else if (['M20'].includes(props.device.serialType)) {
    return adlVibrometerM20;
  } else if (['SF0.3', 'SF0.5', 'SF2', 'SF5', 'SN2', 'SM12', 'SM30', 'SM60', 'ST1', 'SH1', 'SR1'].includes(props.device.serialType)) {
    return thicknessSensor;
  }
});

const emit = defineEmits(['updateData']);

const handleUpdateData = (data) => {
  emit('updateData', data);
};
</script>

<template>
  <div class="device-display">
    <component v-for="(serial, index) in device.serialNumbers" :key="index" :is="componentToRender" :id="device.id"
      :label="device.label" :labelUkrainian="device.labelUkrainian" :serial="serial" :serialType="device.serialType"
      :isUkrainian="device.isUkrainian[index]" :isTurkey="device.isTurkey[index]" :artN="device.artN"
      :class="device.className" @updateData="handleUpdateData" />
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
