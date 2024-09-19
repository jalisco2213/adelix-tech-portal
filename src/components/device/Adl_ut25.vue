<script setup>
import { ref, computed } from "vue";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import Switch from "../SwitchCountry.vue";
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
  const imgWidth = 39.5;
  const imgHeight = 55;
  const topMargin = 5;
  const rightMargin = 5;
  const bottomMargin = 0;
  const leftMargin = 3;

  let x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
  let y = topMargin;

  for (let i = 0; i < shields.value.length; i++) {
    const element = document.querySelectorAll('.UT25-info')[i];
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
      zip.file(`ADL-UT25_${shields.value[i].serial}.png`, imageBlob);
    }
  }

  const pdfBlob = pdf.output('blob');
  zip.file(`ADL-UT25_${serial.value}.pdf`, pdfBlob);

  const cdrBlob = pdf.output('blob');
  zip.file(`ADL-UT25_${serial.value}.cdr`, cdrBlob);

  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `ADL-UT25_${serial.value}.zip`;
  link.click();
};

const showSample = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 39.5;
  const imgHeight = 55;
  const topMargin = 5;
  const rightMargin = 5;
  const bottomMargin = 0;
  const leftMargin = 2.5;

  let x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
  let y = topMargin;

  for (let i = 0; i < shields.value.length; i++) {
    const element = document.querySelectorAll('.UT25-info')[i];
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
  <h1 class="device-header">Ультразвуковой толщиномер <br> ADL-UT25</h1>

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
    <div class="UT25-container" v-for="(shield, index) in shields" :key="shield.id">
      <div class="UT25-info">
        <div class="UT25-content">
          <div class="UT25-header">
            <p v-if="!country" style="padding-top: 10px; font-size: 13px; font-weight: bold;"> ULTRASONIC <br>
              THICKNESS GAUGE</p>
            <p v-else style="padding-top: 10px; font-size: 13px; font-weight: bold;">УЛЬТРАЗВУКОВИЙ <br> ТОВЩИНОМЕР
            </p>

            <h1 v-if="!country" style="padding: 7px 0 10px; line-height: 1;">
              <span style="font-weight: 900; letter-spacing: 1px; color: rgb(43, 149, 238);">ADELIX</span>
              <br>
              <span style="font-size: 25px; letter-spacing: 1px; font-weight: 800;">ADL-UT25</span>
            </h1>

            <h1 v-else style="padding: 7px 0 10px; line-height: .8;">
              <span style="font-size: 25px; font-weight: 500; letter-spacing: 1px; color: rgb(43, 149, 238);">ADELIX </span>
              
              <span style="font-size: 25px; font-weight: 500; color: rgb(255, 237, 0);">УКРАЇНА</span>
              <br>
              <span style="font-size: 25px; letter-spacing: 1px; font-weight: 800;">ADL-UT25</span>
            </h1>
          </div>

          <div class="UT25-center">
            <div class="UT25-main">
              <div>
                <label v-if="!country" for="serial">S/N:</label>
                <label v-else for="serial">Сер №:</label>

                <input style="width: 120px; font-size: 17px;" v-model="shield.serial" type="text" id="serial">
              </div>
              <div>
                <label v-if="!country" for="age">Date:</label>
                <label v-else for="age">Виг:</label>

                <input type="text" style="font-size: 17px; width: 100%" id="age" v-model="age">
              </div>
            </div>

            <div style="margin-top: 5px;" class="UT25-part">
              <label v-if="!country" for="age">Art/N:</label>
              <label v-else for="age">Парт №:</label>

              <input type="text" style="font-size: 17px; width: 100%; margin-bottom: 8px;" id="part"
                v-model="shield.part">
            </div>
          </div>

          <div class="UT25-footer"
            style="display: flex; gap: 10px; justify-content: space-between; align-items: center;">
            <img style="width: 110px; height: 45px; " src="/logo.png" alt="logo">
            <img style="width: 50px" src="/qrcode.png" alt="qr">
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

.UT25-container {
  border: 1px solid #111;
  width: 270px;
  position: absolute;
  left: -500px;
}

.UT25-content {
  padding: 7px;
}

.UT25-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto auto;
  border: 1px solid #111;

  .UT25-header {

    h1,
    p {
      padding: 0;
      margin: 0;
    }
  }
}

h1,
p {
  color: #eee;
}

label {
  font-size: 12px;
}

.UT25-header {
  text-align: center;
  background: #111;
}

.UT25-footer {
  background: #111;
  padding: 10px;
}

.UT25-center {
  background: rgb(43, 149, 238);
  padding: 15px;

  input {
    border-radius: 0;
    border: 0;
    padding: 5px 0;
  }

  .UT25-main {
    display: flex;
    gap: 8px;
    justify-content: space-between;
  }
}
</style>
