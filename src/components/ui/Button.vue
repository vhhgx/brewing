<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <span v-if="loading" class="inline-block animate-spin mr-2">⏳</span>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  // 尺寸样式 - 确保最小触摸区域 44x44px
  const sizes = {
    small: 'px-3 py-2 text-sm min-h-[44px]',
    medium: 'px-4 py-3 text-base min-h-[44px]',
    large: 'px-6 py-4 text-lg min-h-[44px]'
  }

  // 变体样式
  const variants = {
    primary: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 disabled:bg-gray-300 disabled:cursor-not-allowed',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed',
    outline: 'border-2 border-amber-600 text-amber-600 hover:bg-amber-50 focus:ring-amber-500 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed'
  }

  return `${base} ${sizes[props.size]} ${variants[props.variant]}`
})

function handleClick(event) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
