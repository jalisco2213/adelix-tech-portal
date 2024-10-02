<script setup>
import {ref, onMounted} from 'vue'
import {supabase} from '@/ts/client/supabase'

const storageData = ref([]);
const selectedComments = ref([]);
const isModalVisible = ref(false);
const selectedDevice = ref('');

onMounted(async () => {
  const {data, error} = await supabase.from('storage').select('*')
  if (error) console.error(error)
  storageData.value = data
})

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
    <h1>Склад</h1>
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
          <td colspan="3" class="table-header">
            {{ device.type }}
          </td>
        </tr>
        <template v-for="(typeItems, typeKey) in device.devices" :key="typeKey">
          <tr>
            <td>{{ typeKey }}</td>
            <td>{{ typeItems[0].count }}</td>
            <td>
              <button @click="openModal(typeItems[0].comment, typeKey)">Просмотр комментариев</button>
            </td>
          </tr>
        </template>
      </template>
      </tbody>
    </table>

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
             {{ comment.text.operation === 'take' ? ' взял' : 'put' ? ' положил' : 'не обнаружено' }}
            <strong>{{ comment.text.quantity }} шт. {{ selectedDevice }}</strong>.
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
}

.storage-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #f2f2f2;
  }

  .table-header {
    padding: 10px 0;
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    text-transform: uppercase;
  }

  button {
    background-color: #4CAF50;
    color: white;
    padding: 5px 10px;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #45a049;
    }
  }
}

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


  @keyframes slide-top {
    0% {
      transform: translateY(50px);
    }
    100% {
      transform: translateY(0);
    }
  }

  h2 {
    margin-bottom: 15px;
    font-size: 26px;
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
    font-size: 16px;
    color: #555;
    line-height: 1.5;
  }

  .operation {
    font-weight: normal;
    &.take {
      color: green;
    }

    &.put {
      color: red;
    }
  }

  strong {
    color: #000;
  }

  .close-button {
    position: absolute;
    cursor: pointer;
    top: 10px;
    right: 15px;
    font-size: 30px;
    color: #999;
    transition: color 0.3s;

    &:hover {
      color: #333;
    }
  }
}
</style>
