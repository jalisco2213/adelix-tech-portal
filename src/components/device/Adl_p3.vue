<script setup>
import { ref, computed } from "vue";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import Switch from "../utils/SwitchCountry.vue";

let country = ref(false);
let age = ref('2024');
let serial = ref('');
let part = ref('');
let pdfPreview = ref(null);
let isModalVisible = ref(false);

const updateCountry = (value) => {
  country.value = value;
};

const hideModal = () => {
  isModalVisible.value = false;
  pdfPreview.value = null;
};

const shields = ref([{ id: 1, serial: '', part: '' }]);
const newShieldId = ref(2);

const addShield = () => {
  shields.value.push({ id: newShieldId.value++, serial: '', part: '' });
};

const removeShield = (id) => {
  shields.value = shields.value.filter(shield => shield.id !== id);
};

const exportToZIP = async () => {
  const zip = new JSZip();
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 113;
  const imgHeight = 19;
  const topMargin = 4;
  const rightMargin = 5;
  const bottomMargin = 0;
  const leftMargin = 3;

  let x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
  let y = topMargin;

  for (let i = 0; i < shields.value.length; i++) {
    const element = document.querySelectorAll('.p3-container')[i];
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


      const imageBlob = await new Promise(resolve => canvas.toBlob(resolve));
      zip.file(`ADL-DU100_${shields.value[i].serial}.png`, imageBlob);
    }
  };

  const pdfBlob = pdf.output('blob');
  zip.file(`ADL-DU100_${serial.value}.pdf`, pdfBlob);

  const cdrBlob = pdf.output('blob');
  zip.file(`ADL-DU100_${serial.value}.cdr`, cdrBlob);

  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `ADL-DU100_${serial.value}.zip`;
  link.click();
};

const showSample = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 113;
  const imgHeight = 19;
  const topMargin = 4;
  const rightMargin = 5;
  const bottomMargin = 0;
  const leftMargin = 2.5;

  let x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
  let y = topMargin;

  for (let i = 0; i < shields.value.length; i++) {
    const element = document.querySelectorAll('.p3-container')[i];
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 });
      const image = canvas.toDataURL("image/png");

      if (x < leftMargin) {
        x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
        y += imgHeight + topMargin;
      };

      if (y + imgHeight > pdf.internal.pageSize.getHeight() - bottomMargin) {
        pdf.addPage();
        x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
        y = topMargin;
      };

      pdf.addImage(image, 'PNG', x, y, imgWidth, imgHeight);
      x -= imgWidth + leftMargin;
    };
  };

  const pdfBlob = pdf.output('blob');
  pdfPreview.value = URL.createObjectURL(pdfBlob);
  isModalVisible.value = true;
};
</script>

<template>
  <h1 class="device-header">Портативный виброметр ADL-P3</h1>

  <Switch :country="country" @update:country="updateCountry" />

  <div class="device-nav">
    <div class="shields-container">
      <div v-for="(shield, index) in shields" :key="shield.id" class="shield-item">
        <div class="shield-details">
          <input type="text" v-model="shield.serial" placeholder="Серийный номер" class="input-field">
        </div>
        <button @click="removeShield(shield.id)" class="remove-btn">
          <img src="/svg/delete.svg" alt="delete" class="remove-icon">
        </button>
      </div>
      <button @click="addShield" class="add-shield-btn">+</button>
    </div>
  </div>

  <div class="p3-container" v-for="(shield, index) in shields" :key="shield.id">
    <div class="p3-content">
      <div class="p3-left">
        <img src="/logo.png" alt="logo">
      </div>

      <div class="p3-right">
        <div class="p3-mark">
          <h1 style="font-size: 17px; margin: 0; padding: 0; color: #eee; text-align: center;">ADL-P3
          </h1>
          <p v-if="!country" style="font-size: 10px; text-align: center; color: #eee; margin: 0 0 0 5px; padding: 0;">
            S/N {{ shield.serial }} &nbsp; 2024</p>
          <p v-else style="font-size: 10px; text-align: center; color: #eee; margin: 0 0 0 5px; padding: 0;">№ {{
            shield.serial }} &nbsp; 2024</p>
        </div>

        <div class="p3-info" style="position: relative;">
          <div class="p3-count" style="position: absolute; top: 0; left: 0; padding: 0 !important;">
            <p>
              00,0
            </p>
          </div>

          <div class="p3-power" style="display: flex; align-items: center; gap: 3px;">
            <img v-if="!country" style="width: 145px;" src="/p1-eng.png" alt="">
            <img v-else style="width: 145px;" src="/p1-ua.png" alt="">
          </div>
        </div>
      </div>

      <div class="p3-arrow">
        <span v-if="!country">
          ADELIX COMPANY &nbsp; PORTABLE VIBRATION METER
        </span>
        <span v-else>
          КОМПАНІЯ "ADELIX" &nbsp; ПОРТАТИВНИЙ ВІБРОМЕТР
        </span>
      </div>
    </div>
  </div>

  <div class="nav-button">
    <button @click="exportToZIP" class="nav-btn export-btn">Скачать</button>
    <button @click="showSample" class="nav-btn sample-btn">Образец</button>
  </div>

  <div v-if="isModalVisible" class="modal-overlay" @click="hideModal">
    <div class="modal-content" @click.stop>
      <span class="close-button" @click="hideModal">×</span>
      <iframe v-if="pdfPreview" :src="pdfPreview" width="100%" height="100%"></iframe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.p3-container {
  width: 427px;
  user-select: none;
  position: absolute;
  left: -500px;
}

.p3-content {
  position: relative;
  width: 427px;
  height: 75px;
  border-radius: 15px;
  background: #111;
  display: flex;
  align-items: center;
}

.p3-left {
  img {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3px auto auto 15px;
    width: 115px;
    height: 50px;
  }
}

.p3-arrow {
  position: absolute;
  bottom: 11px;
  left: 120px;
  width: 290px;
  height: 13px;
  background: rgb(43, 149, 238);
  // clip-path: polygon(0 0, 99% 0, 100% 100%, 0 100%);
  border-radius: 2px;

  span {
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0;
    margin: 0;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
  }
}

.p3-right {
  display: flex;
}

.p3-mark {
  background: rgb(114, 114, 113);
  width: 115px;
  height: 35px;
  margin: 0 4px 14px 15px;
  // clip-path: polygon(0 0, 91% 0, 100% 100%, 9% 100%);
  border-radius: 2px;
}

.p3-info {
  background: rgb(114, 114, 113);
  width: 146px;
  height: 35px;
  // clip-path: polygon(0 0, 92% 0, 100% 100%, 8% 100%);
  border-radius: 2px;
  display: flex;
  align-items: center;

  .p3-count {
    border: 1px solid #eee;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    text-align: center;
    margin: 1.5px;
    font-size: 15px;
    color: #eee;
    border-radius: 3px;

    p {
      padding: 2px;
      margin: 0;
      font-size: 10px;
    }
  }
}
</style>