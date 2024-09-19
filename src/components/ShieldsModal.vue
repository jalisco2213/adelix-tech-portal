<script setup>
import SwitchCountry from "@/components/SwitchCountry.vue";
import ModalLoader from "@/components/Utils/ModalLoader.vue";

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

const continueSerialNumbers = () => {
  const firstSerial = parseInt(props.device.serialNumbers[0]);

  if (!isNaN(firstSerial)) {
    props.device.serialNumbers = props.device.serialNumbers.map((serial, index) => {
      return (firstSerial + index).toString();
    });
  }
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content" @click.stop :class="{ closing: isClosing }">
      <div style="overflow-y: auto; max-height: 100%; height: 100%; padding: 5px">
        <span style="position: absolute; cursor: pointer; top: 0; font-size: 40px; right: 40px" class="close-button"
              @click="close">×</span>
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

          <ModalLoader v-if="device.quantity === 0" style="display: flex; justify-content:center; align-items: center; margin: auto; height: 41vh"/>

          <img
            v-if="device.quantity > 1"
            style="width: 30px; cursor: pointer; position: absolute; right: 70px; top: 10px"
            src="/svg/repeat.svg"
            alt="repeat"
            @click="continueSerialNumbers"
          />
        </div>

        <div class="shields-input">
          <div v-for="(serial, index) in device.quantity" :key="index" class="serial-input">
            <label>S/N №{{ index + 1 }}:</label>
            <input
              class="shields-serial"
              type="text"
              v-model="device.serialNumbers[index]"
              placeholder="Серийный номер"
            />

            <SwitchCountry v-model:country="device.isUkrainian[index]"/>
          </div>
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

.shields-input {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;

  .serial-input {
    background: #eee;
    padding: 15px;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    label {
      margin-right: 10px;
    }

    .shields-serial {
      border: 1px solid #ccc;
      border-radius: 15px;
      padding: 5px 3px;
      transition: border-color 0.3s, box-shadow 0.3s;
      width: 170px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      &:focus {
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        outline: none;
      }
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
</style>
