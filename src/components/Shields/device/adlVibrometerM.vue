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
        <div class="vibrometer-info">
          <div class="vibrometer-header">
            <img v-if="!isUkrainian" class="logo" src="/logo.png" alt="logo">
            <img v-else class="logo ukraine" src="/logo.png" alt="logo">

            <p v-if="!isUkrainian && !isTurkey" class="adelix-portable">
              <span class="adelix">ADELIX</span> PORTABLE <br> VIBRATION METER

            <pre style="text-align: center;" v-if="isTurkey">Made in Turkey</pre>
            </p>

            <p v-if="!isUkrainian && isTurkey" class="adelix-portable_turkey">
              <span class="adelix">ADELIX</span> PORTABLE <br> VIBRATION METER

            <pre style="text-align: center;">Made in Turkey</pre>
            </p>

            <p v-if="isUkrainian" class="ukrainian-text">
              <span class="small-text">ПОРТАТИВНИЙ ВІБРОМЕТР</span> <br>
            <div class="text-wrapper">
              <p class="adelix-ukraine">ADELIX</p>
              <p class="ukraine">UKRAINE</p>
            </div>
            </p>

            <img class="bluetooth" src="/bluetooth.png" alt="bluetooth">
          </div>

          <div v-if="!isUkrainian && !isTurkey" class="vibrometer-footer">
            <div class="vibrometer-footer_content">
              <p class="id">{{ id }}</p>

              <div class="vibrometer-footer-serial">
                <p v-if="!isUkrainian" class="sn">S/N &nbsp; </p>
                <p v-else class="sn ukraine">№ &nbsp; </p>
                <span class="serial">{{ serialType }}.{{ serial }}</span>
              </div>

              <div class="vibrometer-footer-year">
                {{ date }}
              </div>
            </div>
          </div>

          <div v-if="!isUkrainian && isTurkey" class="vibrometer-footer_turkey">
            <div class="vibrometer-footer_content">
              <p class="id">{{ id }}</p>

              <div class="vibrometer-footer-serial">
                <p v-if="!isUkrainian" class="sn">S/N &nbsp; </p>
                <p v-else class="sn ukraine">№ &nbsp; </p>
                <span class="serial">{{ serialType }}.{{ serial }}</span>
              </div>

              <div class="vibrometer-footer-year">
                {{ date }}
              </div>
            </div>
          </div>

          <div v-if="isUkrainian" class="vibrometer-footer">
            <div class="vibrometer-footer_content">
              <p class="id">{{ id }}</p>

              <div class="vibrometer-footer-serial">
                <p v-if="!isUkrainian" class="sn">S/N &nbsp; </p>
                <p v-else class="sn ukraine">№ &nbsp; </p>
                <span class="serial">{{ serialType }}.{{ serial }}</span>
              </div>

              <div class="vibrometer-footer-year">
                {{ date }}
              </div>
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
  width: 330px;
  height: 103px;
  background: #111;
  border-radius: 10px;
}

.vibrometer-header {
  padding: 10px 8px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;

  .logo {
    width: 75px;

    &.ukraine {
      width: 80px;
    }
  }

  .adelix-portable {
    text-align: center;
    font-size: 17px;
    color: #eee;
    margin: 0;
    padding: 0;
    font-weight: 700;

    .adelix {
      color: #2b95ee;
      font-weight: 900;
    }
  }

  .adelix-portable_turkey {
    text-align: center;
    font-size: 14px;
    color: #eee;
    margin: 0;
    padding: 0;
    font-weight: 700;

    pre {
      font-size: 12px;
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
      font-size: 13px;
    }

    .text-wrapper {
      display: flex;
      justify-content: space-between;

      .adelix-ukraine {
        padding-bottom: 5px;
        font-size: 16px;
        color: rgb(43, 149, 238);
      }

      .ukraine {
        padding-bottom: 5px;
        font-size: 16px;
        color: #ffed00;
      }
    }
  }

  .bluetooth {
    height: 36px;
  }
}

.vibrometer-footer {
  padding: 6px 10px 10px;

  .vibrometer-footer_content {
    background: rgb(114, 114, 113);
    padding: 5px 10px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;

    .id {
      font-weight: 700;
      display: flex;
      align-items: center;
      font-size: 17px;
      color: #2b95ee;
    }

    .vibrometer-footer-serial {
      background: #eee;
      border-radius: 15px;
      padding: 2px 10px;
      text-align: center;
      display: flex;
      align-items: center;

      .sn {
        font-weight: 500;
        font-size: 12px;
        color: #111;

        &.ukraine {
          font-weight: 700;
        }
      }

      .serial {
        font-weight: 700;
        font-size: 12px;
      }
    }

    .vibrometer-footer-year {
      background: #eee;
      font-weight: 700;
      border-radius: 15px;
      font-size: 12px;
      padding: 2px 10px;
      text-align: center;
      display: flex;
      align-items: center;
    }
  }
}

.vibrometer-footer_turkey {
  padding: 0 10px;

  .vibrometer-footer_content {
    background: rgb(114, 114, 113);
    padding: 5px 10px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;

    .id {
      font-weight: 700;
      display: flex;
      align-items: center;
      font-size: 17px;
      color: #2b95ee;
    }

    .vibrometer-footer-serial {
      background: #eee;
      border-radius: 15px;
      padding: 2px 10px;
      text-align: center;
      display: flex;
      align-items: center;

      .sn {
        font-weight: 500;
        font-size: 12px;
        color: #111;

        &.ukraine {
          font-weight: 700;
        }
      }

      .serial {
        font-weight: 700;
        font-size: 12px;
      }
    }

    .vibrometer-footer-year {
      background: #eee;
      font-weight: 700;
      border-radius: 15px;
      font-size: 12px;
      padding: 2px 10px;
      text-align: center;
      display: flex;
      align-items: center;
    }
  }
}
</style>
