
<script setup>
import { ref, computed } from 'vue';
import {jsPDF} from "jspdf";
import html2canvas from 'html2canvas';
import DeviceOption from "@/components/DeviceOption.vue";
import DeviceDisplay from "@/components/DeviceDisplay.vue";
import ModalReview from "@/components/ModalReview.vue";
import devicesData from './data/devices.json';

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

console.log(devices.imgWidth)

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
  const topMargin = 1;
  const rightMargin = 1;
  const bottomMargin = 0;
  const leftMargin = 1;

  let x, y;

  for (let device of selectedDevices.value) {
    const imgWidth = device.imgWidth;
    const imgHeight = device.imgHeight;

    x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
    y = topMargin;

    for (let i = 0; i < device.quantity; i++) {
      const className = device.className;
      const element = document.querySelectorAll(`.${className}`)[i];

      if (element) {
        const canvas = await html2canvas(element, { scale: 2 });
        const image = canvas.toDataURL("image/png");

        if (x < leftMargin) {
          x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
          y += imgHeight + topMargin;
        }

        if (y + imgHeight > pdf.internal.pageSize.getHeight() - bottomMargin) {
          pdf.addPage();
          x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
          y = topMargin;
        }

        pdf.addImage(image, 'PNG', x, y, imgWidth, imgHeight);
        x -= imgWidth + leftMargin;
      }
    }
  }

  const pdfBlob = pdf.output('blob');
  pdfPreview.value = URL.createObjectURL(pdfBlob);
  isModalVisible.value = true;
  isLoading.value = false;
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
      <span v-if="isLoading" class="loader"></span>
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

.loader {
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

.select-wrapper {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.nav-btn {
  margin-top: 20px;
}
</style>
