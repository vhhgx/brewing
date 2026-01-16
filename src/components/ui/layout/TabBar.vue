<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-40">
    <div class="flex items-center justify-around px-2 py-2">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="flex flex-col items-center justify-center min-w-[64px] py-2 px-3 rounded-lg transition-all duration-200"
        :class="isActive(tab.path) ? 'text-amber-600' : 'text-gray-500 hover:bg-gray-50'"
      >
        <span class="text-2xl mb-1">{{ tab.icon }}</span>
        <span class="text-xs font-medium">{{ tab.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  {
    path: '/',
    icon: '☕',
    label: '首页'
  },
  {
    path: '/history',
    icon: '📊',
    label: '历史'
  },
  {
    path: '/profile',
    icon: '👤',
    label: '我的'
  }
]

function isActive(path) {
  return route.path === path
}
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
