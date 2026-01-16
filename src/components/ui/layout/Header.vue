<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- 左侧：返回按钮 -->
      <div class="flex items-center min-w-[44px]">
        <button
          v-if="showBack"
          type="button"
          class="flex items-center justify-center w-11 h-11 rounded-lg hover:bg-gray-100 transition-colors"
          @click="handleBack"
        >
          <span class="text-xl">←</span>
        </button>
      </div>

      <!-- 中间：标题 -->
      <h1 class="flex-1 text-center text-lg font-semibold text-gray-900 truncate px-2">
        {{ title }}
      </h1>

      <!-- 右侧：操作按钮 -->
      <div class="flex items-center gap-2 min-w-[44px] justify-end">
        <slot name="right" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  showBack: {
    type: Boolean,
    default: false
  },
  backPath: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['back'])

const router = useRouter()

function handleBack() {
  emit('back')

  if (props.backPath) {
    router.push(props.backPath)
  } else {
    router.back()
  }
}
</script>
