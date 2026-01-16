<template>
  <div :class="cardClasses" @click="handleClick">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'normal',
    validator: (value) => ['none', 'small', 'normal', 'large'].includes(value)
  },
  shadow: {
    type: String,
    default: 'normal',
    validator: (value) => ['none', 'small', 'normal', 'large'].includes(value)
  },
  clickable: {
    type: Boolean,
    default: false
  },
  hoverable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const cardClasses = computed(() => {
  const base = 'bg-white rounded-xl border border-gray-100 transition-all duration-200'

  const paddings = {
    none: '',
    small: 'p-3',
    normal: 'p-4',
    large: 'p-6'
  }

  const shadows = {
    none: '',
    small: 'shadow-sm',
    normal: 'shadow-md',
    large: 'shadow-lg'
  }

  const interactive = props.clickable ? 'cursor-pointer active:scale-[0.98]' : ''
  const hover = props.hoverable ? 'hover:shadow-lg hover:-translate-y-0.5' : ''

  return `${base} ${paddings[props.padding]} ${shadows[props.shadow]} ${interactive} ${hover}`
})

function handleClick(event) {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>
