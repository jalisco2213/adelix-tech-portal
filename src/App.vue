
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

    <button v-if="isCheck" @click="showSample" class="nav-btn sample-btn">
      Образец + печать
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

.select-wrapper {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.nav-btn {
  margin-top: 20px;
}
</style>
