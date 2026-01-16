<template>
  <!-- 背景遮罩（展开时显示） -->
  <Transition name="fade">
    <div
      v-if="isExpanded"
      class="bottom-sheet-overlay"
      @click="collapse"
    />
  </Transition>

  <!-- Bottom Sheet 面板 -->
  <Transition name="slide-up">
    <div
      v-if="!isHidden"
      ref="sheetRef"
      class="bottom-sheet"
      :class="sheetClass"
      :style="sheetStyle"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <!-- 拖动手柄 -->
      <div class="drag-handle" @click="toggleExpanded">
        <div class="drag-handle-bar" />
      </div>

      <!-- 收起状态内容 -->
      <div v-show="isCollapsed" class="collapsed-content">
        <div class="collapsed-info">
          <div class="step-info">
            <span class="step-name">{{ currentStepName }}</span>
            <span class="step-progress">{{ stepProgress }}</span>
          </div>
          
          <!-- 紧凑计时器 -->
          <div class="compact-timer">
            <BrewTimer
              :current-time="brewingStore.currentTime"
              :total-time="currentStepDuration"
              size="small"
              :show-step-label="false"
            />
          </div>
        </div>

        <div class="collapsed-actions">
          <button
            class="action-btn"
            :class="{ 'paused': brewingStore.isPaused }"
            @click="togglePause"
          >
            <span v-if="brewingStore.isPaused" class="icon">▶️</span>
            <span v-else class="icon">⏸️</span>
          </button>
          
          <button class="action-btn expand-btn" @click="expand">
            <span class="icon">⬆️</span>
          </button>
        </div>
      </div>

      <!-- 展开状态内容 -->
      <div v-show="isExpanded" class="expanded-content">
        <!-- 当前步骤名称 -->
        <div class="current-step-header">
          <h2 class="step-title">{{ currentStepName }}</h2>
          <div class="step-counter">步骤 {{ currentStepNumber }}/{{ totalSteps }}</div>
        </div>

        <!-- 圆环计时器（大尺寸） -->
        <div class="timer-container">
          <BrewTimer
            :current-time="brewingStore.currentTime"
            :total-time="currentStepDuration"
            :step-label="currentStepInstruction"
            size="large"
          />
        </div>

        <!-- 水量提示 -->
        <div v-if="currentStepWater" class="water-info">
          <div class="water-icon">💧</div>
          <div class="water-text">
            <span class="water-label">本次注水</span>
            <span class="water-amount">{{ currentStepWater }}ml</span>
          </div>
        </div>

        <!-- 注水说明 -->
        <div v-if="currentStepInstruction" class="instruction-card">
          <p class="instruction-text">{{ currentStepInstruction }}</p>
        </div>

        <!-- 下一步预览 -->
        <div v-if="nextStep" class="next-step-preview">
          <span class="next-label">下一步：</span>
          <span class="next-name">{{ nextStep.name }}</span>
          <span class="next-water">{{ nextStep.waterAmount }}ml</span>
        </div>

        <!-- 操作按钮组 -->
        <div class="action-buttons">
          <button
            class="btn btn-secondary"
            @click="togglePause"
          >
            <span v-if="brewingStore.isPaused">继续</span>
            <span v-else>暂停</span>
          </button>

          <button
            class="btn btn-outline"
            @click="skipStep"
            :disabled="brewingStore.isLastStep"
          >
            跳过
          </button>

          <button
            class="btn btn-danger"
            @click="showEndConfirm = true"
          >
            结束
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- 结束确认弹窗 -->
  <Modal
    v-model="showEndConfirm"
    title="确认结束"
    :show-footer="false"
    @close="showEndConfirm = false"
  >
    <p class="text-gray-600 mb-4">确定要结束本次冲煮吗？</p>
    <div class="flex gap-3 justify-end mt-6">
      <Button variant="secondary" @click="showEndConfirm = false">
        取消
      </Button>
      <Button variant="danger" @click="endBrewing">
        确认结束
      </Button>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBrewingStore } from '@/stores/brewingStore'
import BrewTimer from './BrewTimer.vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const brewingStore = useBrewingStore()

// ===== 状态管理 =====

const STATE = {
  HIDDEN: 'hidden',
  COLLAPSED: 'collapsed',
  EXPANDED: 'expanded'
}

const currentState = ref(STATE.HIDDEN)
const showEndConfirm = ref(false)

// ===== 状态判断 =====

