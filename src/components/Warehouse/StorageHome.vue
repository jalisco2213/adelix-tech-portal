<script setup>
import {ref, onMounted} from 'vue';
import {supabase} from '@/ts/client/supabase';

const storageData = ref([]);
const selectedComments = ref([]);
const isModalVisible = ref(false);
const selectedDevice = ref('');

onMounted(async () => {
  const {data, error} = await supabase.from('storage').select('*');
  if (error) console.error(error);
  storageData.value = data;
});

const openModal = (comments, deviceName) => {
  selectedComments.value = comments;
  selectedDevice.value = deviceName;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};
</script>

<template>
  <div class="storage-container">
    <h1>
      <img src="/storage.svg" alt="">
      Склад
    </h1>
    <div class="storage">
      <table class="storage-table">
        <thead>
        <tr>
          <th>Название</th>
          <th>Количество</th>
          <th>История</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(device, index) in storageData" :key="index">
          <tr>
            <td colspan="3" class="table-header">{{ device.type }}</td>
          </tr>
          <template v-for="(typeItems, typeKey) in device.devices" :key="typeKey">
            <tr>
              <td>{{ typeKey }}</td>
              <td>{{ typeItems[0].count }}</td>
              <td>
                <img src="/info.svg" @click="openModal(typeItems[0].comment, typeKey)">
              </td>
            </tr>
          </template>
        </template>
        </tbody>
      </table>
    </div>

    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal-content">
        <h2>Информация о {{ selectedDevice }}</h2>
        <ul>
          <li v-for="(comment, index) in selectedComments" :key="index" class="log-entry">
            <p>
              <strong>{{ comment.time }}</strong>:
              <span>{{ comment.text.username }}</span>
              <span class="operation"
                    :class="{ take: comment.text.operation === 'take', put: comment.text.operation === 'put' }">
                {{ comment.text.operation === 'take' ? ' взял' : ' положил' }} <strong>{{ comment.text.quantity }} шт. {{
                  selectedDevice
                }}</strong>.
              </span>
              Общее количество: <strong>{{ comment.text.historyCount }}</strong>
            </p>
          </li>
        </ul>
        <span class="close-button" @click="closeModal">×</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.storage-container {
  width: 100%;
  padding: 20px;
  border-radius: 12px;
}

.storage {
  border: 1px solid #111;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  overflow: auto;
  background-color: #ffffff;
}

.storage-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 20px;

  th, td {
    border: 1px solid #e0e0e0;
    padding: 8px;
    text-align: center;
    font-size: 16px;
    color: #333;
  }

  th {
    background-color: #f1f1f1;
    color: #333;
    padding: 15px;
    font-weight: bold;
  }

  .table-header {
    padding: 10px 0;
    font-weight: bold;
    font-size: 18px;
    text-transform: uppercase;
    background-color: #e8e8e8;
  }

  img {
    width: 20px;
    cursor: pointer;
    margin: auto;
    display: flex;
  }
}

.modal-overlay {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease-in-out;
}

.modal-content {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h2 {
    margin-bottom: 15px;
    font-size: 24px;
    color: #333;
    text-align: center;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  .log-entry {
    margin-bottom: 15px;
    padding-bottom: 10px;

    &:not(:last-child) {
      border-bottom: 1px solid #e0e0e0;
    }
  }

  p {
    font-size: 14px;
    color: #555;
    line-height: 1.6;
  }

  .operation {
    font-weight: bold;

    &.take {
      color: #4CAF50;
    }

    &.put {
      color: #F44336;
    }
  }

  strong {
    color: #000;
  }

  .close-button {
    position: absolute;
    cursor: pointer;
    top: 15px;
    right: 20px;
    font-size: 24px;
    color: #999;
    transition: color 0.3s;

    &:hover {
      color: #333;
    }
  }
}
</style>

