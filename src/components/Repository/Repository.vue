<template>
  <div class="folder-view w96">
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
        isOpen: false
      };
    });

    folders.value = await Promise.all(folderPromises);
  } catch (error) {
    console.error('Error fetching folders:', error);
  }
};

const toggleFolder = (folder) => {
  folder.isOpen = !folder.isOpen; 
};

onMounted(() => {
  fetchFolders();
});
</script>

<style scoped>
.folder-view {
  padding: 20px;
  background-color: #f3f4f6; 
  border-radius: 10px;
}

.folders {
  display: flex;
  flex-direction: column; 
}

.folder {
  background: #ffffff; 
  border: 1px solid #d1d5db; 
  margin: 10px 0; 
  padding: 16px; 
  border-radius: 8px; 
  cursor: pointer; 
  transition: background-color 0.3s, box-shadow 0.3s; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
}

.folder:hover {
  background-color: #e5e7eb; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
}

.folder-icon {
  width: 20px;
  height: 20px; 
  margin-right: 8px; 
  vertical-align: middle; 
}

.files {
  padding-left: 20px; 
}

.file {
  padding: 8px; 
  border-radius: 4px; 
  display: flex; 
  align-items: center; 
}

.file-icon {
  width: 16px; 
  height: 16px; 
  margin-right: 8px; 
  vertical-align: middle; 
}

.file:hover {
  background-color: #f9fafb;
}
</style>
