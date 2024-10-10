<script setup>
import { ref } from 'vue';
import { editorSession } from '../../ts/client/state';
import { supabase } from '../../ts/client/supabase';

const props = defineProps(['isOpen', 'close']);
const activeTab = ref('password');
const newPassword = ref('');

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const changePassword = async () => {
  const { } = await supabase.auth.updateUser({
    id: editorSession.value.id,
    password: newPassword.value,
  });

  await Swal.fire({
    icon: 'success',
    title: 'Успешно',
    text: 'Пароль успешно обновлен!',
    didClose: () => {
      const { } = supabase.auth.signOut();
      editorSession.value = null;
      window.location.href = '/';
    }
  });
};

const uploadAvatar = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const { data, error } = await supabase.storage
      .from('avatar')
      .upload(`avatars/${editorSession.value.id}-${file.name}`, file);

    if (data) {
      const { publicURL, error: urlError } = supabase.storage
        .from('avatar')
        .getPublicUrl(data.path);

      if (publicURL) {
        editorSession.value.avatar = publicURL;
      }
    }
  }

};

const closeModal = () => {
  props.close();
};
</script>

<template>
  <div class="modal-overlay" v-if="isOpen">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&#x2715;</button>
      <div class="tab-container">
        <ul class="tab-list">
          <li :class="{ active: activeTab === 'password' }" @click="setActiveTab('password')">Смена пароля</li>
          <li :class="{ active: activeTab === 'avatar' }" @click="setActiveTab('avatar')">Смена аватарки</li>
        </ul>
        <div class="tab-content">
          <transition name="fade">
            <div v-if="activeTab === 'password'">
              <h2>Смена пароля</h2>
              <p style="font-size: 11px; margin-top: 5px;">После смены пароля потребуется повторная авторизация.</p>
              <input type="password" placeholder="Новый пароль" v-model="newPassword" />
              <button @click="changePassword">Сохранить</button>
            </div>
          </transition>
          <transition name="fade">
            <div v-if="activeTab === 'avatar'">
              <h2>Смена аватарки</h2>
              <input type="file" @change="uploadAvatar" />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  height: 300px;
  background: #ffffff;
  border-radius: 12px;
  width: 600px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: slideIn 0.3s forwards;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.tab-container {
  display: flex;
  height: 100%;
}

.tab-list {
  list-style: none;
  padding-right: 10px;
  margin: 0;
  width: 170px;
  border-right: 2px solid #e0e0e0;

  li {
    padding: 15px 10px;
    cursor: pointer;
    border-left: 3px solid transparent;
    transition: background 0.2s, border-color 0.3s;

    &:hover {
      background: #f0f0f0;
    }

    &.active {
      border-left: 3px solid #007BFF;
      font-weight: bold;
      color: #007BFF;
    }
  }
}

.tab-content {
  margin-left: 20px;
  flex-grow: 1;
  padding: 20px;
  border-radius: 8px;

  button {
    height: 30px;
    background: #007BFF;
    margin-top: 10px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 6px;
    transition: border 0.2s, box-shadow 0.2s;
    color: #eee;
    cursor: pointer;
  }

  input[type="password"],
  input[type="file"] {
    margin-top: 10px;
    width: 93%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    transition: border 0.2s, box-shadow 0.2s;

    &:focus {
      border-color: #007BFF;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