const isHidden = computed(() => currentState.value === STATE.HIDDEN)
const isCollapsed = computed(() => currentState.value === STATE.COLLAPSED)
const isExpanded = computed(() => currentState.value === STATE.EXPANDED)

const sheetClass = computed(() => ({
  'is-collapsed': isCollapsed.value,
  'is-expanded': isExpanded.value
}))

// ===== 拖动手势 =====

const sheetRef = ref(null)
const touchStartY = ref(0)
const touchCurrentY = ref(0)
const isDragging = ref(false)

const dragOffset = computed(() => {
  if (!isDragging.value) return 0
  return Math.max(0, touchCurrentY.value - touchStartY.value)
})

const sheetStyle = computed(() => {
  if (!isDragging.value || dragOffset.value === 0) return {}
  return {
    transform: `translateY(${dragOffset.value}px)`,
    transition: 'none'
  }
})

const onTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY
  isDragging.value = true
}

const onTouchMove = (e) => {
  if (!isDragging.value) return
  touchCurrentY.value = e.touches[0].clientY
}

const onTouchEnd = () => {
  if (!isDragging.value) return

  const offset = dragOffset.value
  const threshold = 100 // 拖动阈值（px）

  if (isExpanded.value && offset > threshold) {
    collapse()
  } else if (isCollapsed.value && offset > threshold) {
    hide()
  } else if (isCollapsed.value && offset < -threshold) {
    expand()
  }

  isDragging.value = false
  touchCurrentY.value = 0
}

// ===== 状态切换 =====

const show = () => {
  // 启动时直接展开，方便用户查看详细信息
  currentState.value = STATE.EXPANDED
}

const hide = () => {
  currentState.value = STATE.HIDDEN
}

const collapse = () => {
  currentState.value = STATE.COLLAPSED
}

const expand = () => {
  currentState.value = STATE.EXPANDED
}

const toggleExpanded = () => {
  if (isCollapsed.value) {
    expand()
  } else if (isExpanded.value) {
    collapse()
  }
}

// ===== 冲煮数据 =====

const currentStepName = computed(() => {
  return brewingStore.currentStep?.name || '准备中'
})

const currentStepInstruction = computed(() => {
  return brewingStore.currentStep?.instruction || ''
})

const currentStepWater = computed(() => {
  return brewingStore.currentStep?.waterAmount || 0
})

const currentStepDuration = computed(() => {
  return brewingStore.currentStep?.duration || 0
})

const currentStepNumber = computed(() => {
  return brewingStore.currentStepIndex + 1
})

const totalSteps = computed(() => {
  return brewingStore.totalSteps
})

const stepProgress = computed(() => {
  return `${currentStepNumber.value}/${totalSteps.value}`
})

const nextStep = computed(() => {
  if (brewingStore.isLastStep) return null
  const nextIndex = brewingStore.currentStepIndex + 1
  return brewingStore.currentRecipe?.steps[nextIndex] || null
})

// ===== 操作方法 =====

const togglePause = () => {
  brewingStore.togglePause()
}

const skipStep = () => {
  if (brewingStore.isLastStep) return
  brewingStore.skipCurrentStep()
}

const endBrewing = () => {
  console.log('🏁 Ending brewing...')
  console.log('brewRecord before finish:', brewingStore.brewRecord)
  console.log('Current step:', brewingStore.currentStepIndex, 'Total steps:', brewingStore.totalSteps)
  
  showEndConfirm.value = false
  
  // 检查是否完成了所有步骤
  const allStepsCompleted = brewingStore.isLastStep && 
    brewingStore.currentTime >= brewingStore.currentStep?.duration
  
  brewingStore.finishBrewing()
  hide()
  
  console.log('All steps completed:', allStepsCompleted)
  
  // 只有完成所有步骤才跳转到品鉴记录页面
  if (allStepsCompleted) {
    console.log('✅ All steps completed, navigating to TastingNotes')
    router.push({
      name: 'TastingNotes',
      params: { recordId: 'new' }
    })
  } else {
    console.log('⚠️ Brewing stopped early, returning to home')
    // 提前结束，返回首页
    router.push('/')
  }
}

// ===== 监听冲煮状态 =====

watch(() => brewingStore.isBrewing, (isBrewing) => {
  if (isBrewing) {
    show()
  } else {
    hide()
  }
}, { immediate: true })

// 监听步骤变化（最后一步完成后自动结束）
watch(() => [brewingStore.currentStepIndex, brewingStore.currentTime], () => {
  if (brewingStore.isLastStep && 
      brewingStore.currentTime >= brewingStore.currentStep?.duration) {
    // 延迟1秒后自动结束
    setTimeout(() => {
      if (brewingStore.isBrewing) {
        endBrewing()
      }
    }, 1000)
  }
})

