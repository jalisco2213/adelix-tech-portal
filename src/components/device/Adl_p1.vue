<script setup>
import {defineEmits} from 'vue';

const emit = defineEmits(['updateData']);

const props = defineProps({
  id: String,
  label: String,
  serial: String,
  isUkrainian: Boolean,
  labelUkrainian: String,
  serialType: String,
});

let date = new Date().getFullYear();
let artNumber = 'ADL-DU110.01';
</script>

<template>
  <div class="p1-container">
    <div class="p1-content">
      <div class="p1-left">
        <img src="/logo.png" alt="logo">
      </div>

      <div class="p1-right">
        <div class="p1-mark">
          <h1 style="font-size: 17px; margin: 0; padding: 0; color: #eee; text-align: center;">ADL-P1
          </h1>

          <p style="font-size: 10px; text-align: center; color: #eee; margin: 0 0 0 5px; padding: 0;">№
           &nbsp; 2024</p>
        </div>

        <div class="p1-info">
          <div class="p1-count">
            <p>
              0,00
            </p>
          </div>

          <div class="p1-power" style="display: flex; align-items: center; gap: 3px;">
            <div class="p1-power_img" style="display: flex; align-items: center;">
              <img src="/power.png" style="width: 20px; height: 20px;" alt="">
            </div>
            <div class="p1-power-subtitle"
              style="font-size: 10px; line-height: 1; color: #eee; font-weight: 500;">
              Power on / <br>
              Measuring
            </div>

          </div>
        </div>
      </div>

      <div class="p1-arrow">
        <span>
          ADELIX COMPANY &nbsp; PORTABLE VIBRATION METER
        </span>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.p1-container {
  width: 427px;
  user-select: none;
}

.p1-content {
  position: relative;
  width: 427px;
  height: 75px;
  border-radius: 15px;
  background: #111;
  display: flex;
  align-items: center;
}

.p1-left {
  img {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3px auto auto 15px;
    width: 115px;
    height: 50px;
  }
}

.p1-arrow {
  position: absolute;
  bottom: 11px;
  left: 120px;
  width: 290px;
  height: 13px;
  background: rgb(43, 149, 238);
  border-radius: 2px;

  span {
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0;
    margin: 0;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
  }
}

.p1-right {
  display: flex;
}

.p1-mark {
  background: rgb(114, 114, 113);
  width: 115px;
  height: 35px;
  margin: 0 4px 14px 15px;
  border-radius: 2px;
}

.p1-info {
  background: rgb(114, 114, 113);
  width: 146px;
  height: 35px;
  border-radius: 2px;
  display: flex;
  align-items: center;

  .p1-count {
    border: 1px solid #eee;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    text-align: center;
    margin: 6px 5px;
    font-size: 15px;
    color: #eee;
    border-radius: 3px;

    p {
      padding: 2px;
      margin: 0;
      font-size: 13px;
    }
  }
}
</style>