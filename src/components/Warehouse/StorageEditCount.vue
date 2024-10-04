<script setup>
import {defineProps} from 'vue';
import {supabase} from '@/ts/client/supabase';
import Swal from 'sweetalert2';
import {editorSession} from "@/ts/client/state";

const props = defineProps({
  device: Object,
  count: String,
  type: String,
  typeKey: String,
});

const addDevice = async () => {
  const { value: quantity } = await Swal.fire({
    title: 'Введите количество для добавления',
    input: 'number',
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
    const newCount = parseInt(props.count) + parseInt(quantity);

    const { data, error } = await supabase
      .from('storage')
      .update({
        devices: {
          ...props.device.devices,
          [props.typeKey]: [{ count: newCount.toString() }]
        }
      })
      .eq('type', props.type);

    if (error) {
      await Swal.fire('Ошибка', error.message, 'error');
    } else {
      await Swal.fire('Успех', 'Прибор добавлен!', 'success');
    }
  }
};


const removeDevice = async () => {
  const { value: quantity } = await Swal.fire({
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
    const newCount = parseInt(props.count) - parseInt(quantity);

    if (newCount < 0) {
      await Swal.fire('Ошибка', 'Количество не может быть отрицательным!', 'error');
      return;
    }

    const { data, error } = await supabase
      .from('storage')
      .update({
        devices: {
          ...props.device.devices,
          [props.typeKey]: [{ count: newCount.toString() }]
        }
      })
      .eq('type', props.type);

    if (error) {
      await Swal.fire('Ошибка', error.message, 'error');
    } else {
      await Swal.fire('Успех', 'Прибор удалён!', 'success');
    }
  }
};


</script>

<template>
  <div class="storage-count">
    <button @click="addDevice">+</button>
    <span>{{ count }}</span>
    <button @click="removeDevice">-</button>
  </div>
</template>

<style lang="scss" scoped>
.storage-count {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
}
</style>