// ===== 对外暴露 =====

defineExpose({
  show,
  hide,
  collapse,
  expand,
  toggleExpanded
})
</script>

<style scoped>
/* ===== 背景遮罩 ===== */
.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 40;
  cursor: pointer;
}

/* ===== Bottom Sheet 面板 ===== */
.bottom-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
  z-index: 50;
  transition: transform 300ms ease-out, height 300ms ease-out;
  overflow: hidden;
}

.bottom-sheet.is-collapsed {
  height: 80px;
}

.bottom-sheet.is-expanded {
  height: 90vh;
  overflow-y: auto;
}

/* ===== 拖动手柄 ===== */
.drag-handle {
  display: flex;
  justify-content: center;
  padding: 12px 0;
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle-bar {
  width: 48px;
  height: 6px;
  background-color: #D1D5DB; /* gray-300 */
  border-radius: 3px;
}

/* ===== 收起状态内容 ===== */
.collapsed-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 12px;
  gap: 16px;
}

.collapsed-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.step-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.step-name {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937; /* gray-800 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.step-progress {
  font-size: 14px;
  color: #6B7280; /* gray-500 */
}

.compact-timer {
  flex-shrink: 0;
}

.collapsed-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F3F4F6; /* gray-100 */
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 200ms;
}

.action-btn:hover {
  background-color: #E5E7EB; /* gray-200 */
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn.paused {
  background-color: #DBEAFE; /* blue-100 */
}

.action-btn .icon {
  font-size: 20px;
}

/* ===== 展开状态内容 ===== */
.expanded-content {
  padding: 0 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 当前步骤头部 */
.current-step-header {
  text-align: center;
}

.step-title {
  font-size: 32px;
  font-weight: 700;
  color: #1F2937; /* gray-800 */
  margin-bottom: 8px;
  line-height: 1.2;
}

.step-counter {
  font-size: 16px;
  color: #6B7280; /* gray-500 */
}

/* 计时器容器 */
.timer-container {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

/* 水量信息 */
.water-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%); /* blue-100 to blue-200 */
  border-radius: 16px;
}

.water-icon {
  font-size: 32px;
}

.water-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.water-label {
  font-size: 14px;
  color: #1E40AF; /* blue-800 */
}

.water-amount {
  font-size: 24px;
  font-weight: 700;
  color: #1E40AF; /* blue-800 */
}

/* 注水说明卡片 */
.instruction-card {
  padding: 16px;
  background-color: #FEF3C7; /* amber-100 */
  border-radius: 12px;
  border-left: 4px solid #F59E0B; /* amber-500 */
}

.instruction-text {
  font-size: 15px;
  color: #78350F; /* amber-900 */
  line-height: 1.6;
  margin: 0;
}

/* 下一步预览 */
.next-step-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #F3F4F6; /* gray-100 */
  border-radius: 12px;
  font-size: 14px;
}

.next-label {
  color: #6B7280; /* gray-500 */
}

.next-name {
  flex: 1;
  font-weight: 600;
  color: #1F2937; /* gray-800 */
}

.next-water {
  color: #3B82F6; /* blue-500 */
  font-weight: 600;
}

/* 操作按钮组 */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 8px;
}

.btn {
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 200ms;
  min-height: 48px;
}

.btn:active {
  transform: scale(0.97);
}

.btn-secondary {
  background-color: #3B82F6; /* blue-500 */
  color: white;
}

.btn-secondary:hover {
  background-color: #2563EB; /* blue-600 */
}

.btn-outline {
  background-color: white;
  color: #6B7280; /* gray-500 */
  border: 2px solid #E5E7EB; /* gray-200 */
}

.btn-outline:hover {
  background-color: #F9FAFB; /* gray-50 */
  border-color: #D1D5DB; /* gray-300 */
}

.btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  background-color: #EF4444; /* red-500 */
  color: white;
}

.btn-danger:hover {
  background-color: #DC2626; /* red-600 */
}

/* ===== 过渡动画 ===== */

/* 遮罩淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 面板滑入滑出 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 300ms ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .step-title {
    font-size: 28px;
  }

  .water-amount {
    font-size: 20px;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}

/* Safe Area 适配（iPhone 刘海屏） */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .bottom-sheet.is-collapsed {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .expanded-content {
    padding-bottom: calc(32px + env(safe-area-inset-bottom));
  }
}
</style>
