<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  country: Boolean
});

const emit = defineEmits(['update:country']);
</script>

<template>
  <div class="switch-container">
    <div class="labels">
      <span :class="{ 'label-left': true, 'inactive': props.country }">International</span>
    </div>
    <label class="switch">
      <input type="checkbox" :checked="props.country" @change="emit('update:country', $event.target.checked)"
        class="country-checkbox" />
      <span class="slider"></span>
    </label>
    <div class="labels">
      <span :class="{ 'label-right': true, 'inactive': !props.country }">Украина</span>
    </div>
  </div>
</template>
