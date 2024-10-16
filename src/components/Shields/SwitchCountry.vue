<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  country: Boolean,
  markedByManufacturer: Boolean
});

const emit = defineEmits(['update:country', 'update:markedByManufacturer']);
</script>

<template>
  <div class="switch-container">
    <div class="select-country">
      <div class="labels">
        <span :class="{ 'label-left': true, 'inactive': props.country }">English</span>
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

    <div class="checkbox-container">
      <label>
        <input type="checkbox" :checked="props.markedByManufacturer"
          @change="emit('update:markedByManufacturer', $event.target.checked)" />
        <span>Производитель</span>
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.switch-container {
  display: flex;
  align-items: start;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  max-width: 320px;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.select-country {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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

input:checked+.slider {
  background-color: #a8aa1e;
}

input:checked+.slider:before {
  transform: translateX(32px);
}

.checkbox-container {
  label {
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;

    input {
      margin-right: 8px;
    }
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    background: #fff;
    border: 2px solid #a8aa1e;
    border-radius: 4px;
    cursor: pointer;
    appearance: none;

    &:checked {
      background-color: #a8aa1e;
      border-color: #6d3d2a;
      position: relative;
    }

    &:checked::before {
      content: '✔';
      display: block;
      position: absolute;
      top: -2px;
      text-align: center;
      color: white;
    }
  }
}
</style>