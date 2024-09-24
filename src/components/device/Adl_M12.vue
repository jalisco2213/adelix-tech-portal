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
</script>

<template>
  <div :class="`${id}-container`">
    <div class="shields-container">
      <div class="M12-container">
        <div class="M12-info">
          <div class="M12-header"
               style="padding: 10px 8px 5px; display: flex; align-items: center; justify-content: space-between; gap: 5px;">
            <img v-if="!isUkrainian" style="width: 75px;" src="/logo.png" alt="logo">
            <img v-else style="width: 70px;" src="/logo.png" alt="logo">

            <p v-if="!isUkrainian" style=" font-size: 15px; color: #eee; margin: 0; padding: 0; font-weight: 700;">
              <span style="color: #2b95ee; font-weight: 900">ADELIX</span> PORTABLE <br> VIBRATION METER
            </p>

            <p v-else style="color: #eee; margin: 0; padding: 0; font-weight: 700; ">
              <span style="font-size: 12px;">ПОРТАТИВНИЙ ВІБРОМЕТР</span> <br>
              <div class="" style="display: flex; justify-content: space-between;">
                <p style="padding-bottom: 5px;font-size: 16px; color: rgb(43, 149, 238)">ADELIX</p>
                <p style="padding-bottom: 5px;font-size: 16px; color: #FFED00;">UKRAINE</p>
              </div>
            </p>

            <img style="height: 30px;" src="/bluetooth.png" alt="logo">
          </div>

          <div class="M12-footer" style="padding: 5px 10px 10px;">
            <div class="M12-footer_content"
                 style="background: rgb(114, 114, 113); padding: 3px 10px; border-radius: 10px; display: flex; justify-content: space-between;">
              <p style="font-weight: 700; display: flex; align-items: center; font-size: 17px; color: #2b95ee;">
                {{ id }}
              </p>

              <div class="M12-footer-serial"
                   style="background: #eee; border-radius: 15px; padding: 2px 10px; text-align: center; display: flex; align-items: center;">
                <p v-if="!isUkrainian" style="font-weight: 500; font-size: 12px; color: #111;">S/N</p>
                <p v-else style="font-weight: 700; font-size: 12px; color: #111;">№</p>
                &nbsp;
                <span style="font-weight: 700; font-size: 12px;">{{ serial }}</span>
              </div>

              <div class="M12-footer-year"
                   style="background: #eee; font-weight: 700; border-radius: 15px; font-size: 12px; padding: 2px 10px; text-align: center; display: flex; align-items: center;">
                2024
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.M12-info {
  border: 1px solid #111;
  width: 300px;
  height: 103px;
  background: #111;
  border-radius: 5px;
}
</style>
