<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['updateData']);

const props = defineProps({
  id: String,
  label: String,
  serial: String,
  isUkrainian: Boolean,
  isTurkey: Boolean,
  labelUkrainian: String,
  serialType: String,
});

let date = new Date().getFullYear();
</script>

<template>
  <div :class="`${id}-container`">
    <div class="shields-container">
      <div class="vibrometer-container">
        <div class="cut-border"></div>

        <div class="vibrometer-info">
          <div class="vibrometer-header">
            <img class="logo" src="/logo.png" alt="logo">

            <!-- Английская версия -->
            <p v-if="!isUkrainian && !isTurkey" class="adelix-portable">
              <span class="adelix">ADELIX</span> PORTABLE <br> VIBRATION METER
            </p>

            <!-- Турецкая версия -->
            <p v-if="isTurkey" class="adelix-portable_turkey">
              <span class="adelix">ADELIX</span> PORTABLE <br> VIBRATION METER
            <pre style="text-align: center;">Made in Turkey</pre>
            </p>

            <!-- Украинская версия -->
            <p v-if="isUkrainian" class="ukrainian-text">
              <span class="small-text">ПОРТАТИВНИЙ ВІБРОМЕТР</span> <br>
            <div class="text-wrapper">
              <p class="adelix-ukraine">ADELIX</p>
              <p class="ukraine">UKRAINE</p>
            </div>
            </p>

            <img class="bluetooth" src="/bluetooth.png" alt="bluetooth">
          </div>

          <!-- Футер для английской версии -->
          <div v-if="!isUkrainian && !isTurkey" class="vibrometer-footer">
            <div class="vibrometer-footer_content">
              <p class="id">{{ id }}</p>
              <div class="vibrometer-footer-serial">
                <p class="sn">S/N &nbsp; </p>
                <span class="serial">{{ serialType }}.{{ serial }}</span>
              </div>
              <div class="vibrometer-footer-year">{{ date }}</div>
            </div>
          </div>

          <!-- Футер для турецкой версии -->
          <div v-if="isTurkey" class="vibrometer-footer_turkey">
            <div class="vibrometer-footer_content">
              <p class="id">{{ id }}</p>
              <div class="vibrometer-footer-serial">
                <p class="sn">S/N &nbsp; </p>
                <span class="serial">{{ serialType }}.{{ serial }}</span>
              </div>
              <div class="vibrometer-footer-year">{{ date }}</div>
            </div>
          </div>

          <!-- Футер для украинской версии -->
          <div v-if="isUkrainian" class="vibrometer-footer">
            <div class="vibrometer-footer_content">
              <p class="id">{{ id }}</p>
              <div class="vibrometer-footer-serial">
                <p class="sn ukraine">№ &nbsp; </p>
                <span class="serial">{{ serialType }}.{{ serial }}</span>
              </div>
              <div class="vibrometer-footer-year">{{ date }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vibrometer-info {
  border: 1px solid #111;
  width: 495px;
  height: 155px;
  background: #111;
  border-radius: 22.5px;
}

.vibrometer-container {
  position: relative;

  .cut-border {
    width: 486px;
    height: 144px;
    border: 1px solid rgb(255, 250, 253);
    border-radius: 22.5px;
    position: absolute;
    top: 5px;
    left: 5px;
  }
}

.vibrometer-header {
  padding: 17px 12px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 7.5px;

  .logo {
    width: 112.5px;
  }

  .adelix-portable {
    font-size: 25px !important;
  }

  .adelix-portable_turkey,
  .adelix-portable {
    text-align: center;
    font-size: 21px;
    color: #eee;
    margin: 0;
    padding: 0;
    font-weight: 700;

    pre {
      font-size: 16px;
    }

    .adelix {
      color: #2b95ee;
      font-weight: 900;
    }
  }

  .ukrainian-text {
    color: #eee;
    margin: 0;
    padding: 0;
    font-weight: 700;

    .small-text {
      font-size: 19.5px;
    }

    .text-wrapper {
      display: flex;
      justify-content: space-between;

      .adelix-ukraine {
        padding-bottom: 7.5px;
        font-size: 24px;
        color: rgb(43, 149, 238);
      }

      .ukraine {
        padding-bottom: 7.5px;
        font-size: 24px;
        color: #ffed00;
      }
    }
  }

  .bluetooth {
    height: 54px;
  }
}

.vibrometer-footer_turkey,
.vibrometer-footer {
  padding: 9px 15px 22.5px;

  .vibrometer-footer_content {
    background: rgb(114, 114, 113);
    padding: 7.5px 15px;
    border-radius: 15px;
    display: flex;
    justify-content: space-between;

    .id {
      font-weight: 700;
      display: flex;
      align-items: center;
      font-size: 25.5px;
      color: #2b95ee;
    }

    .vibrometer-footer-serial {
      background: #eee;
      border-radius: 22.5px;
      padding: 3px 15px;
      text-align: center;
      display: flex;
      align-items: center;

      .sn {
        font-weight: 500;
        font-size: 18px;
        color: #111;

        &.ukraine {
          font-weight: 700;
        }
      }

      .serial {
        font-weight: 700;
        font-size: 18px;
      }
    }

    .vibrometer-footer-year {
      background: #eee;
      font-weight: 700;
      border-radius: 22.5px;
      font-size: 18px;
      padding: 3px 15px;
      text-align: center;
      display: flex;
      align-items: center;
    }
  }
}
</style>
