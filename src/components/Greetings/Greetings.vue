<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { editorSession } from "@/ts/client/state";
import { supabase } from "@/ts/client/supabase";
import SettingsModal from './SettingsModal.vue';

const router = useRouter();

async function logout() {
  const { } = await supabase.auth.signOut()

  alert("Вы успешно вышли с аккаунта");
  editorSession.value = null;
  await router.push('/');
}

const isOpen = ref(false);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
  const vectorImage = document.querySelector('.vector');
  vectorImage.style.transition = 'transform 0.1s ease-in-out';
  vectorImage.style.transform = isOpen.value ? `rotate(${180}deg)` : 'rotate(0deg)';
}

const closeDropdownOnClickOutside = (event) => {
  if (!event.target.closest('.dropdown')) {
    isOpen.value = false;
    const vectorImage = document.querySelector('.vector');
    vectorImage.style.transition = 'transform 0.1s ease-in-out';
    vectorImage.style.transform = 'rotate(0deg)';
  }
};

const isNavVisible = ref(true);
let lastScrollTop = 0;

function handleScroll() {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollTop > lastScrollTop && currentScrollTop > 90) {
    isNavVisible.value = false;
  } else {
    isNavVisible.value = true;
  }

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
}

onMounted(async () => {
  window.addEventListener('click', closeDropdownOnClickOutside);
  window.addEventListener('scroll', handleScroll);
});

const isSettingsOpen = ref(false);

const openSettings = () => {
  isSettingsOpen.value = true;
};

const closeSettings = () => {
  isSettingsOpen.value = false;
};
</script>

<template>
  <div class="greetings" :class="{ 'hidden': !isNavVisible }">
    <div class="greetings-title">
      <p id="account">👋 Здравствуй, {{ editorSession.value.username }}</p>
    </div>

    <div class="dropdown" style="margin: 0 40px;">
      <div class="greetings-profile" @click="toggleDropdown" style="display: flex; align-items: center; gap: 10px;">
        <div style="text-align: end;">
          <span> {{ editorSession.value.username }} </span> <br>
          <span style="color: #919191; font-weight: 200; font-size: 14px;">
            {{ editorSession.value.role }}
          </span>
        </div>

        <div class="">
          <img class="greetings-profile-img" :src="editorSession.value.avatar" alt="">
        </div>

        <div class="">
          <img src="" class="vector" alt="">
        </div>
      </div>
      <ul v-if="isOpen" class="dropdown-menu">
        <div class="dropdown-menu_title">
          <img class="greetings-profile-img" :src="editorSession.value.avatar" alt="">
          <div style="font-size: 14px;">
            <p>{{ editorSession.value.username }}</p>
            <p style="font-weight: 100;">{{ editorSession.value.role }}</p>
          </div>
        </div>

        <div class="dropdown-menu_router">
          <a @click="openSettings"> <img src="/settings.svg" alt="">Настройки</a>
          <button @click="logout"><img src="" alt=""> Выйти</button>
        </div>
      </ul>
    </div>
  </div>

  <SettingsModal :isOpen="isSettingsOpen" :close="closeSettings" />
</template>

<style lang="scss">
.greetings {
  margin-bottom: 20px;
  transition: transform 0.5s ease;
  transform-origin: top;
  position: sticky;
  z-index: 10;
  top: 0;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  border-radius: 0 0 20px 20px;
  border-bottom: 1px solid #111;
  border-left: 1px solid #111;
  border-right: 1px solid #111;
  background: #f7f7f7;

  &.hidden {
    transform: translateY(-100%);
  }

  @media (max-width: 768px) {
    display: none;
  }

  &-title {
    font-size: 25px;
    margin: 0 30px;
    cursor: default;
    user-select: none;

    @media(max-width: 768px) {
      font-size: 18px;
      margin: 0 0 0 20px;
    }
  }

  &-profile {
    display: flex;
    align-items: end;
    justify-content: center;
    cursor: pointer;
    border-radius: 50px;
    background: #f7f7f7;

    @media(max-width: 768px) {
      display: none;
    }

    &:hover {
      background: #f7f7f7;
    }

    &-modal {
      display: none;
      align-items: end;
      justify-content: center;
      width: 60px;
      height: 60px;
      margin: 0 20px;
      cursor: pointer;
      border-radius: 50px;
      border: 1px solid #111;
      background: #f7f7f7;

      @media(max-width: 768px) {
        display: flex;
      }

      &:hover {
        background: #0e0e14;
      }
    }
  }
}

.greetings-profile-img {
  width: 55px;
  height: 55px;
  display: flex;
  border: 1px solid #1D1E2C;
  border-radius: 50%;
  object-fit: cover;
}

.burger-navigation {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  opacity: 0;
  transform: translateY(-100%);
  transition: opacity 0.3s ease, transform 0.3s ease;

  &.active {
    opacity: 1;
    transform: translateY(0);
  }

  .navigation-container {
    width: 99%;
    height: 300px;
    background-color: #111;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

    img {
      width: 18px;
    }
  }
}

.dropdown {
  position: relative;
  cursor: pointer;

  &-menu {
    width: 220px;
    position: absolute;
    top: 135%;
    right: -8px;
    border-radius: 8px;
    border: 1px solid #1D1E2C;
    padding: 5px 0 10px 0;
    background: #f7f7f7;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    animation: fadeInDownBig 0.2s both;
    border: 1px solid #111;

    &_title {
      display: flex;
      justify-content: space-between;
      margin: 0 5px;
      align-items: center;
      gap: 15px;
      padding: 7px;
      border-bottom: solid #111 1px;
    }

    &_router {
      position: relative;
      z-index: 100;

      a {
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #111;
        text-decoration: none;

        img {
          width: 20px;
          margin-right: 8px;
        }

        &:hover {
          background: #e0e0e0;
          border-radius: 8px;
        }
      }

      button {
        width: 90%;
        background: #1D1E2C;
        margin: 5px auto;
        display: flex;
        justify-content: center;
        gap: 5px;
        color: #eee;
        padding: 8px;
        border: 1px solid #111;
        cursor: pointer;
      }
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 91.5%;
      right: 14%;
      width: 30px;
      height: 30px;
      border-top: 1px solid #111;
      border-left: 1px solid #111;
      background: #f7f7f7;
      transform: rotate(45deg);
      z-index: 1;
      box-shadow: -4px -4px 8px rgba(0, 0, 0, 0.1);
    }
  }

  @keyframes fadeInDownBig {
    0% {
      opacity: 0;
      transform: translate3d(0, -10%, 0);
    }

    100% {
      opacity: 1;
      transform: none;
    }
  }
}
</style>