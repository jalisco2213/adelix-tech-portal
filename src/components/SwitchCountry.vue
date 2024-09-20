<script setup>
import {defineProps, defineEmits} from 'vue';

const props = defineProps({
  country: Boolean
});

const emit = defineEmits(['update:country']);
</script>

<template>
  <div class="switch-container">
    <div class="labels">
      <span :class="{ 'abel-left': true, 'inactive': props.country }">English</span>
    </div>
    <label class="switch">
      <input type="checkbox" :checked="props.country" @change="emit('update:country', $event.target.checked)"
             class="country-checkbox"/>
      <span class="slider"></span>
    </label>
    <div class="labels">
      <span :class="{ 'label-right': true, 'inactive': !props.country }">Украина</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 215px;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.labels {
  font-size: 14px;
}

.label-left,
.label-right {
  color: #333;
}

.inactive {
  opacity: .4;
  text-decoration: line-through;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #6d3d2a;
  transition: .4s;
  border-radius: 30px;

  &:active:before {
    width: 26px;
  }

  &:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    border-radius: 50%;
    bottom: 4px;
    left: 3px;
    background-color: white;
    transition: .2s;
  }
}

input:checked + .slider {
  background-color: #a8aa1e;
}

input:checked + .slider:before {
  transform: translateX(32px);
}
</style>