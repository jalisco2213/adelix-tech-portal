<script setup>
import {RouterLink, RouterView} from 'vue-router'
import {ref, onMounted} from 'vue';
import ArrowUp from "@/components/ArrowUp.vue";

let isCollapsed = ref(false);
let logoHide = ref(false);

const navigations = [
  {id: 0, text: 'Руководство', img: '/navSVG/users.svg', link: '/'},
  {id: 3, text: 'Следящие', img: '/navSVG/admins.svg', link: '/'},
  {id: 2, text: 'Неактив', img: '/navSVG/inactive.svg', link: '/'},
  {id: 2, text: 'Запрос онлайна', img: '/navSVG/online.svg', link: '/'},
];

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
            <li v-for="navigation in navigations">
              <RouterLink class="nav-link" :to="navigation.link" exact
                          :class="{ 'active-link': $route.path === navigation.link }">
                <img :src="navigation.img" alt="">
                <span class="nav-link_text">{{ navigation.text }}</span>
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
          <img src="/navSVG/hide1.svg" style="width: 20px;" alt="">
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
  border-right: 1px solid #565760;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  background: #24263A;
  height: 100vh;
  box-shadow: 0px 0px 60px 0px rgba(0, 0, 0, 0.2);
  overflow-x: hidden;
  transition: width 0.3s ease;
  list-style: none;
  font-size: 15px;
  color: #eee;

  @media(max-width: 1000px) {
    width: 150px;
    font-size: 12px;
  }

  @media(max-width: 768px) {
    display: none;
  }
}

.navigation-profile {
  border-top: 1px solid rgb(126, 126, 126);
  padding: 10px;

  li {
    cursor: pointer;
  }
}

.line-nav {
  margin: 30px 0 5px;

  div {
    background: rgb(126, 126, 126);
    height: 1px;
    width: 100%;
  }

  p {
    margin: -9px auto 0px;
    display: flex;
    justify-content: center;
    text-align: center;
    font-weight: 100;
    font-size: 13px;
    cursor: default;
    background: #24263A;
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
  border-bottom: 2px solid #1D1E2C;
  width: 200px;
  margin-bottom: 20px;
}

.nav-link {
  opacity: .7;
  max-width: 100%;
  padding: 8px 13px;
  display: flex;
  align-items: center;
  transition: .1s ease-in-out;

  &:hover {
    background: #1D1E2C;
    border-radius: 100px;
    transition: .1s ease-in-out;
  }

  &_admin {
    &:hover {
      border-radius: none;
      opacity: .9;
    }
  }
}

.dropdown-content_link {
  max-width: 100%;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  transition: .1s ease-in-out;
  font-size: 13px;

  @media(max-width: 1000px) {
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

  @media(max-width: 1000px) {
    width: 120px;
    height: 30px;
  }

  &_hide {
    display: flex;
    justify-content: center;
    margin: 20px auto;
  }
}

.admin-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  display: flex;

  &:hover {
    background: #1D1E2C;
    border-radius: 20px;
  }
}

.dropdown-content {
  cursor: pointer;
  background: #1D1E2C;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  -webkit-animation-name: fadeInDownBig;
  animation-name: fadeInDownBig;
  -webkit-animation-duration: .3s;
  animation-duration: .3s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;

  @-webkit-keyframes fadeInDownBig {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -10%, 0);
      transform: translate3d(0, -10%, 0);
    }

    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  @keyframes fadeInDownBig {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -10%, 0);
      transform: translate3d(0, -10%, 0);
    }

    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  li {
    margin-bottom: 10px;

    a {
      color: #a5a5a5;

      &:hover {
        color: #eee;
      }

      &:not(:last-child) {
        border-bottom: 2px solid #24263A;
      }
    }
  }
}

.navigation-hide {
  border-top: 3px solid #1D1E2C;
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
  background-color: #1D1E2C;
  border-radius: 20px;
  transition: .1s ease;

  &_admin {
    background-color: #191925;
  }
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
}
</style>