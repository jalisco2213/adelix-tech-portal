<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from "@/ts/client/supabase";

const isVisible = ref(false);
const deviceCounts = ref([{ name: '', count: '' }]);
const deviceType = ref('');

function openModal() {
  isVisible.value = true;
}

function closeModal() {
  isVisible.value = false;
  deviceCounts.value = [{ name: '', count: '' }];
}

function addCount() {
  deviceCounts.value.push({ name: '', count: '' });
}

function removeCount(index: number) {
  deviceCounts.value.splice(index, 1);
}

async function submitData() {
  const devices = {};
  deviceCounts.value.forEach((device) => {
    if (device.name && device.count) {
      devices[device.name] = [{ count: device.count }];
    }
  });

  const { data, error } = await supabase
    .from('storage')
    .insert([{ devices: devices, type: deviceType.value }]);

  if (error) {
    console.error('Ошибка при вставке данных:', error);
    Swal.fire({
      icon: 'error',
      title: 'Ошибка!',
      text: 'Не удалось вставить данные. Попробуйте еще раз.',
    });
  } else {
    console.log('Данные вставлены:', data);
    Swal.fire({
      icon: 'success',
      title: 'Успех!',
      text: 'Данные успешно добавлены!',
    });
    closeModal();
  }
}
</script>

<template>
  <img class="addSection" src="/add.svg" @click="openModal" alt="Добавить устройство" />
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Добавить категорию</h2>
      <input v-model="deviceType" placeholder="Заголовок таблицы" class="input-primary" />
      <div v-for="(device, index) in deviceCounts" :key="index" class="device-entry">
        <input v-model="device.name" placeholder="Устройство" class="input-secondary" />
        <input v-model="device.count" placeholder="Количество" class="input-secondary" />
        <button @click="removeCount(index)" class="button-secondary">Удалить</button>
      </div>
      <button class="button-primary" @click="addCount">Добавить устройство</button>
      <button class="button-submit" @click="submitData">Создать</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.addSection {
  margin-right: 20px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    animation: rotateAndScale 0.3s ease-in-out forwards;
  }
}

@keyframes rotateAndScale {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1.2);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  padding: 30px;
  width: 500px;
  max-width: 100%;
  height: 60%;
  position: relative;
  animation: fadeIn 0.3s ease-in;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
    text-align: center;
    font-weight: 600;
  }
}

.input-primary,
.input-secondary {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007BFF;
    outline: none;
  }
}

.device-entry {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;

  .input-secondary {
    width: 45%;
  }
}

.button-primary,
.button-secondary,
.button-submit {
  display: block;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-primary {
  background-color: #007BFF;
  color: #ffffff;
  border: none;

  &:hover {
    background-color: #0056b3;
  }
}

.button-secondary {
  background-color: #f0f0f0;
  color: #555;
  border: 1px solid #ddd;

  &:hover {
    background-color: #e0e0e0;
  }
}

.button-submit {
  background-color: #28a745;
  color: #ffffff;
  margin-top: 5px;

  &:hover {
    background-color: #218838;
  }
}

.modal-content {
  opacity: 0;
  transform: translateY(-30px);
  animation: fadeInUp 0.4s forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
