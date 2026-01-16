<template>
  <div class="brew-timer" :class="sizeClass">
    <!-- SVG 圆环进度条 -->
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 200 200"
      class="timer-svg"
    >
      <!-- 背景圆环 -->
      <circle
        cx="100"
        cy="100"
        :r="radius"
        fill="none"
        :stroke="backgroundColor"
        :stroke-width="strokeWidth"
        class="timer-bg"
      />
      
      <!-- 进度圆环 -->
      <circle
        cx="100"
        cy="100"
        :r="radius"
        fill="none"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-linecap="round"
        class="timer-progress"
        :class="{ 'pulse': shouldPulse }"
      />
    </svg>

    <!-- 时间显示 -->
    <div class="timer-content">
      <div class="time-display" :class="textSizeClass">
        <span class="current-time">{{ formattedCurrentTime }}</span>
        <span class="time-separator">/</span>
        <span class="total-time">{{ formattedTotalTime }}</span>
      </div>
      
      <!-- 步骤提示（仅在大尺寸显示） -->
      <div v-if="showStepLabel && stepLabel" class="step-label">
        {{ stepLabel }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 当前时间（秒）
  currentTime: {
    type: Number,
    default: 0
  },
  // 总时间（秒）
  totalTime: {
    type: Number,
    required: true
  },
  // 尺寸：'small' | 'medium' | 'large'
  size: {
    type: String,
    default: 'large',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  // 步骤标签
  stepLabel: {
    type: String,
    default: ''
  },
  // 是否显示步骤标签
  showStepLabel: {
    type: Boolean,
    default: true
  }
})

// ===== 尺寸配置 =====

const sizeConfig = {
  small: {
    size: 80,
    radius: 35,
    strokeWidth: 6,
    textSize: 'text-sm'
  },
  medium: {
    size: 120,
    radius: 52,
    strokeWidth: 8,
    textSize: 'text-xl'
  },
  large: {
    size: 200,
    radius: 85,
    strokeWidth: 10,
    textSize: 'text-4xl'
  }
}

const config = computed(() => sizeConfig[props.size])
const radius = computed(() => config.value.radius)
const strokeWidth = computed(() => config.value.strokeWidth)
const sizeClass = computed(() => `timer-${props.size}`)
const textSizeClass = computed(() => config.value.textSize)

// ===== SVG 圆环计算 =====

// 圆周长
const circumference = computed(() => 2 * Math.PI * radius.value)

// 进度百分比（0-1）
const progress = computed(() => {
  if (props.totalTime === 0) return 0
  return Math.min(props.currentTime / props.totalTime, 1)
})

// 描边偏移量（从顶部开始，顺时针）
const strokeDashoffset = computed(() => {
  return circumference.value * (1 - progress.value)
})

// ===== 颜色计算 =====

// 背景颜色
const backgroundColor = computed(() => {
  return 'rgba(156, 163, 175, 0.2)' // gray-400 with opacity
})

// 进度颜色（根据剩余时间变化）
const progressColor = computed(() => {
  const remaining = 1 - progress.value
  
  if (remaining > 0.3) {
    // 绿色 - 进行中（剩余 > 30%）
    return '#10B981' // green-500
  } else if (remaining > 0.1) {
    // 橙色 - 即将完成（剩余 10%-30%）
    return '#F59E0B' // amber-500
  } else {
    // 红色 - 即将结束（剩余 < 10%）
    return '#EF4444' // red-500
  }
})

// 是否脉冲动画（最后10秒）
const shouldPulse = computed(() => {
  const remaining = props.totalTime - props.currentTime
  return remaining <= 10 && remaining > 0
})

// ===== 时间格式化 =====

/**
 * 将秒数格式化为 MM:SS
 */
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formattedCurrentTime = computed(() => formatTime(props.currentTime))
const formattedTotalTime = computed(() => formatTime(props.totalTime))

</script>

<style scoped>
.brew-timer {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* SVG 样式 */
.timer-svg {
  transform: rotate(-90deg); /* 从顶部开始 */
}

.timer-bg {
  opacity: 0.3;
}

.timer-progress {
  transition: stroke-dashoffset 0.3s ease, stroke 0.3s ease;
}

/* 脉冲动画（最后10秒） */
.timer-progress.pulse {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* 时间显示容器 */
.timer-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  pointer-events: none;
}

/* 时间显示 */
.time-display {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-family: 'Courier New', 'Monaco', monospace;
  font-weight: 600;
  line-height: 1;
  color: #1F2937; /* gray-800 */
}

.current-time {
  color: #1F2937; /* gray-800 */
}

.time-separator {
  font-size: 0.875em;
  color: #9CA3AF; /* gray-400 */
  margin: 0 0.125rem;
}

.total-time {
  font-size: 0.75em;
  color: #6B7280; /* gray-500 */
}

/* 步骤标签 */
.step-label {
  font-size: 0.875rem;
  color: #6B7280; /* gray-500 */
  text-align: center;
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 尺寸变体 */
.timer-small .time-display {
  gap: 0.125rem;
}

.timer-small .step-label {
  display: none;
}

.timer-medium .step-label {
  font-size: 0.75rem;
}

/* 响应式 */
@media (max-width: 640px) {
  .timer-large {
    transform: scale(0.9);
  }
}

@media (max-width: 375px) {
  .timer-large {
    transform: scale(0.8);
  }
}
</style>
