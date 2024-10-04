<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps(['errorMessage'])

Swal.fire({
  icon: "error",
  title: "Ошибка",
  text: props.errorMessage,
});
</script>

<template>

</template>

