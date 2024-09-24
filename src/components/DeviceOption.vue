<script setup>
import {computed} from 'vue';
import ShieldsModal from "@/components/ShieldsModal.vue";

const props = defineProps({
  device: Object,
  isClosing: Boolean
});

const emit = defineEmits(['showModal', 'hideModal', 'changeQuantity']);

const showShieldsModal = (deviceId) => {
  emit('showModal', deviceId);
};

const hideShieldsModal = (deviceId) => {
  emit('hideModal', deviceId);
};

const handleQuantityChange = (deviceId, quantity) => {
  emit('changeQuantity', deviceId, quantity);
};

const isSuccessVisible = computed(() => {
  return props.device.quantity > 0 && props.device.serialNumbers.every(num => num.trim() !== '');
});
</script>

<template>
  <div class="device-option">
    <input
      type="checkbox"
      :id="device.id"
      v-model="device.selected"
    />
    <label :for="device.id">{{ device.id }}</label>

    <div v-if="device.selected" @click="showShieldsModal(device.id)" class="edit-settings">
      <img src="/svg/edit.svg" alt="">
    </div>

    <div v-if="isSuccessVisible" class="success">
      &#10003;
    </div>

    <ShieldsModal
      v-if="device.showShieldsModal"
      :device="device"
      :isClosing="isClosing"
      @close="hideShieldsModal(device.id)"
      @changeQuantity="handleQuantityChange"
    />
  </div>
</template>

<style scoped>
.device-option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
  width: 230px;

  div {
    display: flex;
    align-items: center;
  }

  input[type="number"] {
    margin-left: 10px;
    width: 60px;
  }
}

.success {
  cursor: default;
}

.edit-settings {
  width: 19px;
  height: 19px;
  cursor: pointer;
}
</style>
