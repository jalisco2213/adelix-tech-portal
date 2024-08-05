<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  exportToZIP: Function,
  showSample: Function,
});

const emit = defineEmits(['update:exportToZIP', 'update:showSample']);

const handleExport = () => {
  props.exportToZIP();
  emit('update:exportToZIP');
};

const handleSample = () => {
  props.showSample();
  emit('update:showSample');
};
</script>

<template>
  <div class="nav-button">
    <button @click="handleExport" class="nav-btn export-btn">Скачать архив</button>
    <button @click="handleSample" class="nav-btn sample-btn">Образец + печать</button>
  </div>
</template>