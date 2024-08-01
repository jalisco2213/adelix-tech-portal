<script setup>
import { ref, computed } from "vue";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { jsPDF } from "jspdf";

let age = ref('2024');
let serial = ref('');
let pdfPreview = ref(null);
let isModalVisible = ref(false);

const shields = ref([{ id: 1, serial: '' }]);
const newShieldId = ref(2);

const addShield = () => {
  shields.value.push({ id: newShieldId.value++, serial: '' });
};

const removeShield = (id) => {
  shields.value = shields.value.filter(shield => shield.id !== id);
};

const exportToZIP = async () => {
  const zip = new JSZip();
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 65.3;
  const imgHeight = 24.7;
  const topMargin = 5;
  const rightMargin = 5;
  const bottomMargin = 0;
  const leftMargin = 3;

  let x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
  let y = topMargin;

  for (let i = 0; i < shields.value.length; i++) {
    const element = document.querySelectorAll('.M12-info')[i];
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
      zip.file(`ADL-M12_${shields.value[i].serial}.png`, imageBlob);
    }
  }

  const pdfBlob = pdf.output('blob');
  zip.file(`ADL-M12_${serial.value}.pdf`, pdfBlob);

  const cdrBlob = pdf.output('blob');
  zip.file(`ADL-M12_${serial.value}.cdr`, cdrBlob);

  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `ADL-M12_${serial.value}.zip`;
  link.click();
};

const showSample = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 65.3;
  const imgHeight = 24.7;
  const topMargin = 5;
  const rightMargin = 5;
  const bottomMargin = 0;
  const leftMargin = 2.5;

  let x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
  let y = topMargin;

  for (let i = 0; i < shields.value.length; i++) {
    const element = document.querySelectorAll('.M12-info')[i];
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
  <div class="M12-country" style="display: flex; align-items: center;">
    <input type="checkbox" v-model="country" id="country">
    <label for="country">Украина</label>
  </div>

  <div class="device-nav" style="display: flex; gap: 10px; align-items: center;">
    <div>
      <div>
        <div v-for="(shield, index) in shields" :key="shield.id"
          style="display: flex; gap: 5px; align-items: center; margin-bottom: 10px;">
          <div style="display: flex; flex-direction: column;;">
            <input type="text" v-model="shield.serial" placeholder="Серийный номер">
          </div>
          <button @click="removeShield(shield.id)"
            style="background: red; color: white; border: none; padding: 5px; cursor: pointer;">
            <img style="width: 30px; display: flex; justify-content: center; align-items: center" src="/svg/delete.svg"
              alt="delete">
          </button>
        </div>
      </div>
    </div>
  </div>

  <button @click="addShield">Добавить шильд</button>

  <div class="shields-container">
    <div class="M12-container" v-for="(shield, index) in shields" :key="shield.id">
      <div class="M12-info">
        <div class="M12-header"
          style="padding: 8px 15px 4px; display: flex; align-items: center; justify-content: space-between; gap: 5px;">
          <img v-if="!country" style="width: 75px;" src="/logo.png" alt="logo">
          <img v-else style="width: 70px;" src="/logo.png" alt="logo">


          <p v-if="!country" style=" font-size: 13px; color: #eee; margin: 0; padding: 0; font-weight: 700;">
            <span style="color: #2b95ee; font-weight: 900">ADELIX</span> PORTABLE <br> VIBRATION METER
          </p>

          <p v-else style="color: #eee; margin: 0; padding: 0; font-weight: 700;">
            <span style="font-size: 11px;">ПОРТАТИВНИЙ ВІБРОМЕТР</span> <br>
          <div class="" style="display: flex; justify-content: space-between;">
            <p style="font-size: 13px; color: rgb(43, 149, 238)">ADELIX</p>
            <p style="font-size: 13px; color: #FFED00;">UKRAINE</p>
          </div>
          </p>

          <img style="height: 30px;" src="/bluetooth.png" alt="logo">
        </div>

        <div class="M12-footer" style="padding: 5px 10px 10px;">
          <div class="M12-footer_content"
            style="background: rgb(114, 114, 113); padding: 3px 10px; border-radius: 10px; display: flex; justify-content: space-between;">
            <p style="font-weight: 700; display: flex; align-items: center; font-size: 18px; color: #2b95ee;">ADL-M12</p>

            <div class="M12-footer-serial"
              style="background: #eee; border-radius: 15px; padding: 2px 10px; text-align: center; display: flex; align-items: center;">
              <p v-if="!country" style="font-weight: 500; font-size: 12px; color: #111;">S/N</p>
              <p v-else style="font-weight: 700; font-size: 12px; color: #111;">№</p>
              &nbsp;
              <span style="font-weight: 700; font-size: 12px;">{{ shield.serial }}</span>
            </div>

            <div class="M12-footer-year"
              style="background: #eee; font-weight: 700; border-radius: 15px; font-size: 12px; padding: 2px 10px; text-align: center; display: flex; align-items: center;">
              2024
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="nav-button">
    <button @click="exportToZIP">Скачать</button>
    <button @click="showSample">Образец</button>
  </div>

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

button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }

  &:last-child {
    margin-right: 0;
  }
}

.nav-button {
  margin-top: 10px;
}

.M12-info {
  border: 1px solid #111;
  width: 286px;
  background: #111;
  border-radius: 5px;
  position: absolute;
  left: -500px;
}
</style>
