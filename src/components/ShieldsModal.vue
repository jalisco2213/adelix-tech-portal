<script setup>
import SwitchCountry from "@/components/utils/SwitchCountry.vue";

const props = defineProps({
  device: Object,
  isClosing: Boolean
});

const emit = defineEmits(['close', 'changeQuantity']);

const close = () => {
  emit('close');
};

const updateQuantity = () => {
  emit('changeQuantity', props.device.id, props.device.quantity);
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content" @click.stop :class="{ closing: isClosing }">
      <div style="overflow-y: auto; max-height: 100%; padding: 5px">
        <span style="position: absolute; cursor: pointer; top: 0; font-size: 40px; right: 40px" class="close-button" @click="close">×</span>
        <div>
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <p>Количество шильдов для <b>{{ device.id }}</b>:</p>
            <input
              class="pointerShields"
              type="number"
              min="0"
              v-model.number="device.quantity"
              @input="updateQuantity"
            />
          </div>
        </div>

        <div v-for="(serial, index) in device.quantity" :key="index" class="serial-input">
          <label>S/N {{ index + 1 }}:</label>
          <input
            type="text"
            v-model="device.serialNumbers[index]"
            placeholder="Введите серийный номер"
          />

          <SwitchCountry v-model:country="device.isUkrainian[index]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  transition: opacity 0.3s ease-in-out;
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
  max-height: 50%;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

  &.closing {
    animation: slide-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  @keyframes slide-top {
    0% {
      transform: translateY(50px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes slide-bottom {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(200px);
    }
  }
}

.pointerShields {
  width: 50px;
  background: inherit;
  border: none !important;
  padding: 0;
  margin-left: 0 !important;
  font-size: 20px;
}

.shields-serial {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
}
</style>