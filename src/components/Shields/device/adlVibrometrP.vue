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
  isTurkey: Boolean
});

let date = new Date().getFullYear();
</script>

<template>
  <div :class="`${id}-container`">
    <div class="vibrometr-content">
      <div class="vibrometr-left">
        <img src="/logo.png" alt="logo">
      </div>

      <div class="vibrometr-right">
        <div class="vibrometr-mark">
          <h1 style="font-size: 18px; margin: 0; padding: 0; color: #eee; text-align: center;"
            v-if="!isUkrainian && isTurkey">
            {{ id }}
          </h1>

          <h1 style="font-size: 25.5px; margin: 0; padding: 0; color: #eee; text-align: center;"
            v-if="!isUkrainian && !isTurkey">
            {{ id }}
          </h1>

          <h1 style="font-size: 25.5px; margin: 0; padding: 0; color: #eee; text-align: center;"
            v-if="isUkrainian && !isTurkey">
            {{ id }}
          </h1>

          <p v-if="!isUkrainian && isTurkey"
            style="font-size: 12px; text-align: center; color: #eee; margin: 0 0 0 7.5px; padding: 0;">
            <span style="font-weight: 600;"> S/N {{ serialType }}.{{ serial }} &nbsp; {{ date }} </span> <br>
          <pre>Made in Turkey </pre>
          </p>

          <p v-if="!isUkrainian && !isTurkey"
            style="font-size: 14px; text-align: center; color: #eee; margin: 0 0 0 7.5px; padding: 0;">
            <span> S/N {{ serialType }}.{{ serial }} &nbsp; {{ date }} </span>
          </p>

          <p v-if="isUkrainian && !isTurkey"
            style="font-size: 14px; text-align: center; color: #eee; margin: 0 0 0 7.5px; padding: 0; ">
            № {{ serialType }}.{{ serial }} &nbsp; {{ date }}</p>
        </div>

        <div v-if="serialType === 'P1'" class="vibrometr-info">
          <div class="vibrometr-count">
            <p>0,00</p>
          </div>

          <div class="vibrometr-power" style="display: flex; align-items: center; gap: 4.5px;">
            <div class="vibrometr-power_img" style="display: flex; align-items: center;">
              <img src="/power.png" style="width: 30px; height: 30px;" alt="">
            </div>

            <div v-if="!isUkrainian" class="vibrometr-power-subtitle"
              style="font-size: 15px; line-height: 1; color: #eee; font-weight: 500;">
              Power on / <br> Measuring
            </div>

            <div v-else class="vibrometr-power-subtitle"
              style="font-size: 15px; line-height: 1; color: #eee; font-weight: 500;">
              Живлення / <br> Вимірювання
            </div>
          </div>
        </div>

        <div v-else class="p3-right">
          <div class="p3-info" style="position: relative;">
            <div class="p3-count" style="position: absolute; top: 0; left: 0; padding: 0 !important;">
              <p>
                00,0
              </p>
            </div>

            <div class="p3-power" style="display: flex; align-items: center; gap: 4.5px;">
              <img v-if="!isUkrainian" style="width: 220.5px; height: 50px;" src="/p1-eng.png" alt="">
              <img v-else style="width: 220.5px; height: 50px;" src="/p1-ua.png" alt="">
            </div>
          </div>
        </div>
      </div>

      <div class="vibrometr-arrow">
        <span v-if="!isUkrainian">
          ADELIX &nbsp; &nbsp; {{ label }}
        </span>

        <span v-else>
          ADELIX &nbsp; &nbsp; {{ labelUkrainian }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vibrometr-container {
  width: 900px;
  user-select: none;
}

.vibrometr-content {
  position: relative;
  width: 640.5px;
  height: 112.5px;
  border-radius: 22.5px;
  background: #111;
  display: flex;
  align-items: center;
}

.vibrometr-left {
  img {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4.5px auto auto 22.5px;
    width: 172.5px;
    height: 75px;
  }
}

.vibrometr-arrow {
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

.vibrometr-right {
  display: flex;
}

.vibrometr-mark {
  background: rgb(114, 114, 113);
  width: 172.5px;
  height: 52.5px;
  margin: 0 6px 21px 22.5px;
  border-radius: 3px;
}

.vibrometr-info {
  background: rgb(114, 114, 113);
  width: 219px;
  height: 52.5px;
  border-radius: 3px;
  display: flex;
  align-items: center;

  .vibrometr-count {
    border: 1px solid #eee;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 55px;
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

.p3-mark {
  background: rgb(114, 114, 113);
  width: 172.5px;
  height: 52.5px;
  margin: 0 6px 21px 22.5px;
  border-radius: 3px;
}

.p3-info {
  background: rgb(114, 114, 113);
  width: 219px;
  height: 52.5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
}

.p3-count {
  border: 1px solid #eee;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  text-align: center;
  margin: 2.25px;
  font-size: 22.5px;
  color: #eee;
  border-radius: 4.5px;

  p {
    padding: 3px;
    margin: 0;
    font-size: 15px;
  }
}
</style>
