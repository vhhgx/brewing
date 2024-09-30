<template>
  <section>
    <transition name="fade">
      <div v-if="options.showToast" class="box">
        <div class="load">
          <!-- <img alt="" src="/logo-2.png" /> -->
          loadig
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  options: {
    type: Object,
    default: {},
  },
})
</script>
<style lang="scss" scoped>
.box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.load {
  width: 30%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  //新加的
  overflow: hidden;

  @media (max-width: 768px) {
    width: 50%;
  }
}

.load img {
  // 新加的
  width: 100%;
  display: block;
  animation: slideRight 1.5s linear forwards;

  @media (max-width: 768px) {
    width: 50%;
  }
}

/* 进入和离开动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
@keyframes slideRight {
  0% {
    width: 0; /* 初始宽度为0 */
  }
  100% {
    width: 100%; /* 最终宽度为100% */
  }
}
</style>
