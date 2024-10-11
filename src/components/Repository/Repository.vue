<template>
  <div class="folder-view">
    <h1>Папки</h1>
    <div class="folders">
      <div class="folder" v-for="folder in folders" :key="folder.id">
        <h2 @click="toggleFolder(folder)">
          <img :src="folder.isOpen ? '/folder/folderon.svg' : '/folder/folderoff.svg'" alt="Folder icon" class="folder-icon" />
          {{ folder.name }}
        </h2>
        <div v-if="folder.isOpen" class="files">
          <div class="file" v-for="file in folder.files" :key="file.id">
            <img src="/folder/file.svg" alt="File icon" class="file-icon" />
            {{ file.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../ts/client/supabase';

const folders = ref([]);

const fetchFolders = async () => {
  try {
    const { data, error } = await supabase.storage.from('storage_adelix').list('');

    if (error) throw error;

    const folderPromises = data.map(async (folder) => {
      const { data: files, error: filesError } = await supabase.storage.from('storage_adelix').list(`${folder.name}/`);
      if (filesError) throw filesError;

      return {
        id: folder.name,
        name: folder.name,
        files: files.map(file => ({
          id: file.name,
          name: file.name
        })),
        isOpen: false // состояние для сворачивания/разворачивания
      };
    });

    folders.value = await Promise.all(folderPromises);
  } catch (error) {
    console.error('Error fetching folders:', error);
  }
};

const toggleFolder = (folder) => {
  folder.isOpen = !folder.isOpen; // переключение состояния
};

onMounted(() => {
  fetchFolders();
});
</script>

<style scoped>
.folder-view {
  padding: 20px;
  background-color: #f3f4f6; /* светлый фон */
  border-radius: 10px;
}

.folders {
  display: flex;
  flex-direction: column; /* вертикальное расположение */
}

.folder {
  background: #ffffff; /* белый фон папки */
  border: 1px solid #d1d5db; /* светлая граница */
  margin: 10px 0; /* верх и низ для отступа между папками */
  padding: 16px; /* немного больше отступ */
  border-radius: 8px; /* закругленные углы */
  cursor: pointer; /* курсор указывает на кликабельность */
  transition: background-color 0.3s, box-shadow 0.3s; /* анимация фона и тени */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* легкая тень */
}

.folder:hover {
  background-color: #e5e7eb; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
}

.folder-icon {
  width: 20px; /* ширина иконки папки */
  height: 20px; /* высота иконки папки */
  margin-right: 8px; /* отступ справа от иконки */
  vertical-align: middle; /* выравнивание по центру */
}

.files {
  padding-left: 20px; 
}

.file {
  padding: 8px; 
  border-radius: 4px; 
  display: flex; /* чтобы иконка и текст были на одной линии */
  align-items: center; /* вертикальное выравнивание по центру */
}

.file-icon {
  width: 16px; /* ширина иконки файла */
  height: 16px; /* высота иконки файла */
  margin-right: 8px; /* отступ справа от иконки */
  vertical-align: middle; /* выравнивание по центру */
}

.file:hover {
  background-color: #f9fafb;
}
</style>
