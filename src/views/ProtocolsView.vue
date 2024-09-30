<script setup lang="ts">
import Navigation from "@/components/Navigation.vue";
import {Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, ImageRun} from "docx";
import {saveAs} from "file-saver";

const getImageBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
};

const downloadDocx = async () => {
  const imageUrl = "https://i.ibb.co/5WPrpq0/ukrintech-Logo.png";
  const imageBase64 = await getImageBase64(imageUrl);

  const doc = new Document({
    sections: [
      {
        children: [
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new ImageRun({
                            data: imageBase64,
                            transformation: {
                              width: 125,
                              height: 125,
                            },
                          }),
                        ],
                        alignment: "center",
                      }),
                    ],
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                  }),

                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "61036, м.Харків, вул.Ковтуна",
                            size: 16,
                            font: "Segoe UI",
                          }),
                        ],
                        alignment: "center",
                        spacing: { after: 0 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'буд.50, корпус літ "A-5"',
                            size: 16,
                            font: "Segoe UI",
                          }),
                        ],
                        alignment: "center",
                        spacing: { after: 0 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Тел.: +38 (050) 499-09-04",
                            size: 16,
                            font: "Segoe UI",
                          }),
                        ],
                        alignment: "center",
                        spacing: { after: 0 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "infotd@ukrintech.com.ua",
                            size: 16,
                            font: "Segoe UI",
                          }),
                        ],
                        alignment: "center",
                        spacing: { after: 0 },
                      }),
                    ],
                    width: {
                      size: 35,
                      type: WidthType.PERCENTAGE,
                    },
                  }),

                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "ТОВ \"ТОРГІВЕЛЬНИЙ ДІМ \"УКРІНТЕХ\"",
                            bold: true,
                            size: 16,
                            font: "Segoe UI",
                          }),
                        ],
                        alignment: "end",
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                            size: 16,
                            font: "Segoe UI",
                          }),
                        ],
                        alignment: "end",
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Код ЄДРПОУ: 43630123",
                            size: 16,
                            font: "Segoe UI",
                          }),
                        ],
                        alignment: "end",
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Тел.: +38 (050) 499-09-04",
                            size: 16,
                            font: "Segoe UI",
                          }),
                        ],
                        alignment: "end",
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "info@ukrintech.com.ua",
                            size: 16,
                            font: "Segoe UI",
                          }),
                        ],
                        alignment: "end",
                      }),
                    ],
                    width: {
                      size: 35,
                      type: WidthType.PERCENTAGE,
                    },
                  }),
                ],
              }),
            ],
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "protocol.docx");
};
</script>

<template>
  <div class="wrapper">
    <Navigation/>
    <div class="container">
      <button @click="downloadDocx">Скачать документ</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
