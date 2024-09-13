<script setup>
import JSZip from "jszip";
import {jsPDF} from "jspdf";
import html2canvas from 'html2canvas';
import {ref, computed, markRaw} from 'vue';
import AdlDu from "@/components/device/AdlDu.vue";

const imgData = ref({});
const shields = ref([{id: 1, serial: '', part: ''}]);
let pdfPreview = ref(null);
let isModalVisible = ref(false);
let isCheck = ref(false);

const devices = ref([
  {id: 'ADL-DU100', label: 'PORTABLE DYNAMIC \n HARDNESS TESTER', quantity: 0, selected: false, className: 'adl-du100'},
  {id: 'ADL-DU110', label: 'PORTABLE UNIVERSAL \n HARDNESS TESTER', quantity: 0, selected: false, className: 'adl-du110'},
  {id: 'ADL-DU120 mini', label: 'PORTABLE UNIVERSAL \n HARDNESS TESTER', quantity: 0, selected: false, className: 'adl-du120'},
]);

const handleUpdateData = (data) => {
  imgData.value = data;
};

const handleQuantityChange = (deviceId, quantity) => {
  const device = devices.value.find(d => d.id === deviceId);
  if (device && device.selected) {
    device.quantity = parseInt(quantity, 10) || 0;
  }

  isCheck.value = device.quantity > 0;

};

const selectedDevices = computed(() => {
  return devices.value.filter(device => device.selected && device.quantity > 0);
});

const showSample = async () => {
  const pdf = new jsPDF('l', 'mm', 'a3');
  const topMargin = 3;
  const rightMargin = 3;
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

        <input
          v-if="device.selected"
          type="number"
          min="0"
          :placeholder="'Количество ' + device.label"
          v-model.number="device.quantity"
          @input="handleQuantityChange(device.id, device.quantity)"
        />
      </div>

    </div>

    <div class="device-display" ref="deviceDisplay">
      <template v-for="device in selectedDevices" :key="device.id">
        <component
          v-for="index in device.quantity"
          :key="`${device.id}-${index}`"
          :is="AdlDu"
          :id="device.id"
          :label="device.label"
          :class="device.className"
          @updateData="handleUpdateData"
        />
      </template>
    </div>

    <button v-if="isCheck" @click="showSample" class="nav-btn sample-btn">Образец + печать</button>
  </div>

  <div v-if="isModalVisible" class="modal-overlay" @click="hideModal">
    <div class="modal-content" @click.stop>
      <span class="close-button" @click="hideModal">×</span>
      <iframe v-if="pdfPreview" :src="pdfPreview" width="100%" height="100%"></iframe>
    </div>
  </div>
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
</style>
