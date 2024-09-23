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
const remainingTime = ref(0);

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
        const canvas = await html2canvas(element, { scale: 2 });
        const image = canvas.toDataURL("image/png");

        let position = findFreeSpace(device.imgWidth, device.imgHeight, pageWidth, pageHeight, margin, padding, positions);

        if (!position) {
          pdf.addPage();
          positions = [];
          position = { x: margin, y: margin };
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
        return { x, y };
      }
    }
  }
  return null;
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
  <div class="modal-loader" v-if="isLoading">
    <div class="modal-info">
      <ModalLoader style="margin: auto; display: flex; justify-content:center;"/>
      <h2>Генерация PDF...</h2>
      <span class="modal-loader-btn"></span>
    </div>
  </div>


  <div class="container">
    <div class="select-wrapper">
      <DeviceOption
        v-for="device in devices"
        :key="device.id"
        :device="device"
        @showModal="showShieldsModal"
        @hideModal="hideShieldsModal"
        @changeQuantity="handleQuantityChange"
        :isClosing="isClosing"
      />
    </div>

    <DeviceDisplay
      v-for="device in selectedDevices"
      :key="device.id"
      :device="device"
      @updateData="handleUpdateData"
    />

    <button v-if="isCheck"
            @click="showSample"
            class="nav-btn sample-btn"
            :disabled="isLoading">
      <span v-if="isLoading" class="loader-btn"></span>
      <span v-else>Образец + печать</span>
    </button>

    <ModalReview
      :isVisible="isModalVisible"
      :pdfPreview="pdfPreview"
      @closeModal="hideModal"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.modal-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .modal-info {
    padding: 50px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

    .modal-loader-btn {
      border: 2px solid transparent;
      border-top: 2px solid #111;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      display: inline-block;
      margin-right: 5px;
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

.select-wrapper {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
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

.nav-btn {
  margin-top: 20px;
}
</style>
