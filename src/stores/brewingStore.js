import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBrewingStore = defineStore('brewing', () => {
  // ===== State =====
  const currentRecipe = ref(null)
  const brewRecord = ref(null)
  const isBrewing = ref(false)
  const isPaused = ref(false)
  const currentStepIndex = ref(0)

  // 计时相关（使用 performance.now() 确保高精度）
  const startTime = ref(0)          // performance.now() 开始时刻
  const pausedTime = ref(0)         // 累计暂停时长
  const pauseStartTime = ref(0)     // 暂停开始时刻
  const totalElapsedTime = ref(0)   // 总时长（秒）
  const currentTime = ref(0)        // 当前步骤时长（秒）

  // ===== Getters =====
  const currentStep = computed(() => {
    if (!currentRecipe.value) return null
    return currentRecipe.value.steps[currentStepIndex.value]
  })

  const totalSteps = computed(() => {
    return currentRecipe.value?.steps.length || 0
  })

  const progress = computed(() => {
    if (totalSteps.value === 0) return 0
    return ((currentStepIndex.value + 1) / totalSteps.value) * 100
  })

  const isLastStep = computed(() => {
    return currentStepIndex.value === totalSteps.value - 1
  })

  const currentStepProgress = computed(() => {
    const step = currentStep.value
    if (!step) return 0
    return Math.min((currentTime.value / step.duration) * 100, 100)
  })

  const nextStep = computed(() => {
    if (isLastStep.value || !currentRecipe.value) return null
    return currentRecipe.value.steps[currentStepIndex.value + 1]
  })

  // ===== Actions =====

  /**
   * 开始冲煮
   */
  function startBrewing(recipe) {
    currentRecipe.value = recipe
    currentStepIndex.value = 0
    isBrewing.value = true
    isPaused.value = false
    startTime.value = performance.now()
    pausedTime.value = 0
    totalElapsedTime.value = 0
    currentTime.value = 0

    // 创建冲煮记录
    brewRecord.value = {
      brewRecordId: crypto.randomUUID(),
      recipeId: recipe.recipeId,
      recipeName: recipe.name,
      startTime: new Date().toISOString(),
      endTime: null,
      actualSteps: [],
      actualParameters: {
        coffeeWeight: recipe.coffeeWeight,
        totalWater: recipe.totalWater,
        temperature: recipe.temperature
      }
    }

    // 启动计时循环
    tick()
  }

  /**
   * 核心计时逻辑 - 使用 requestAnimationFrame 确保高精度
   */
  function tick() {
    if (!isBrewing.value || isPaused.value) return

    // 计算总时长（扣除暂停时间）
    const elapsed = performance.now() - startTime.value - pausedTime.value
    totalElapsedTime.value = Math.floor(elapsed / 1000)

    // 计算当前步骤时长
    const step = currentStep.value
    if (step) {
      currentTime.value = totalElapsedTime.value - step.startTime

      // 自动切换步骤
      if (currentTime.value >= step.duration) {
        completeCurrentStep()
      }
    }

    // 继续下一帧
    requestAnimationFrame(tick)
  }

  /**
   * 暂停冲煮
   */
  function pauseBrew() {
    if (!isBrewing.value || isPaused.value) return
    isPaused.value = true
    pauseStartTime.value = performance.now()
  }

  /**
   * 恢复冲煮
   */
  function resumeBrew() {
    if (!isBrewing.value || !isPaused.value) return
    pausedTime.value += performance.now() - pauseStartTime.value
    isPaused.value = false
    tick()
  }

  /**
   * 切换暂停/恢复
   */
  function togglePause() {
    if (isPaused.value) {
      resumeBrew()
    } else {
      pauseBrew()
    }
  }

  /**
   * 完成当前步骤
   */
  function completeCurrentStep() {
    const step = currentStep.value
    if (!step) return

    // 记录实际执行数据
    brewRecord.value.actualSteps.push({
      stepId: step.stepId,
      startTime: step.startTime,
      endTime: totalElapsedTime.value,
      actualDuration: currentTime.value,
      completed: true
    })

    // 播放提示音和振动
    playSound()
    vibrate()
    sendNotification(`下一步: ${nextStep.value?.name || '完成'}`)

    // 切换到下一步或结束
    if (isLastStep.value) {
      finishBrewing()
    } else {
      currentStepIndex.value++
      currentTime.value = 0
    }
  }

  /**
   * 跳过当前步骤（手动）
   */
  function skipCurrentStep() {
    completeCurrentStep()
  }

  /**
   * 完成冲煮
   */
  function finishBrewing() {
    isBrewing.value = false
    brewRecord.value.endTime = new Date().toISOString()
    brewRecord.value.actualParameters.totalTime = totalElapsedTime.value

    // 返回 brewRecord 供后续使用
    return brewRecord.value
  }

  /**
   * 重置冲煮状态
   */
  function resetBrewing() {
    currentRecipe.value = null
    brewRecord.value = null
    isBrewing.value = false
    isPaused.value = false
    currentStepIndex.value = 0
    startTime.value = 0
    pausedTime.value = 0
    pauseStartTime.value = 0
    totalElapsedTime.value = 0
    currentTime.value = 0
  }

  /**
   * 播放步骤完成提示音
   */
  function playSound() {
    try {
      const audio = new Audio('/sounds/step-complete.mp3')
      audio.volume = 0.5
      audio.play().catch(err => {
        console.warn('Failed to play sound:', err)
      })
    } catch (error) {
      console.warn('Audio not supported:', error)
    }
  }

  /**
   * 触发振动反馈
   */
  function vibrate() {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200])
    }
  }

  /**
   * 发送通知提醒
   */
  function sendNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('手冲咖啡助手', {
        body: message,
        icon: '/favicon.ico',
        tag: 'brewing-notification',
        silent: false
      })
    }
  }

  /**
   * 请求通知权限
   */
  async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return Notification.permission === 'granted'
  }

  return {
    // State
    currentRecipe,
    brewRecord,
    isBrewing,
    isPaused,
    currentStepIndex,
    totalElapsedTime,
    currentTime,

    // Getters
    currentStep,
    totalSteps,
    progress,
    isLastStep,
    currentStepProgress,
    nextStep,

    // Actions
    startBrewing,
    pauseBrew,
    resumeBrew,
    togglePause,
    completeCurrentStep,
    skipCurrentStep,
    finishBrewing,
    resetBrewing,
    playSound,
    vibrate,
    sendNotification,
    requestNotificationPermission,
  }
}, {
  persist: {
    key: 'brewing-session',
    storage: sessionStorage,
    paths: [
      'currentRecipe',
      'brewRecord',
      'isBrewing',
      'isPaused',
      'currentStepIndex',
      'startTime',
      'pausedTime',
      'pauseStartTime',
      'totalElapsedTime',
      'currentTime'
    ]
  }
})
