<script setup>
import { ref, computed } from "vue";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { jsPDF } from "jspdf";

let age = ref('2024');
let serial = ref('');
let part = ref('');
let pdfPreview = ref(null);
let isEditing = ref(true);
let isModalVisible = ref(false);

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
  const topMargin = 3;
  const rightMargin = 3;
  const bottomMargin = 0;
  const leftMargin = 3;

  let x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
  let y = topMargin;

  for (let i = 0; i < shields.value.length; i++) {
    const element = document.querySelectorAll('.du110-info')[i];
    if (element) {
      const canvas = await html2canvas(element);
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
      zip.file(`ADL-DU110_${shields.value[i].serial}.png`, imageBlob);
    }
  }

  const pdfBlob = pdf.output('blob');
  zip.file(`ADL-DU110_${serial.value}.pdf`, pdfBlob);

  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `ADL-DU110_${serial.value}.zip`;
  link.click();
};

const showSample = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 39.5;
  const imgHeight = 55;
  const topMargin = 3;
  const rightMargin = 3;
  const bottomMargin = 0;
  const leftMargin = 2.5;

  let x = pdf.internal.pageSize.getWidth() - imgWidth - rightMargin;
  let y = topMargin;

  for (let i = 0; i < shields.value.length; i++) {
    const element = document.querySelectorAll('.du110-info')[i];
    if (element) {
      const canvas = await html2canvas(element);
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

const toggleEditing = () => {
  isEditing.value = !isEditing.value;
};
</script>

<template>
  <div class="device-nav" style="display: flex; gap: 10px; align-items: center;">
    <div>
      <div>
        <div v-for="(shield, index) in shields" :key="shield.id"
          style="display: flex; gap: 5px; align-items: center; margin-bottom: 10px;">
          <div style="display: flex; flex-direction: column;;">
            <input type="text" v-model="shield.serial" placeholder="Серийный номер">
            <input type="text" v-model="shield.part" placeholder="Номер партии">
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
    <div class="du110-container" v-for="(shield, index) in shields" :key="shield.id">
      <div class="du110-info">
        <div class="du110-content">
          <div class="du110-header">
            <p style="padding-top: 10px; font-size: 13px; font-weight: bold;">УНІВЕРСАЛЬНИЙ ТВЕРДОМІР</p>
            <h1 style="padding: 7px 0 10px; line-height: .9;">
              <span style="color: rgb(188, 188, 214);">ADELIX</span> <br>
              <span style="font-size: 25px;">ADL-DU110</span>
            </h1>
          </div>

          <div class="du110-center">
            <div class="du110-main">
              <div>
                <label for="serial">Сер №:</label>
                <input style="width: 120px; font-size: 16px;" v-model="shield.serial" type="text" id="serial">
              </div>
              <div>
                <label for="age">Вип:</label>
                <input type="text" style="font-size: 16px; width: 100%" id="age" v-model="age">
              </div>
            </div>

            <div style="margin-top: 5px;" class="du110-part">
              <label for="age">Парт №:</label>
              <input type="text" style="font-size: 16px; width: 100%" id="part" v-model="shield.part">
            </div>
          </div>

          <div class="du110-footer"
            style="display: flex; gap: 10px; justify-content: space-between; align-items: center;">
            <img style="width: 110px; height: 45px;" src="/logo.png" alt="logo">
            <img style="width: 50px" src="/qrcode.png" alt="qr">
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

.du110-container {
  border: 1px solid #111;
  width: 220px;
  position: absolute;
  left: -500px;
}

.du110-content {
  padding: 7px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  width: 90%;
  height: 90%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.close-button {
  position: absolute;
  top: -25px;
  right: -25px;
  background: none;
  border: none;
  font-size: 50px;
  cursor: pointer;
  transition: .1s ease-in-out;

  &:hover {
    transition: .1s ease-in-out;
    color: #393939;
  }
}

.du110-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto auto;
  border: 1px solid #111;

  .du110-header {

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

.du110-header {
  text-align: center;
  background: #111;
}

.du110-footer {
  background: #111;
  padding: 10px;
}

.du110-center {
  background: rgb(188, 188, 214);
  padding: 15px;

  input {
    border-radius: 0;
    border: 0;
  }

  .du110-main {
    display: flex;
    gap: 5px;
    justify-content: space-between;
  }
}
</style>
