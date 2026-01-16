<template>
  <div id="app">
    <!-- 主内容区域 -->
    <router-view />
    
    <!-- 全局冲煮面板 -->
    <BrewingBottomSheet />
  </div>
</template>

<script setup>
import BrewingBottomSheet from '@/components/brewing/BrewingBottomSheet.vue'
import { useBrewingStore } from '@/stores/brewingStore'

const brewingStore = useBrewingStore()

// 页面加载时恢复冲煮状态（如果存在）
if (brewingStore.isBrewing) {
  console.log('恢复冲煮状态:', {
    recipe: brewingStore.currentRecipe?.name,
    step: brewingStore.currentStepIndex + 1,
    time: brewingStore.totalElapsedTime
  })
}
</script>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #F9FAFB; /* gray-50 */
}

#app {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

/* 防止页面在有 Bottom Sheet 时滚动穿透 */
body.modal-open {
  overflow: hidden;
}
</style>
