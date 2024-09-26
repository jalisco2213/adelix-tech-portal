<script setup>
import {ref, computed} from 'vue';
import {jsPDF} from "jspdf";
import html2canvas from 'html2canvas';
import DeviceOption from "@/components/DeviceOption.vue";
import DeviceDisplay from "@/components/DeviceDisplay.vue";
import ModalReview from "@/components/ModalReview.vue";
import devicesData from './data/devices.json';
import ModalLoader from "@/components/Utils/ModalLoader.vue";

const devices = ref(devicesData);
const imgData = ref({});
let pdfPreview = ref(null);
let isModalVisible = ref(false);
let isCheck = ref(false);
const isClosing = ref(false);
let isLoading = ref(false);

const handleUpdateData = (data) => {
  imgData.value = data;
};

const handleQuantityChange = (deviceId, quantity) => {
  const device = devices.value.find(d => d.id === deviceId);
  if (device) {
    device.quantity = parseInt(quantity, 10) || 0;
    isCheck.value = devices.value.some(d => d.quantity > 0 && device);

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
  isLoading.value = true;

  const pdf = new jsPDF('l', 'mm', 'a3');
  const margin = 1;
  const padding = 1;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  let positions = [];

  for (let device of selectedDevices.value) {
    for (let i = 0; i < device.quantity; i++) {
      const className = device.className;
      const element = document.querySelectorAll(`.${className}`)[i];

      if (element) {
        const canvas = await html2canvas(element, {scale: 2});
        const image = canvas.toDataURL("image/png");

        let position = findFreeSpace(device.imgWidth, device.imgHeight, pageWidth, pageHeight, margin, padding, positions);

        if (!position) {
          pdf.addPage();
          positions = [];
          position = {x: margin, y: margin};
        }

        pdf.addImage(image, 'PNG', position.x, position.y, device.imgWidth, device.imgHeight);

        positions.push({
          x: position.x,
          y: position.y,
          width: device.imgWidth,
          height: device.imgHeight
        });
      }
    }
  }

  const pdfBlob = pdf.output('blob');
  pdfPreview.value = URL.createObjectURL(pdfBlob);
  isModalVisible.value = true;
  isLoading.value = false;
};

const findFreeSpace = (imgWidth, imgHeight, pageWidth, pageHeight, margin, padding, positions) => {
  for (let y = margin; y <= pageHeight - imgHeight - margin; y += padding) {
    for (let x = margin; x <= pageWidth - imgWidth - margin; x += padding) {
      const overlapping = positions.some(pos =>
        !(x + imgWidth + padding <= pos.x || x >= pos.x + pos.width + padding ||
          y + imgHeight + padding <= pos.y || y >= pos.y + pos.height + padding)
      );
      if (!overlapping) {
        return {x, y};
      }
    }
  }
  return null;
};

const groupedDevices = computed(() => {
  return devices.value.reduce((acc, device) => {
    if (!acc[device.type]) {
      acc[device.type] = [];
    }
    acc[device.type].push(device);
    return acc;
  }, {});
});

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
  <div class="modal-loader" v-if="isLoading">
    <div class="modal-info">
      <ModalLoader style="margin: auto; display: flex; justify-content:center;"/>
      <h2>Генерация PDF...</h2>
      <span class="modal-loader-btn"></span>
    </div>
  </div>


  <div class="container">
    <div>
      <div class="select-wrapper">
        <template v-for="(group, type) in groupedDevices">
          <div class="select-item">
            <h3>{{ type === 'hardness' ? 'Твердомеры' : type === 'thickness' ? 'Толщиномеры' : 'Виброметры' }}:</h3>

            <div style="display: flex; flex-wrap: wrap; gap: 5px">
              <DeviceOption
                v-for="device in group"
                :key="device.id"
                :device="device"
                @showModal="showShieldsModal"
                @hideModal="hideShieldsModal"
                @changeQuantity="handleQuantityChange"
                :isClosing="isClosing"
              />
            </div>
          </div>
        </template>
      </div>

      <button v-if="isCheck"
              @click="showSample"
              class="nav-btn sample-btn"
              :disabled="isLoading">
        <span v-if="isLoading" class="loader-btn"></span>
        <span v-else>Образец + печать</span>
      </button>

    </div>

    <DeviceDisplay
      v-for="device in selectedDevices"
      :key="device.id"
      :device="device"
      @updateData="handleUpdateData"
    />

    <ModalReview
      :isVisible="isModalVisible"
      :pdfPreview="pdfPreview"
      @closeModal="hideModal"
    />
  </div>
</template>

<style lang="scss" scoped>
$primary-color: #3b82f6;
$secondary-color: #f3f4f6;
$accent-color: #10b981;
$text-color: #374151;
$border-radius: 10px;
$box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  min-height: 100vh;

  .select-wrapper {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 20px;
    flex-wrap: wrap;
    background-color: $secondary-color;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    margin-bottom: 20px;

    h3 {
      font-size: 1.75em;
      margin-bottom: 15px;
      color: $text-color;
      border-bottom: 3px solid $primary-color;
      padding-bottom: 8px;
      font-weight: 600;
    }

    .select-item {
      max-width: 529px;
      padding: 15px;
      margin: 10px 0;
      border-radius: $border-radius;
      background: #eeeeee;
      box-shadow: $box-shadow;
      border: 1px solid #cccccc;

      .device-option {
        border: 1px solid #cccccc;
        display: flex;
        align-items: center;
        padding: 15px;
        background-color: #fff;
        border-radius: $border-radius;
        margin-bottom: 12px;
        transition: background-color 0.3s, box-shadow 0.3s;

        &:hover {
          background-color: lighten($primary-color, 50%);
          box-shadow: $box-shadow;
        }

        button {
          background-color: $primary-color;
          color: #fff;
          border: none;
          border-radius: $border-radius;
          padding: 10px 20px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;

          &:hover {
            background-color: darken($primary-color, 10%);
            transform: translateY(-2px);
          }
        }
      }
    }
  }

  .nav-btn {
    margin-top: 20px;
    padding: 12px 20px;
    background-color: $accent-color;
    color: #fff;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
      background-color: darken($accent-color, 10%);
      transform: translateY(-2px);
    }
  }


  @media (max-width: 768px) {
    .select-wrapper {
      padding: 15px;

      h3 {
        font-size: 1.5em;
      }

      .device-option {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }
}

.modal-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .modal-info {
    padding: 40px;
    background: #fff;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

    h2 {
      font-size: 1.5em;
      color: $text-color;
    }

    .modal-loader-btn {
      border: 2px solid transparent;
      border-top: 2px solid $primary-color;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes slide-top {
  0% {
    transform: translateY(50px);
  }
  100% {
    transform: translateY(0);
  }
}

.loader-btn {
  border: 2px solid transparent;
  border-top: 2px solid #eeeeee;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 5px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
