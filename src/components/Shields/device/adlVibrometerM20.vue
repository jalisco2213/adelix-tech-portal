<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['updateData']);

const props = defineProps({
  id: String,
  label: String,
  serial: String,
  isUkrainian: Boolean,
  labelUkrainian: String,
  isTurkey: Boolean,
  serialType: String,
  artN: String
});

let date = new Date().getFullYear();
</script>

<template>
  <div :class="`${id}-container`">
    <div class="shields-container">
      <div class="M20-container">
        <div class="M20-info">
          <div class="cut-border"></div>

          <div class="M20-header"
            style="padding: 8px 10px 10px; margin-bottom: 3px; border-bottom: 2px solid #2b95ee; display: flex; align-items: center; justify-content: space-between; gap: 5px;">
            <img v-if="!isUkrainian" style="width: 75px;" src="/logo.png" alt="logo">
            <img v-else style="width: 75px;" src="/logo.png" alt="logo">

            <p v-if="!isUkrainian && !isTurkey"
              style="color: #eee; margin: 0; font-size: 15px; padding: 0; font-weight: 700; text-align: center;">
              PORTABLE VIBRATION METER <br>
              <span style="font-size: 10px;"><span style="color: rgb(43, 149, 238); font-size: 11px">ADELIX</span> with
                temperature measurement function</span>
            </p>

            <p v-if="isUkrainian"
              style="color: #eee; margin: 0; font-size: 15px; padding: 0; font-weight: 700; text-align: center;">
              ПОРТАТИВНИЙ ВІБРОМЕТР<br>
              <span style="font-size: 10px;"><span style="color: rgb(43, 149, 238); font-size: 11px">ADELIX</span> з
                функцією вимірювання температури</span>
            </p>

            <p v-if="!isUkrainian && isTurkey"
              style="color: #eee; margin: 0; font-size: 15px; padding: 0; font-weight: 700; text-align: center;">
              PORTABLE VIBRATION METER <br>
              <span style="font-size: 10px;"><span style="color: rgb(43, 149, 238); font-size: 11px">ADELIX</span> with
                temperature measurement function</span>

            <pre style="font-size: 11px;">Made in Turkey</pre>
            </p>

            <img style="height: 30px;" src="/bluetooth.png" alt="logo">
          </div>

          <div class="M20-footer"
            style="padding: 5px 7px 10px; display: flex; justify-content: space-between; align-items: center;">
            <div class="M20-left" style="border-right: 2px solid #eee;">
              <div class="M20-left_header"
                style="display: flex; margin-bottom: 2px; align-items: center; padding-right: 10px;">
                <p style="font-weight: 900; font-size: 15px; color: #eee">ADL-M20</p> &nbsp;
                <p v-if="!isUkrainian" style="font-size: 12px; color: #eee;">S/N {{ serialType }}.{{ serial }}</p>
                <p v-else style="font-size: 12px; color: #eee;">№ {{ serialType }}.{{ serial }}</p>
              </div>

              <div class="M20-left_footer" style="display: flex; align-items: center; padding-right: 10px;">
                <p v-if="!isUkrainian" style="font-size: 11px; color: #eee">Art/N &nbsp; {{ artN }} &nbsp; Date:
                  2024</p>
                <p v-else style="font-size: 11px; color: #eee">Парт № {{ artN }} &nbsp; 2024</p>
              </div>
            </div>

            <div class="M20-right" style="display: flex; align-items: center; height: 100%;">
              <img v-if="!isUkrainian" style="width: 200px; display: flex; align-items: center;" src="/m20-eng.png"
                alt="">
              <img v-if="isUkrainian" style="width: 215px; display: flex; align-items: center;" src="/m20-ukr.png"
                alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.M20-info {
  position: relative;
  border: 1px solid #111;
  width: 410px;
  height: 130px;
  background: #161616;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

.cut-border {
  width: 404px;
  height: 123px;
  border: 1px solid rgb(255, 250, 253);
  border-radius: 30px;
  position: absolute;
  top: 3px;
  left: 2px;
}
</style>
