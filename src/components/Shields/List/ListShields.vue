<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '@/ts/client/supabase';
import * as XLSX from 'xlsx';

const deviceShields = ref([]);
const showModal = ref(false);
const selectedStatus = ref([]);
const selectedDevice = ref('');
const searchTerm = ref('');
const selectedStatusType = ref('');
const sortColumn = ref('');
const sortDirection = ref('asc');

const fetchDeviceShields = async () => {
  const { data, error } = await supabase
    .from('shields_log')
    .select('id, device, status_eng, status_uk')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching device shields:', error);
  } else {
    deviceShields.value = data;
  }
};

const sortData = (column) => {
  sortDirection.value = (sortColumn.value === column && sortDirection.value === 'asc') ? 'desc' : 'asc';
  sortColumn.value = column;

  deviceShields.value.sort((a, b) => {
    const valueA = column === 'status_eng' ? a.status_eng : a.status_uk;
    const valueB = column === 'status_eng' ? b.status_eng : b.status_uk;

    if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
};

const toggleModal = (statuses, device, statusType) => {
  selectedStatus.value = statuses;
  selectedDevice.value = device;
  showModal.value = !showModal.value;
  searchTerm.value = '';
  selectedStatusType.value = statusType;
};

const countStatuses = (statuses) => {
  if (!statuses || !statuses.length) return { active: 0, none: 0 };

  return statuses.reduce((acc, status) => {
    if (status.status === 'active') acc.active++;
    if (status.status === 'none') acc.none++;
    return acc;
  }, { active: 0, none: 0 });
};

const filteredStatus = computed(() => {
  if (!selectedStatus.value || !searchTerm.value) {
    return [...selectedStatus.value].sort((a, b) => a.serial - b.serial);
  }

  const searchTermNum = Number(searchTerm.value);
  const filtered = selectedStatus.value.filter(status => {
    const serialAsString = String(status.serial);
    const commentMatches = status.comment.toLowerCase().includes(searchTerm.value.toLowerCase());
    return serialAsString.includes(searchTerm.value) || status.serial === searchTermNum || commentMatches;
  });

  return filtered.sort((a, b) => a.serial - b.serial);
});

const exportToExcel = () => {
  const header = ["#", "Прибор", "Статус (англ.)", "Статус (укр.)"];

  const csvData = [
    header,
    ...deviceShields.value.map(shield => [
      shield.id,
      shield.device,
      countStatuses(shield.status_eng).active + ' активных, ' + countStatuses(shield.status_eng).none + ' неактивных',
      countStatuses(shield.status_uk).active + ' активных, ' + countStatuses(shield.status_uk).none + ' неактивных'
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(csvData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Shields Data');

  const date = new Date().toISOString().split('T')[0];
  const filename = `${date}_shields-data.xlsx`;
  XLSX.writeFile(wb, filename);
};

const updateComment = async (serial, comment) => {
  const fieldToUpdate = selectedStatusType.value === 'eng' ? 'status_eng' : 'status_uk';

  const { error } = await supabase
    .from('shields_log')
    .update({
      [fieldToUpdate]: selectedStatus.value.map(status => {
        if (status.serial === serial) {
          return { ...status, comment };
        }
        return status;
      })
    })
    .eq('device', selectedDevice.value);

  if (error) {
    console.error('Error updating comment:', error);
  } else {
    console.log('Comment updated successfully');
  }
};

const toggleSerialStatus = async (serial) => {
  const updatedStatus = selectedStatus.value.map(status => {
    if (status.serial === serial) {
      return { ...status, status: status.status === 'active' ? 'none' : 'active' };
    }
    return status;
  });

  selectedStatus.value = updatedStatus;

  const fieldToUpdate = selectedStatusType.value === 'eng' ? 'status_eng' : 'status_uk';

  const { error } = await supabase
    .from('shields_log')
    .update({
      [fieldToUpdate]: updatedStatus
    })
    .eq('device', selectedDevice.value);

  if (error) {
    console.error('Error toggling serial status:', error);
  } else {
    console.log('Serial status toggled successfully');
  }
};

const subscribeToDeviceShields = () => {
  const channel = supabase
    .channel('postgresChangesChannel')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'shields_log'
    }, async payload => {
      const updatedShield = payload.new;
      const index = deviceShields.value.findIndex(shield => shield.id === updatedShield.id);
      if (index !== -1) {
        deviceShields.value[index] = updatedShield;
      } else {
        deviceShields.value.push(updatedShield);
      }
    })
    .subscribe();
};

onMounted(() => {
  fetchDeviceShields();
  subscribeToDeviceShields();
});

const newSerial = ref('');
const newComment = ref('');

const addShield = async () => {
  if (!newSerial.value) {
    alert('Введите серийный номер.');
    return;
  }

  const fieldToUpdate = selectedStatusType.value === 'eng' ? 'status_eng' : 'status_uk';

  const newStatus = { serial: newSerial.value, status: 'active', comment: newComment.value };

  const { error } = await supabase
    .from('shields_log')
    .update({
      [fieldToUpdate]: [
        ...selectedStatus.value,
        newStatus
      ]
    })
    .eq('device', selectedDevice.value);

  if (error) {
    console.error('Ошибка при добавлении шильда:', error);
  } else {
    console.log('Шильд добавлен успешно');

    selectedStatus.value.push(newStatus);

    newSerial.value = '';
    newComment.value = '';
  }
};

const deleteShield = async (serial) => {
  const fieldToUpdate = selectedStatusType.value === 'eng' ? 'status_eng' : 'status_uk';

  const updatedStatus = selectedStatus.value.filter(status => status.serial !== serial);

  const { error } = await supabase
    .from('shields_log')
    .update({
      [fieldToUpdate]: updatedStatus
    })
    .eq('device', selectedDevice.value);

  if (error) {
    console.error('Ошибка при удалении шильда:', error);
  } else {
    console.log('Шильд удалён успешно');
    selectedStatus.value = updatedStatus;
  }
};
</script>

<template>
  <div class="storage-container w96">
    <div class="header">
      <div class="header-title">
        <img src="/sticker.svg" alt="Storage Icon" />
        Шильды
      </div>
      <div class="header-controls">
        <img @click="exportToExcel" class="export-button" src="/excel.svg" alt="">
      </div>
    </div>
    <div class="table-container">
      <table class="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Прибор</th>
            <th @click="sortData('status_eng')" style="cursor: pointer;">
              Статус (англ.)
              <span v-if="sortColumn === 'status_eng'">{{ sortDirection === 'asc' ? ' ↑' : ' ↓' }}</span>
            </th>
            <th @click="sortData('status_uk')" style="cursor: pointer;">
              Статус (укр.)
              <span v-if="sortColumn === 'status_uk'">{{ sortDirection === 'asc' ? ' ↑' : ' ↓' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="shield in deviceShields" :key="shield.id">
            <td>{{ shield.id }}</td>
            <td>{{ shield.device }}</td>

            <td>
              <span><b>{{ countStatuses(shield.status_eng).active }}</b> активных, </span>
              <span><b>{{ countStatuses(shield.status_eng).none }}</b> неактивных </span>
              <button class="info-button" @click="toggleModal(shield.status_eng, shield.device, 'eng')">❓</button>
            </td>

            <td>
              <span><b>{{ countStatuses(shield.status_uk).active }}</b> активных, </span>
              <span><b>{{ countStatuses(shield.status_uk).none }}</b> неактивных </span>
              <button class="info-button" @click="toggleModal(shield.status_uk, shield.device, 'uk')">❓</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <span class="close" @click="toggleModal([], '')">&times;</span>
          <h2 style="color: #495057">Серийные номера для: {{ selectedDevice }}</h2>
          <div class="navigation-info">
            <div>
              <p style="color: #495057; font-size: 14px;">Активные: {{ countStatuses(selectedStatus).active }}</p>
              <p style="color: #495057; font-size: 14px;">Неактивные: {{ countStatuses(selectedStatus).none }}</p>
            </div>

            <div class="add-serial">
              <textarea type="text" v-model="newSerial" class="" placeholder="Серийный номер"></textarea>
              <textarea v-model="newComment" placeholder="Комментарий" class="comment-input"></textarea>
              <button @click="addShield" class="add-button">+</button>
            </div>
          </div>
        </div>

        <input type="text" v-model="searchTerm" placeholder="Поиск по серийному номеру или тексту"
          class="search-input" />

        <div class="table-container">
          <table class="styled-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Серийный</th>
                <th>Статус</th>
                <th>Комментарий</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(status, index) in filteredStatus" :key="status.serial">
                <td>{{ index + 1 }}</td>
                <td>{{ status.serial }}</td>
                <td>
                  <span :class="status.status === 'active' ? 'status-indicator active' : 'status-indicator none'">
                    {{ status.status === 'active' ? '✔️' : '❌' }}
                  </span>
                </td>
                <td>
                  <textarea v-model="status.comment" @blur="updateComment(status.serial, status.comment)"></textarea>
                </td>
                <td class="actions-img">
                  <div>
                    <img src="/achive.svg" alt="archive" @click="toggleSerialStatus(status.serial)" />
                    <img src="/delete.svg" alt="" @click="deleteShield(status.serial)" style="cursor: pointer;" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-header {
  background: #ffffff;
  border: 1px solid #495057;
  border-radius: 20px;
  position: sticky;
  top: -10px;
  padding: 10px
}

.navigation-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;

  .add-serial {
    display: flex;
    justify-content: end;

    textarea {
      width: 35%;
      padding: 0;
    }

    button {
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}

.storage-container {
  padding: 20px;
  border-radius: 8px;

  .table-container {
    width: 100%;
    overflow-x: auto;
    border: 1px solid #111;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;

    .styled-table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'Montserrat', sans-serif;

      th,
      td {
        padding: 10px;
        text-align: center;
        border-bottom: 1px solid #e0e0e0;
        font-size: 16px;
        color: #495057;
      }

      thead {
        th {
          background-color: #f1f3f5;
          color: 111;
          padding: 15px !important;
          font-weight: bold;
          text-transform: uppercase;
        }
      }

      tbody {
        tr {
          &:nth-child(even) {
            background-color: #f2f2f2;
          }

          &:hover {
            background-color: #e1e1e1;
          }

          .actions-img {
            div {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 5px;

              img {
                width: 30px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }

  .status-indicator {
    font-size: 12px;
    margin-right: 5px;

    &.active {
      color: green;
    }

    &.none {
      color: red;
    }
  }

  .info-button {
    cursor: pointer;
    background: none;
    border: none;
    color: #007bff;
    font-size: 16px;
    transition: color 0.3s;

    &:hover {
      color: #0056b3;
    }
  }
}

textarea {
  font-family: 'Montserrat', sans-serif;
  width: 90%;
  padding: 3px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #495057;
  background-color: #f8f9fa;
  transition: border-color 0.3s, box-shadow 0.3s;
  resize: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }

  &:hover {
    border-color: #0056b3;
  }
}


.modal-overlay {
  transition: opacity 0.3s ease-in-out;

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    position: relative;
    width: 600px;
    height: auto;
    overflow-y: auto;
    max-height: 80%;
    max-width: 100%;
    animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

    @keyframes slide-top {
      0% {
        transform: translateY(50px);
      }

      100% {
        transform: translateY(0);
      }
    }

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 30px;
      cursor: pointer;
    }
  }
}

.search-input {
  width: 100%;
  padding: 10px 0;
  margin: 15px 0 0;
  border-left: 1px solid #111;
  border-right: 1px solid #111;
  border-top: 1px solid #111;
  border-bottom: none;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
}
</style>