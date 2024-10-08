<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/ts/client/supabase';
import * as XLSX from 'xlsx';
import StorageEditCount from "@/components/Warehouse/StorageEditCount.vue";
import StorageAddSection from "@/components/Warehouse/StorageAddSection.vue";

const storageData = ref([]);
const selectedComments = ref([]);
const isModalVisible = ref(false);
const selectedDevice = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);
const deviceTypeFilter = ref('');

onMounted(async () => {
  const { data, error } = await supabase.from('storage').select('*').order('id', { ascending: true });
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

const sortedStorageData = computed(() => {
  const data = filteredStorageData.value.slice();

  return data;
});

const filteredStorageData = computed(() => {
  let data = storageData.value;

  if (searchQuery.value) {
    data = data.map(device => {
      const filteredDevices = Object.keys(device.devices).reduce((acc, typeKey) => {
        const typeItems = device.devices[typeKey].filter(item => {
          const commentMatches = item.comment && Array.isArray(item.comment) && item.comment.some(comment =>
            comment.text.username.toLowerCase().includes(searchQuery.value.toLowerCase())
          );
          return typeKey.toLowerCase().includes(searchQuery.value.toLowerCase()) || commentMatches;
        });

        if (typeItems.length) {
          acc[typeKey] = typeItems;
        }
        return acc;
      }, {});

      return Object.keys(filteredDevices).length > 0 ? { type: device.type, devices: filteredDevices } : null;
    }).filter(device => device !== null);
  }

  if (deviceTypeFilter.value) {
    data = data.filter(device => device.type === deviceTypeFilter.value);
  }

  return data;
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedStorageData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(sortedStorageData.value.length / itemsPerPage.value);
});

const exportToExcel = () => {
  const csvData = [
    ["Тип", "Название", "Количество", "Комментарии"],
    ...paginatedData.value.flatMap(device => {
      if (!device.devices) return [];
      return Object.entries(device.devices).map(([typeKey, typeItems]) => {
        const count = typeItems[0]?.count || 0;
        const comments = typeItems[0]?.comment ? typeItems[0].comment.map(c => c.text.username).join(", ") : '';
        return [device.type, typeKey, count, comments];
      });
    })
  ];

  const ws = XLSX.utils.aoa_to_sheet(csvData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Storage Data');

  XLSX.writeFile(wb, 'storage_data.xlsx');
};
</script>

<template>
  <div class="storage-container">
    <div class="header">
      <div class="header-title">
        <img src="/storage.svg" alt="Storage Icon"/>
        Склад
      </div>
      <div class="header-controls">
        <select v-model="deviceTypeFilter" class="filter-select sort-select">
          <option value="">Все типы</option>
          <option v-for="device in storageData" :key="device.type" :value="device.type">{{ device.type }}</option>
        </select>
        <input type="number" v-model="itemsPerPage" min="1" class="items-per-page-input" />
        <input type="text" v-model="searchQuery" placeholder="Поиск" class="search-input"/>
        <img @click="exportToExcel" class="export-button" src="/excel.svg" alt="">
        <StorageAddSection/>
      </div>
    </div>
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
        <template v-for="(device, index) in paginatedData" :key="index">
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
                <img src="/info.svg" @click="openModal(typeItems[0].comment, typeKey)"/>
              </td>
            </tr>
          </template>
        </template>
        </tbody>
      </table>
    </div>

    <div class="pagination-controls">
      <button :disabled="currentPage === 1" @click="currentPage--">Назад</button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">Вперед</button>
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
                {{ comment.text.operation === 'take' ? ' взял' : ' положил' }} <strong>{{ comment.text.quantity }} шт. {{ selectedDevice }}</strong>.
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
  align-items: center;
  width: 100%;
  border-radius: 12px;
}

.pagination-controls {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;

  button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
}

.sort-select {
  font-family: "Montserrat", sans-serif;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }
}

.search-input {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  width: 250px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }
}

.storage {
  width: 100%;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #111;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  overflow: auto;
}

.storage-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px 10px;
    text-align: center;
    font-size: 16px;
    color: #495057;
    border-bottom: 1px solid #E0E0E0;
  }

  th {
    background-color: #f1f3f5;
    font-weight: bold;
    text-transform: uppercase;
  }

  td {
    background-color: #ffffff;
    transition: background-color 0.3s;
  }

  .table-header {
    background-color: #e9ecef;
    font-weight: bold;
    font-size: 18px;
    padding: 16px;
    text-transform: uppercase;
  }

  img {
    width: 24px;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.modal-overlay {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
}

.modal-content {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-in;

  h2 {
    text-align: center;
    color: #343a40;
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
    color: #495057;
    padding: 10px 0;
    border-bottom: 1px solid #e9ecef;

    &:last-child {
      border-bottom: none;
    }

    strong {
      color: #212529;
    }

    .operation {
      font-weight: bold;

      &.take {
        color: #28a745;
      }

      &.put {
        color: #dc3545;
      }
    }
  }

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
    color: #868e96;

    &:hover {
      color: #343a40;
    }
  }
}
</style>