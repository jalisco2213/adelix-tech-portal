<script setup>
import {ref, onMounted} from 'vue';
import {supabase} from '@/ts/client/supabase';

const props = defineProps(['device']);
const emit = defineEmits(['close']);

const logs = ref([]);
const selectedDevice = ref('');

onMounted(async () => {
  selectedDevice.value = props.device;

  const {data, error} = await supabase
    .from('logs')
    .select('*')
    .eq('device', selectedDevice.value);

  if (error) {
    console.error(error);
    return;
  }
  logs.value = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

const closeModal = () => {
  emit('close');
};

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(',', '');
}
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Информация о {{ selectedDevice }}</h2>
      <ul>
        <li v-for="(log, index) in logs" :key="index" class="log-entry">
          <p>
            <strong>{{ formatTimestamp(log.timestamp) }}</strong>:
            <span>{{ log.username }}</span>
            <span class="operation" :class="{ take: log.operations === 'remove', put: log.operations === 'add' }">
              {{ log.operations === 'remove' ? ' взял' : ' положил' }} <strong>
              {{ log.count}} шт {{ selectedDevice }}.</strong> Остаток на складе: <strong>{{ log.historyCount }} шт.</strong>
            </span>
          </p>
        </li>
      </ul>
      <span class="close-button" @click="closeModal">×</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-content {
  background-color: #ffffff;
  padding: 30px;
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
