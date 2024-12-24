<script setup>
import {ref, computed, onMounted} from 'vue';
import {supabase} from '@/ts/client/supabase';
import * as XLSX from 'xlsx';
import StorageEditCount from "@/components/Warehouse/StorageEditCount.vue";
import StorageAddSection from "@/components/Warehouse/StorageAddSection.vue";
import EditModal from '@/components/Warehouse/StorageEditTable.vue';
import StorageInfoModal from "@/components/Warehouse/StorageInfoModal.vue";
import {editorSession} from '../../ts/client/state';

const storageData = ref([]);
const selectedComments = ref([]);
const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const selectedDevice = ref('');
const searchQuery = ref('');
const deviceTypeFilter = ref('');
const currentEditData = ref(null);

onMounted(async () => {
  const channel = supabase
    .channel('postgresChangesChannel')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'storage'
    }, async payload => {
      storageData.value.push(payload.new);
    })
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'storage'
    }, async payload => {
      const index = storageData.value.findIndex(device => device.id === payload.new.id);
      if (index !== -1) {
        Object.assign(storageData.value[index], payload.new);
      }
    })
    .on('postgres_changes', {
      event: 'DELETE',
      schema: 'public',
      table: 'storage'
    }, async payload => {
      storageData.value = storageData.value.filter(device => device.type !== payload.old.type);
    })
    .subscribe();

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

const openEditModal = (device) => {
  currentEditData.value = device;
  isEditModalVisible.value = true;
};

const closeEditModal = () => {
  isEditModalVisible.value = false;
};

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

      return Object.keys(filteredDevices).length > 0 ? {type: device.type, devices: filteredDevices} : null;
    }).filter(device => device !== null);
  }

  if (deviceTypeFilter.value) {
    data = data.filter(device => device.type === deviceTypeFilter.value);
  }

  return data;
});

const exportToExcel = () => {
  const csvData = [
    ["Тип", "Название", "Количество"],
    ...filteredStorageData.value.flatMap(device => {
      if (!device.devices) return [];
      return Object.entries(device.devices).map(([typeKey, typeItems]) => {
        const count = typeItems[0]?.count || 0;
        return [device.type, typeKey, count];
      });
    })
  ];

  const ws = XLSX.utils.aoa_to_sheet(csvData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Storage Data');

  const date = new Date().toISOString().split('T')[0];
  const filename = `${date}_storage-data.xlsx`;

  XLSX.writeFile(wb, filename);
};

async function editType(device) {
  openEditModal(device);
}

const updateData = async (updatedDevice) => {
  const {error} = await supabase
    .from('storage')
    .update({type: updatedDevice.type, devices: updatedDevice.devices})
    .match({type: updatedDevice.type});

  if (error) {
    return;
  } else {
    const {data, error: fetchError} = await supabase.from('storage').select('*').order('id', {ascending: true});
    storageData.value = data;
  }
};
</script>

<template>
  <div class="storage-container w96">
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
        <template v-for="(device, index) in filteredStorageData" :key="index">
          <tr>
            <td colspan="3" class="table-header">
              <div style="display: flex; align-items: center; justify-content:center; gap: 5px; cursor: default">
                {{ device.type }}
                <img v-if="editorSession.value.role === 'Администратор'" @click="editType(device)" src="/edit.svg"
                     alt="">
              </div>
            </td>
          </tr>
          <template v-for="(typeItems, typeKey) in device.devices" :key="typeKey">
            <tr>
              <td>{{ typeKey }}</td>
              <td>
                <StorageEditCount :device="device" :count="typeItems[0].count" :typeKey="typeKey"
                                  :type="device.type"/>
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

    <div v-if="isEditModalVisible">
      <EditModal :device="currentEditData" @close="closeEditModal" @save="updateData"/>
    </div>

    <StorageInfoModal v-if="isModalVisible" :device="selectedDevice" @close="closeModal"/>
  </div>
</template>

<style scoped lang="scss">
.storage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  padding: 20px;
  width: 96%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    font-weight: bold;
    color: #333;

    img {
      width: 32px;
      height: 32px;
    }
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .filter-select,
  .items-per-page-input,
  .search-input {
    font-family: "Montserrat", sans-serif;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #dcdfe3;
    border-radius: 8px;
    transition: box-shadow 0.3s, border-color 0.3s;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
      border-color: #007bff;
    }
  }

  .export-button {
    cursor: pointer;
    width: 32px;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.2);
    }
  }
}

.storage {
  width: 100%;
  background-color: #fff;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border: 1px solid #111;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.storage-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: #f1f3f5;

    th {
      text-transform: uppercase;
      font-size: 14px;
      font-weight: bold;
      color: #6c757d;
      padding: 12px 10px;
    }
  }

  tbody {
    tr {
      &:hover {
        background-color: #f9fafb;
      }
    }

    td {
      text-align: center;
      padding: 8px 10px;
      font-size: 14px;
      color: #495057;
      border-bottom: 1px solid #dee2e6;

      &.low-stock {
        color: #dc3545;
        font-weight: bold;
      }

      img {
        cursor: pointer;
        width: 20px;
        transition: transform 0.3s;

        &:hover {
          transform: scale(1.2);
        }
      }
    }

    .table-header {
      background-color: #e9ecef;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      padding: 10px 0;
      text-transform: uppercase;
      color: #495057;
    }
  }
}

.pagination-controls {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>