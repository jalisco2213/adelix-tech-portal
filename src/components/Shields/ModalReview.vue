<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: Boolean,
  pdfPreview: String
});

const emit = defineEmits(['closeModal']);

const hideModal = () => {
  emit('closeModal');
};
</script>

<template>
  <div v-if="isVisible" class="modal-overlay" @click="hideModal">
    <div class="modal-content" @click.stop>
      <span class="close-button" @click="hideModal">×</span>
      <iframe v-if="pdfPreview" :src="pdfPreview" width="100%" height="100%"></iframe>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
}

.close-button {
  float: right;
  cursor: pointer;
}
</style>
