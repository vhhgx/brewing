<template>
  <div class="star-rating flex items-center gap-1">
    <button
      v-for="star in max"
      :key="star"
      type="button"
      :class="starClasses(star)"
      :disabled="readonly"
      @click="handleClick(star)"
      @mouseenter="handleHover(star)"
      @mouseleave="handleHoverEnd"
    >
      <span class="text-2xl">{{ getStarIcon(star) }}</span>
    </button>

    <span v-if="showValue" class="ml-2 text-sm text-gray-600">
      {{ modelValue.toFixed(1) }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
    validator: (value) => value >= 0
  },
  max: {
    type: Number,
    default: 5
  },
  step: {
    type: Number,
    default: 1,
    validator: (value) => [0.5, 1].includes(value)
  },
  readonly: {
    type: Boolean,
    default: false
  },
  showValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const hoverValue = ref(0)

const starClasses = computed(() => (star) => {
  const base = 'transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center'
  const interactive = !props.readonly ? 'cursor-pointer hover:scale-110' : 'cursor-default'
  return `${base} ${interactive}`
})

function getStarIcon(star) {
  const value = hoverValue.value || props.modelValue

  if (value >= star) {
    return '⭐' // 满星
  } else if (value >= star - 0.5 && props.step === 0.5) {
    return '✨' // 半星
  } else {
    return '☆' // 空星
  }
}

function handleClick(star) {
  if (props.readonly) return

  // 根据 step 计算新值
  if (props.step === 0.5) {
    // 半星模式：点击左侧 = 半星，点击右侧 = 满星
    const currentValue = props.modelValue
    if (currentValue === star) {
      // 如果当前是满星，降为半星
      emit('update:modelValue', star - 0.5)
    } else if (currentValue === star - 0.5) {
      // 如果当前是半星，变为满星
      emit('update:modelValue', star)
    } else {
      // 其他情况，设为满星
      emit('update:modelValue', star)
    }
  } else {
    // 整星模式
    emit('update:modelValue', star)
  }
}

function handleHover(star) {
  if (props.readonly) return
  hoverValue.value = star
}

function handleHoverEnd() {
  hoverValue.value = 0
}
</script>
