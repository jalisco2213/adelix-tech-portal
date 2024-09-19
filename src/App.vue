<script setup>
import JSZip from "jszip";
import {jsPDF} from "jspdf";
import html2canvas from 'html2canvas';
import {ref, computed} from 'vue';
import AdlDu from "@/components/device/AdlDu.vue";
import ModalReview from "@/components/ModalReview.vue";
import SwitchCountry from "@/components/utils/SwitchCountry.vue";
import devicesData from './data/devices.json'

const devices = ref(devicesData);
const imgData = ref({});
let pdfPreview = ref(null);
let isModalVisible = ref(false);
let isCheck = ref(false);
const isClosing = ref(false);

const handleUpdateData = (data) => {
  imgData.value = data;
};

const handleQuantityChange = (deviceId, quantity) => {
  const device = devices.value.find(d => d.id === deviceId);
  if (device) {
    device.quantity = parseInt(quantity, 10) || 0;
    isCheck.value = devices.value.some(d => d.quantity > 0);

    if (device.serialNumbers.length < device.quantity) {
      for (let i = device.serialNumbers.length; i < device.quantity; i++) {
        device.serialNumbers.push('');
      }
    } else {
      device.serialNumbers = device.serialNumbers.slice(0, device.quantity);
    }
  }

  if (device.isUkrainian.length < device.quantity) {
    for (let i = device.isUkrainian.length; i < device.quantity; i++) {
      device.isUkrainian.push(false);
    }
  } else {
    device.isUkrainian = device.isUkrainian.slice(0, device.quantity);
  }

};

const selectedDevices = computed(() => {
  return devices.value.filter(device => device.selected && device.quantity > 0);
});

const showSample = async () => {
  const pdf = new jsPDF('l', 'mm', 'a3');
  const topMargin = 1;
  const rightMargin = 1;
  const bottomMargin = 0;
  const leftMargin = 1;

  let x = pdf.internal.pageSize.getWidth() - imgData.value.imgWidth - rightMargin;
  let y = topMargin;

  for (let device of selectedDevices.value) {
    for (let i = 0; i < device.quantity; i++) {
      const className = device.className;
      const element = document.querySelectorAll(`.${className}`)[i];

      if (element) {
        const canvas = await html2canvas(element, {scale: 2});
        const image = canvas.toDataURL("image/png");

        if (x < leftMargin) {
          x = pdf.internal.pageSize.getWidth() - imgData.value.imgWidth - rightMargin;
          y += imgData.value.imgHeight + topMargin;
        }

        if (y + imgData.value.imgHeight > pdf.internal.pageSize.getHeight() - bottomMargin) {
          pdf.addPage();
          x = pdf.internal.pageSize.getWidth() - imgData.value.imgWidth - rightMargin;
          y = topMargin;
        }

        pdf.addImage(image, 'PNG', x, y, imgData.value.imgWidth, imgData.value.imgHeight);
        x -= imgData.value.imgWidth + leftMargin;
      }
    }
  }

  const pdfBlob = pdf.output('blob');
  pdfPreview.value = URL.createObjectURL(pdfBlob);
  isModalVisible.value = true;
};

const hideModal = () => {
  isModalVisible.value = false;
  pdfPreview.value = null;
};

const showShieldsModal = (deviceId) => {
  const device = devices.value.find(d => d.id === deviceId);
  if (device) {
    device.showShieldsModal = true;
  }
};

const hideShieldsModal = (deviceId) => {
  isClosing.value = true;
  setTimeout(() => {
    const device = devices.value.find(d => d.id === deviceId);
    if (device) {
      device.showShieldsModal = false;
      isClosing.value = false;
    }
  }, 200);
};
</script>

<template>
  <div class="container">

    <div class="select-wrapper">
      <div v-for="device in devices" :key="device.id" class="device-option">
        <input
          type="checkbox"
          :id="device.id"
          v-model="device.selected"
        />
        <label :for="device.id">{{ device.id }}</label>

        <button v-if="device.selected" @click="showShieldsModal(device.id)" class="nav-btn shields-btn">
          Настроить
        </button>

        <div v-if="device.showShieldsModal" class="modal-overlay" @click="hideShieldsModal(device.id)">
          <div class="modal-content" @click.stop :class="{ closing: isClosing }">
            <div style="overflow-y: auto; max-height: 100%; padding: 5px">
            <span style="position: absolute; cursor: pointer; top: 0; right: 40px" class="close-button"
                  @click="hideShieldsModal(device.id)">×</span>
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <p>Количество шильдов для <b>{{ device.id }}</b>:</p>
                <input
                  class="pointerShields"
                  type="number"
                  min="0"
                  :placeholder="'Количество ' + device.label"
                  v-model.number="device.quantity"
                  @input="handleQuantityChange(device.id, device.quantity)"
                />
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px">
                <div v-for="(serial, index) in device.quantity" :key="index">

                  <div style="display: flex; align-items: center; gap: 5px">
                    <label :for="`serial-${device.id}-${index}`">S/N {{ index + 1 }}:</label>

                    <input
                      class="shields-serial"
                      type="text"
                      :id="`serial-${device.id}-${index}`"
                      v-model="device.serialNumbers[index]"
                      placeholder="Enter serial number"
                    />

                    <SwitchCountry v-model:country="device.isUkrainian[index]"/>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="device-display" ref="deviceDisplay">
      <template v-for="device in selectedDevices" :key="device.id">
        <component
          v-for="(serial, index) in device.serialNumbers"
          :key="`${device.id}-${index}`"
          :is="AdlDu"
          :id="device.id"
          :label="device.label"
          :labelUkrainian="device.labelUkrainian"
          :serial="serial"
          :serialType="device.serialType"
          :isUkrainian="device.isUkrainian[index]"
          :class="device.className"
          @updateData="handleUpdateData"
        />
      </template>

    </div>

    <button v-if="isCheck" @click="showSample" class="nav-btn sample-btn">Образец + печать</button>
  </div>

  <ModalReview
    :isVisible="isModalVisible"
    :pdfPreview="pdfPreview"
    @closeModal="hideModal"
  />

</template>


<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.select-wrapper {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.device-option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.device-option input[type="checkbox"] {
  margin-right: 10px;
}

.device-option input[type="number"] {
  margin-left: 10px;
  width: 60px;
}

.device-display {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.pointerShields {
  background: inherit;
  border: none !important;
  padding: 0;
  margin-left: 0 !important;
  font-size: 20px;
}

.modal-overlay {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  transition: opacity 0.3s ease-in-out;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  max-height: 50%;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

  &.closing {
    animation: slide-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  @keyframes slide-top {
    0% {
      transform: translateY(50px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes slide-bottom {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(200px);
    }
  }

  .shields-serial {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    font-size: 16px;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
      outline: none;
    }
  }
}


</style>
