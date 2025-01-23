<script setup>
import {defineProps} from 'vue';
import {supabase} from '@/ts/client/supabase';
import {editorSession} from "@/ts/client/state";
import Swal from "sweetalert2";

const props = defineProps({
  device: Object,
  count: String,
  type: String,
  typeKey: String,
});

const logOperation = async (operation, info, historyCount, count, cause) => {
  const {error} = await supabase
    .from('logs')
    .insert([{
      username: editorSession.value.username,
      operations: operation,
      device: props.typeKey,
      timestamp: new Date().toISOString(),
      historyCount: historyCount,
      count: count.toString(),
      comment: cause,
    }]);

  if (error) {
    console.error('Ошибка логирования:', error.message);
  }
};

const addDevice = async () => {
  const {value: quantity} = await Swal.fire({
    title: 'Введите количество для добавления',
    input: 'text',
    icon: "warning",
    inputPlaceholder: 'Введите количество',
    showCancelButton: true,
    confirmButtonText: 'Добавить',
    cancelButtonText: 'Отмена',
    inputValidator: (value) => {
      if (!value) {
        return 'Вы должны ввести количество';
      }
    }
  });

  if (quantity) {
    const {value: cause} = await Swal.fire({
      title: "Введите комментарий",
      icon: "warning",
      input: 'text',
      inputPlaceholder: 'В случае отсутствия - прочерк',
      showCancelButton: true,
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
    })

    const newCount = parseInt(props.count) + parseInt(quantity);

    const {data, error} = await supabase
      .from('storage')
      .update({
        devices: {
          ...props.device.devices,
          [props.typeKey]: [{count: newCount.toString()}]
        }
      })
      .eq('type', props.type);

    if (error) {
      await Swal.fire('Ошибка', error.message, 'error');
    } else {
      await logOperation('add', props.typeKey, newCount, quantity, cause);
      await Swal.fire('Успех', 'Прибор добавлен!', 'success');
      window.location.reload();
    }
  }
};

const removeDevice = async () => {
  const {value: quantity} = await Swal.fire({
    title: 'Введите количество для удаления',
    icon: "warning",
    input: 'number',
    inputPlaceholder: 'Введите количество',
    showCancelButton: true,
    confirmButtonText: 'Удалить',
    cancelButtonText: 'Отмена',
    inputValidator: (value) => {
      if (!value) {
        return 'Вы должны ввести количество!';
      }
    }
  });

  if (quantity) {
    const {value: cause} = await Swal.fire({
      title: "Введите комментарий",
      icon: "warning",
      input: 'text',
      inputPlaceholder: 'В случае отсутствия - пропустить',
      showCancelButton: true,
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
    })

    const newCount = parseInt(props.count) - parseInt(quantity);

    if (newCount < 0) {
      await Swal.fire('Ошибка', 'Количество не может быть отрицательным!', 'error');
      return;
    }

    const {data, error} = await supabase
      .from('storage')
      .update({
        devices: {
          ...props.device.devices,
          [props.typeKey]: [{count: newCount.toString()}]
        }
      })
      .eq('type', props.type);

    if (error) {
      await Swal.fire('Ошибка', error.message, 'error');
    } else {
      await logOperation('remove', props.typeKey, newCount, quantity, cause);
      await Swal.fire('Успех', 'Прибор удалён!', 'success');
      window.location.reload();
    }
  }
};
</script>

<template>
  <div class="storage-count">
    <button @click="removeDevice">-</button>
    <span :class="{'low-stock': props.count < 2}">{{ props.count }}</span>
    <button @click="addDevice">+</button>
  </div>
</template>

<style lang="scss" scoped>
.storage-count {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
}

button {
  background: inherit;
  border: none;
  cursor: pointer;
  font-size: 20px;
  font-weight: 400;
  font-family: "Montserrat", sans-serif;
}
</style>
