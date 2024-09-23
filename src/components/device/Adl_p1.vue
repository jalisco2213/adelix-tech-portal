<script setup>
import { defineEmits } from 'vue';

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
</script>

<template>
  <div :class="`${id}-container`">
    <div class="p1-content">
      <div class="p1-left">
        <img src="/logo.png" alt="logo">
      </div>

      <div class="p1-right">
        <div class="p1-mark">
          <h1 style="font-size: 25.5px; margin: 0; padding: 0; color: #eee; text-align: center;">{{ id }}</h1>

          <p v-if="!isUkrainian" style="font-size: 15px; text-align: center; color: #eee; margin: 0 0 0 7.5px; padding: 0;">
            S/N P3.{{ serial }} &nbsp; {{ date }}</p>

          <p v-else style="font-size: 15px; text-align: center; color: #eee; margin: 0 0 0 7.5px; padding: 0;">
            № P3.{{ serial }} &nbsp; {{ date }}</p>
        </div>

        <div class="p1-info">
          <div class="p1-count">
            <p>0,00</p>
          </div>

          <div class="p1-power" style="display: flex; align-items: center; gap: 4.5px;">
            <div class="p1-power_img" style="display: flex; align-items: center;">
              <img src="/power.png" style="width: 30px; height: 30px;" alt="">
            </div>

            <div v-if="!isUkrainian" class="p1-power-subtitle"
                 style="font-size: 15px; line-height: 1; color: #eee; font-weight: 500;">
              Power on / <br> Measuring
            </div>

            <div v-else class="p1-power-subtitle"
                 style="font-size: 15px; line-height: 1; color: #eee; font-weight: 500;">
              Живлення / <br> Вимірювання
            </div>
          </div>
        </div>
      </div>

      <div class="p1-arrow">
        <span v-if="!isUkrainian">
          ADELIX COMPANY &nbsp; PORTABLE VIBRATION METER
        </span>

        <span v-else>
          ADELIX &nbsp; ПОРТАТИВНИЙ ВІБРОМЕТР
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.p1-container {
  width: 900px;
  user-select: none;
}

.p1-content {
  position: relative;
  width: 640.5px;
  height: 112.5px;
  border-radius: 22.5px;
  background: #111;
  display: flex;
  align-items: center;
}

.p1-left {
  img {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4.5px auto auto 22.5px;
    width: 172.5px;
    height: 75px;
  }
}

.p1-arrow {
  position: absolute;
  bottom: 16.5px;
  left: 180px;
  width: 435px;
  height: 19.5px;
  background: rgb(43, 149, 238);
  border-radius: 3px;

  span {
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0;
    margin: 0;
    font-size: 13.5px;
    font-weight: 700;
    color: #fff;
  }
}

.p1-right {
  display: flex;
}

.p1-mark {
  background: rgb(114, 114, 113);
  width: 172.5px;
  height: 52.5px;
  margin: 0 6px 21px 22.5px;
  border-radius: 3px;
}

.p1-info {
  background: rgb(114, 114, 113);
  width: 219px;
  height: 52.5px;
  border-radius: 3px;
  display: flex;
  align-items: center;

  .p1-count {
    border: 1px solid #eee;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 75px;
    text-align: center;
    margin: 9px 7.5px;
    font-size: 22.5px;
    color: #eee;
    border-radius: 4.5px;

    p {
      padding: 3px;
      margin: 0;
      font-size: 19.5px;
    }
  }
}
</style>
