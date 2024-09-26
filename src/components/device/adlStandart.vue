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
  artN: String
});

let date = new Date().getFullYear();
</script>

<template>
  <div :class="`${id}-container`">
    <div class="shields-container">
      <div class="du-container">
        <div class="du-info">
          <div class="du-content">
            <div class="du-header">
              <p v-if="!isUkrainian" style="padding-top: 10px; font-size: 13px; font-weight: bold;" v-html="label.replace(/\n/g, '<br>')"></p>
              <p v-else style="padding-top: 10px; font-size: 13px; font-weight: bold;" v-html="labelUkrainian.replace(/\n/g, '<br>')"></p>


              <h1 v-if="!isUkrainian" style="padding: 7px 0 10px; line-height: 1;">
                <p style="font-weight: 800; margin-top: 10px; letter-spacing: 1px; color: rgb(43, 149, 238);">ADELIX</p>
                <p style="font-size: 25px; letter-spacing: 1px; margin: 7.5px; font-weight: 800;">{{ id }}</p>
              </h1>

              <h1 v-else style="padding: 7px 0 10px; line-height: 1;">
                <p style="font-weight: 800; letter-spacing: 1px; color: rgb(43, 149, 238);">ADELIX</p>
                <p style="font-weight: 500; font-size: 25px; letter-spacing: 1px; color: #FFED00">УКРАЇНА</p>
                <p style="font-size: 25px; letter-spacing: 1px; font-weight: 800;">{{ id }}</p>
              </h1>
            </div>

            <div class="du-center">
              <div class="du-main">
                <div>
                  <label for="serial">{{isUkrainian ? 'Сер. №' : 'S/N'}}</label>
                  <input style="width: 120px; font-size: 17px;" type="text" :value="`${serialType}.${serial}`" readonly>
                </div>

                <div>
                  <label for="age">{{ isUkrainian ? 'Виг' : 'Date' }}:</label>
                  <input v-model="date" type="text" style="font-size: 17px; width: 100%" id="age">
                </div>
              </div>

              <div style="margin-top: 5px;" class="du-part">
                <label for="part">{{ isUkrainian ? 'Парт №:' : 'Art/N:' }}</label>
                <input v-model="props.artN" type="text" style="font-size: 17px; width: 100%; margin-bottom: 8px;" id="part">
              </div>
            </div>

            <div class="du-footer"
                 style="display: flex; gap: 10px; justify-content: space-between; align-items: center;">
              <img style="width: 130px; height: 55px; " src="/logo.png" alt="logo">
              <img style="width: 60px" src="/qrcode.png" alt="qr">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.generator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  max-width: 600px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.du-container {
  border: 1px solid #111;
  width: 270px;
  //position: absolute;
  left: -500px;
}

.du-content {
  padding: 7px;
}

.du-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto auto;
  border: 1px solid #111;

  .du-header {

    h1,
    p {
      padding: 0;
      margin: 0;
    }
  }
}

h1,
p {
  color: #eee;
}

label {
  font-size: 12px;
}

.du-header {
  text-align: center;
  background: #111;
}

.du-footer {
  background: #111;
  padding: 10px;
}

.du-center {
  background: rgb(43, 149, 238);
  padding: 15px;

  input {
    border-radius: 0;
    border: 0;
    padding: 5px 0;
  }

  .du-main {
    display: flex;
    gap: 8px;
    justify-content: space-between;
  }
}
</style>