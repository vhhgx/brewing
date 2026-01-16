<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleBackdropClick"
      >
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-black/50 transition-opacity" />

        <!-- 模态框内容 -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- 标题栏 -->
          <div v-if="title" class="px-6 py-4 border-b border-gray-100">
            <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
          </div>

          <!-- 内容 -->
          <div class="px-6 py-4">
            <slot />
          </div>

          <!-- 底部按钮 -->
          <div v-if="showFooter" class="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
            <Button
              v-if="cancelText"
              variant="secondary"
              @click="handleCancel"
            >
              {{ cancelText }}
            </Button>
            <Button
              v-if="confirmText"
              variant="primary"
              :loading="loading"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import Button from './Button.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  loading: {
    type: Boolean,
    default: false
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    emit('close')
    emit('update:modelValue', false)
  }
}

function handleEscKey(event) {
  if (event.key === 'Escape' && props.modelValue) {
    emit('close')
    emit('update:modelValue', false)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
