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
</script>

<template>
  <div class="thickness-container">
    <div class="thickness">
      <div class="thickness-info">

        <div class="thickness-header">
          <p>ADELIX</p>
          <span class="sensor">sensor</span>
          <span>{{ serialType }}</span>
        </div>

        <div class="thickness-center">
          <p v-html="label.replace(/\n/g, '<br>')"></p>
        </div>

        <div class="thickness-footer">
          <div class="thickness-footer_data">
            <div class="thickness-footer-data_serial">
              <span class="name-label">S/N</span>
              <span>{{ serial }}</span>
            </div>

            <div class="thickness-footer-data_date">
              <span class="name-label">Date</span>
              <span>{{ date }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.thickness {
  width: 280px;
  height: 150px;
  border: 1px solid #111;
}

.thickness-info {
  padding: 7px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.thickness-header {
  display: flex;
  justify-content: center;
  align-items: end;
  padding: 8px 0;
  gap: 10px;
  background: #111111;
  width: 100%;
  height: 100%;

  p {
    font-weight: 700;
    letter-spacing: 1px;
    color: rgb(43, 149, 238);
    font-size: 27px;
  }

  .sensor {
    color: #eee;
    font-size: 13px;
    font-weight: 500;
  }

  span:last-child {
    font-weight: 700;
    letter-spacing: 1px;
    color: #eee;
    font-size: 27px;
  }
}

.thickness-center {
  background: #2b95ee;
  width: 100%;

  p {
    text-align: center;
    font-size: 15px;
  }
}

.thickness-footer {
  background: #111111;
  height: 100%;
  width: 100%;

  .thickness-footer_data {
    padding: 5px;
    height: 100%;
    display: flex;
    justify-content: center;
    gap: 60px;
    align-items: center;
    color: #eee;

    .thickness-footer-data_serial,
    .thickness-footer-data_date {
      display: flex;
      flex-direction: column;
      margin-bottom: 2px;

      .name-label {
        font-size: 10px;
        margin-bottom: 2px;
      }

      span:last-child {
        background: #eee;
        padding: 2px 20px;
        color: #111;
        font-weight: 700;
      }
    }
  }
}
</style>