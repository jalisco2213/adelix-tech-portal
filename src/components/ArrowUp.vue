<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showIcon = ref(false);

const handleScroll = () => {
  showIcon.value = window.scrollY > 100;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div :class="{ 'visible': showIcon }" @click="scrollToTop">
    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
      <path
        d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
div {
  position: fixed;
  z-index: 100;
  right: 20px;
  bottom: 20px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;

  svg {
    width: 50px;
    height: 50px;
  }

  &.visible {
    opacity: .7;
  }

  &:hover {
    opacity: .9;
    transition: opacity 0.3s ease;
  }

  @media (max-width: 768px) {
    svg {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
