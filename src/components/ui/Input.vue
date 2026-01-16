<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- 错误提示图标 -->
      <div v-if="errorMessage" class="absolute right-3 top-1/2 -translate-y-1/2">
        <span class="text-red-500">⚠️</span>
      </div>
    </div>

    <!-- 错误信息 -->
    <p v-if="errorMessage" class="mt-2 text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <!-- 辅助文本 -->
    <p v-else-if="helperText" class="mt-2 text-sm text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'number', 'email', 'password', 'tel'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  helperText: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  min: {
    type: Number,
    default: undefined
  },
  max: {
    type: Number,
    default: undefined
  },
  step: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)
const isFocused = ref(false)

const inputClasses = computed(() => {
  const base = 'w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2'

  const states = {
    error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
    disabled: 'bg-gray-50 cursor-not-allowed text-gray-500',
    normal: 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
  }

  if (props.errorMessage) return `${base} ${states.error}`
  if (props.disabled) return `${base} ${states.disabled}`
  return `${base} ${states.normal}`
})

function handleInput(event) {
  let value = event.target.value
  if (props.type === 'number') {
    value = value === '' ? '' : Number(value)
  }
  emit('update:modelValue', value)
}

function handleBlur(event) {
  isFocused.value = false
  emit('blur', event)
}

function handleFocus(event) {
  isFocused.value = true
  emit('focus', event)
}
</script>
