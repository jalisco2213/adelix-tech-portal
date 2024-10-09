<script setup>
import {ref, watch} from 'vue';

const props = defineProps(['device']);
const emit = defineEmits(['close', 'save']);

const typeKey = ref(props.device?.type || '');
const newDevice = ref('');
const devices = ref(Object.keys(props.device?.devices || {}).map(key => ({
  name: key,
  count: props.device.devices[key][0].count
})));

watch(() => props.device, (newDevice) => {
  typeKey.value = newDevice.type;
  devices.value = Object.keys(newDevice.devices || {}).map(key => ({
    name: key,
    count: newDevice.devices[key][0].count
  }));
});

const addDevice = () => {
  if (newDevice.value) {
    devices.value.push({name: newDevice.value, count: '0'});
    newDevice.value = '';
  }
};

const removeDevice = (index) => {
  devices.value.splice(index, 1);
};

const saveChanges = () => {
  const updatedDevice = {
    type: typeKey.value,
    devices: devices.value.reduce((acc, device) => {
      acc[device.name] = [{count: String(device.count)}];
      return acc;
    }, {})
  };

  emit('save', updatedDevice);
  emit('close');
};
</script>

<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-info">
        <h2>Таблица: {{ typeKey }}</h2>

        <br>

        <div class="devices">
          <h3>Устройства:</h3>
          <ul>
            <li v-for="(device, index) in devices" :key="index">
              {{ device.name }}
              <input v-model="device.count" type="number" min="0"/>
              <button class="remove-btn" @click="removeDevice(index)">Удалить</button>
            </li>
          </ul>
        </div>

        <div class="add-device">
          <input v-model="newDevice" type="text" placeholder="Добавить новое устройство"/>
          <button class="add-btn" @click="addDevice">Добавить Устройство</button>
        </div>

        <div class="modal-actions">
          <button class="save-btn" @click="saveChanges">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  width: 480px;
  max-width: 90%;
  height: 50%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  color: #333;
  font-family: 'Poppins', sans-serif;
  animation: slideUp 0.4s ease;
  position: relative;

  h2 {
    color: #007bff;
    font-size: 2rem;
    text-align: center;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
  }
}

.modal-info {
  padding: 10px;
  height: 100%;
  overflow: auto;
}

.devices {

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  ul {
    padding: 0;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-radius: 10px;
      transition: background-color 0.3s, transform 0.2s;
      border: 1px solid #ddd;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      &:hover {
        background-color: rgba(240, 240, 240, 0.8);
        transform: scale(1.02);
      }
    }
  }
}

.add-device {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  input {
    flex-grow: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 10px;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }
}

.add-btn, .remove-btn {
  background: linear-gradient(135deg, #007bff, #0056b3);
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: linear-gradient(135deg, #0056b3, #004085);
    transform: translateY(-2px);
  }
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  button {
    flex: 1;
    border: none;
    padding: 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:first-child {
      margin-right: 10px;
    }
  }

  .save-btn {
    background: linear-gradient(135deg, #28a745, #218838);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #218838, #1e7e34);
    }
  }

  .cancel-btn {
    background: linear-gradient(135deg, #dc3545, #c82333);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #c82333, #bd2130);
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
