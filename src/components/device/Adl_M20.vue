<script setup>
import { ref, computed } from "vue";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import Switch from "../utils/SwitchCountry.vue";
import NavBtn from "../utils/NavBtn.vue";

let age = ref('2024');
let serial = ref('');
let part = ref('');
let pdfPreview = ref(null);
let isModalVisible = ref(false);

const updateCountry = (value) => {
  country.value = value;
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
  const imgWidth = 71;
  const imgHeight = 21;
  const topMargin = 5;
  const rightMargin = 5;
  const bottomMargin = 0;
  const leftMargin = 3;

  let x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
  let y = topMargin;

  for (let i = 0; i < shields.value.length; i++) {
    const element = document.querySelectorAll('.M20-info')[i];
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
      zip.file(`ADL-M20_${shields.value[i].serial}.png`, imageBlob);
    }
  }

  const pdfBlob = pdf.output('blob');
  zip.file(`ADL-M20_${serial.value}.pdf`, pdfBlob);

  const cdrBlob = pdf.output('blob');
  zip.file(`ADL-M20_${serial.value}.cdr`, cdrBlob);

  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `ADL-M20_${serial.value}.zip`;
  link.click();
};

const showSample = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 71;
  const imgHeight = 21;
  const topMargin = 5;
  const rightMargin = 5;
  const bottomMargin = 0;
  const leftMargin = 2.5;

  let x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
  let y = topMargin;

  for (let i = 0; i < shields.value.length; i++) {
    const element = document.querySelectorAll('.M20-info')[i];
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

  const pdfBlob = pdf.output('blob');
  pdfPreview.value = URL.createObjectURL(pdfBlob);
  isModalVisible.value = true;
};

const hideModal = () => {
  isModalVisible.value = false;
  pdfPreview.value = null;
};

let country = ref(false);
</script>

<template>
  <h1 class="device-header">Портативный виброметр <br> ADL-M20</h1>

  <Switch :country="country" @update:country="updateCountry" />

  <div class="device-nav">
    <div class="shields-container">
      <div v-for="(shield, index) in shields" :key="shield.id" class="shield-item">
        <div class="shield-details">
          <input type="text" v-model="shield.serial" placeholder="Серийный номер" class="input-field">
          <input type="text" v-model="shield.part" placeholder="Номер партии" class="input-field">
        </div>
        <button @click="removeShield(shield.id)" class="remove-btn">
          <img src="/svg/delete.svg" alt="delete" class="remove-icon">
        </button>
      </div>
      <button @click="addShield" class="add-shield-btn">+</button>
    </div>
  </div>

  <div class="shields-container">
    <div class="M20-container" v-for="(shield, index) in shields" :key="shield.id">
      <div class="M20-info">
        <div class="M20-header"
          style="padding: 8px 10px 10px; margin-bottom: 3px; border-bottom: 2px solid #2b95ee; display: flex; align-items: center; justify-content: space-between; gap: 5px;">
          <img v-if="!country" style="width: 75px;" src="/logo.png" alt="logo">
          <img v-else style="width: 75px;" src="/logo.png" alt="logo">


          <p v-if="!country"
            style="color: #eee; margin: 0; font-size: 13px; padding: 0; font-weight: 700; text-align: center;">
            PORTABLE VIBRATION METER <br>
            <span style="font-size: 9px;"><span style="color: rgb(43, 149, 238); font-size: 11px">ADELIX</span> with
              temperature measurement function</span>
          </p>

          <p v-else style="color: #eee; margin: 0; font-size: 13px; padding: 0; font-weight: 700; text-align: center;">
            ПОРТАТИВНИЙ ВІБРОМЕТР<br>
            <span style="font-size: 9px;"><span style="color: rgb(43, 149, 238); font-size: 11px">ADELIX</span> з
              функцією вимірювання температури</span>
          </p>


          <img style="height: 30px;" src="/bluetooth.png" alt="logo">
        </div>

        <div class="M20-footer"
          style="padding: 5px 7px 10px; display: flex; justify-content: space-between; align-items: center;">
          <div class="M20-left" style="border-right: 2px solid #eee;">
            <div class="M20-left_header"
              style="display: flex; margin-bottom: 2px; align-items: center; padding-right: 10px;">
              <p style="font-weight: 900; font-size: 15px; color: #eee">ADL-M20</p> &nbsp; <p
                style="font-size: 12px; color: #eee;">S/N {{ shield.serial }}</p>
            </div>

            <div class="M20-left_footer" style="display: flex; align-items: center; padding-right: 10px;">
              <p style=" font-size: 11px; color: #eee">Art/N {{ shield.part }} &nbsp; Date: 2024</p>
            </div>
          </div>

          <div class="M20-right" style="display: flex; align-items: center; height: 100%;">
            <img style="width: 200px; display: flex; align-items: center;" src="/m20-eng.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>

  <NavBtn :exportToZIP="exportToZIP" :showSample="showSample" />

  <div v-if="isModalVisible" class="modal-overlay" @click="hideModal">
    <div class="modal-content" @click.stop>
      <span class="close-button" @click="hideModal">×</span>
      <iframe v-if="pdfPreview" :src="pdfPreview" width="100%" height="100%"></iframe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.generator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  max-width: 600px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.M20-info {
  border: 1px solid #111;
  width: 410px;
  background: #161616;
  border-radius: 10px;
  position: absolute;
  left: -500px;
}
</style>
