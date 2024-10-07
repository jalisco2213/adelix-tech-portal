<script setup>
import {ref, onMounted} from 'vue';
import {supabase} from '@/ts/client/supabase';
import StorageEditCount from "@/components/Warehouse/StorageEditCount.vue";

const storageData = ref([]);
const selectedComments = ref([]);
const isModalVisible = ref(false);
const selectedDevice = ref('');

onMounted(async () => {
  const {data, error} = await supabase.from('storage').select('*').order('id', {ascending: true});
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
    <h1 style="width: 100%">
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
              <td>
                <StorageEditCount :device="device" :count="typeItems[0].count" :typeKey="typeKey" :type="device.type"/>
              </td>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
  border-radius: 12px;
}

.storage {
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #111;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  overflow: auto;
}

.storage-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;

  th, td {
    padding: 8px 10px;
    text-align: center;
    font-size: 16px;
    color: #4A4A4A;
    border-bottom: 1px solid #E0E0E0;
  }

  th {
    background-color: #F1F1F1;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  td {
    background-color: #FFFFFF;
    transition: background-color 0.3s;
  }

  .table-header {
    background-color: #E8E8E8;
    font-weight: bold;
    font-size: 18px;
    padding: 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #333;
  }

  img {
    width: 24px;
    cursor: pointer;
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.modal-overlay {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease-in-out;
  backdrop-filter: blur(8px);
}

.modal-content {
  background-color: #FFFFFF;
  padding: 40px;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-in;

  h2 {
    text-align: center;
    color: #4A4A4A;
    font-weight: 700;
    margin-bottom: 20px;
    font-size: 24px;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .log-entry {
    font-size: 14px;
    color: #555;
    padding: 10px 0;
    border-bottom: 1px solid #E0E0E0;

    &:last-child {
      border-bottom: none;
    }

    strong {
      color: #333;
    }

    .operation {
      font-weight: bold;

      &.take {
        color: #28A745;
      }

      &.put {
        color: #DC3545;
      }
    }
  }

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
    color: #999;

    &:hover {
      color: #333;
    }
  }
}

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
</style>

