<script setup>
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
</script>

<template>
  <div class="device-option">
    <div>
      <input
        type="checkbox"
        :id="device.id"
        v-model="device.selected"
      />
      <label :for="device.id">{{ device.id }}</label>
    </div>

    <span v-if="device.selected" @click="showShieldsModal(device.id)" class="edit-settings">
      <img src="/svg/edit.svg" alt="">
    </span>

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

  div {
    display: flex;
    align-items: center;
  }

  input[type="number"] {
    margin-left: 10px;
    width: 60px;
  }

  input[type="checkbox"] {
    margin-right: 10px;
  }
}

.edit-settings {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

</style>
