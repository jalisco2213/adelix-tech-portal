<script setup>
import {RouterLink, RouterView} from 'vue-router'
import {ref, onMounted} from 'vue';
import ArrowUp from "@/components/ArrowUp.vue";

let isCollapsed = ref(false);
let logoHide = ref(false);

function hideNavigation() {
  const navigationHide = document.querySelector('.navigation-container');
  const textHide = document.querySelectorAll('.nav-link_text');
  const imgElements = document.querySelectorAll('.nav-link img');
  const logoImg = document.querySelector('.logo-img');

  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('isCollapsed', JSON.stringify(isCollapsed.value));

  if (isCollapsed.value) {
    navigationHide.style.width = '70px';
    textHide.forEach(text => text.style.display = 'none');
    imgElements.forEach(img => img.classList.add('hidden-image-style'));
    logoImg.style.display = 'none';
    logoHide.value = true;
    document.querySelectorAll('.nav-link_text').forEach(text => text.style.display = 'none');
  } else {
    navigationHide.style.width = '240px';
    textHide.forEach(text => text.style.display = 'inline-block');
    imgElements.forEach(img => img.classList.remove('hidden-image-style'));
    logoImg.style.display = 'flex';
    logoHide.value = false;
    document.querySelectorAll('.nav-link_text').forEach(text => text.style.display = 'inline-block');
  }
  ;
};


onMounted(async () => {
  const savedIsCollapsed = JSON.parse(localStorage.getItem('isCollapsed'));
  if (savedIsCollapsed !== null) {
    isCollapsed.value = savedIsCollapsed;
  }

  const avatarHide = document.querySelectorAll('.logo-img');
  const imgElements = document.querySelectorAll('.nav-link img');
  const textHide = document.querySelectorAll('.nav-link_text');
  if (isCollapsed.value) {
    textHide.forEach(text => text.style.display = 'none');
    avatarHide.forEach(avatar => avatar.style.display = 'none');
    logoHide.value = true;
    imgElements.forEach(img => img.classList.add('hidden-image-style'));
  }
});
</script>

<template>
  <div class="navigation-container" :style="{ width: isCollapsed ? '70px' : '250px' }">
    <div class="navigation-info">
      <div class="navigation-link">
        <img src="/ADL.png" alt="logo" class="logo-img" :style="{ display: !isCollapsed ? 'flex' : 'none' }">
        <img src="/adlLogo.png" alt="" class="logo-img_hide" v-if="logoHide"
             :style="{ display: isCollapsed ? 'flex' : 'none' }">

        <div class="line-nav">
          <div></div>
          <p :style="{ display: !isCollapsed ? 'flex' : 'none' }">Основное</p>
        </div>

        <nav class="nav">
          <ul>
            <li>
              <RouterLink class="nav-link" to="/protocols" exact
                          :class="{ 'active-link': $route.path === '/protocols' }">
                <img src="/docx.svg" alt="">
                <span class="nav-link_text">Протоколы</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink class="nav-link" to="/storage" exact
                          :class="{ 'active-link': $route.path === '/storage' }">
                <img src="/storage.svg" alt="">
                <span class="nav-link_text">Склад</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink class="nav-link" to="/shields" exact
                          :class="{ 'active-link': $route.path === '/shields' }">
                <img src="/sticker.svg" alt="">
                <span class="nav-link_text">Шильды</span>
              </RouterLink>
            </li>
          </ul>
        </nav>
        <RouterView/>
      </div>
    </div>

    <div class="navigation-profile">
      <li @click="hideNavigation">
        <a class="nav-link">
          <img src="/svg/hide.svg" style="width: 20px;" alt="">
          <span class="nav-link_text">Свернуть</span>
        </a>
      </li>
    </div>
  </div>

  <ArrowUp/>
</template>

<style lang="scss" scoped>
.navigation-container {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #111;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  background: #f7f7f7;
  height: 100vh;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  transition: width 0.3s ease;
  list-style: none;
  font-size: 15px;
  color: #111;

  @media (max-width: 1000px) {
    width: 150px;
    font-size: 12px;
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.navigation-profile {
  border-top: 1px solid #111;
  padding: 10px;

  li {
    cursor: pointer;
  }
}

.line-nav {
  margin: 30px 0 5px;

  div {
    background: #111;
    height: 1px;
    width: 100%;
  }

  p {
    margin: -9px auto 0px;
    display: flex;
    justify-content: center;
    text-align: center;
    font-weight: 500;
    font-size: 13px;
    cursor: default;
    background: #f7f7f7;
    color: #111;
    width: 80px;
  }
}

.navigation-link {
  width: 90%;
}

.navigation-info {
  width: 100%;
  display: flex;
  justify-content: center;
}

h1 {
  margin: 20px auto;
  font-size: 30px;
  text-align: center;
  font-weight: 400;
  line-height: 1;
  padding-bottom: 30px;
  border-bottom: 2px solid #444;
  width: 200px;
}

.nav-link {
  opacity: 0.8;
  max-width: 100%;
  padding: 8px 13px;
  display: flex;
  align-items: center;
  transition: 0.1s ease-in-out;
  color: #444;

  &:hover {
    background: #e0e0e0;
    border-radius: 100px;
    transition: 0.1s ease-in-out;
  }

  &.nav-link_admin:hover {
    border-radius: none;
    opacity: 0.9;
  }
}

.dropdown-content_link {
  max-width: 100%;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  transition: 0.1s ease-in-out;
  font-size: 13px;

  @media (max-width: 1000px) {
    font-size: 11px;
  }
}

img {
  margin-right: 10px;
  width: 25px;
  height: 30px;
}

nav {
  padding-top: 5px;
}

.logo-img {
  width: 160px;
  height: 60px;
  display: flex;
  margin: 25px auto 20px auto;
  justify-content: center;

  @media (max-width: 1000px) {
    width: 120px;
    height: 30px;
  }
}

.admin-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: #e0e0e0;
    border-radius: 20px;
  }
}

.dropdown-content {
  cursor: pointer;
  background: #f7f7f7;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  animation-name: fadeInDownBig;
  animation-duration: 0.3s;
  animation-fill-mode: both;

  li {
    margin-bottom: 10px;

    a {
      color: #888;

      &:hover {
        color: #444;
      }

      &:not(:last-child) {
        border-bottom: 2px solid #e0e0e0;
      }
    }
  }
}

.navigation-hide {
  border-top: 3px solid #444;
  padding-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 10px;
  cursor: pointer;
  transform: translateX(8%);
}

.active-link {
  opacity: 1;
  background-color: #e0e0e0;
  border-radius: 20px;
  transition: 0.1s ease;
}

.hidden-image-style {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding-right: 0;
}

.logo-img_hide {
  width: 45px;
  height: 47px;
  display: flex;
  justify-content: center;
  margin: 20px auto;
}
</style>
