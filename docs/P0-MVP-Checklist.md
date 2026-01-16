# P0 阶段：MVP 核心功能 - 开发清单

| 文档版本 | 阶段 | 预计工作量 | 优先级 | 状态 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | P0-MVP | 3-4 周 | 🔴 最高 | 未开始 |

---

## 🎯 开发目标

完成最小可用产品（MVP），确保用户能够：
1. 选择预设冲煮方案
2. 使用精准计时器进行冲煮
3. 记录风味品鉴
4. 查看历史记录

**前置条件**: 无
**交付标准**: 通过 P0 总验收标准（见文档末尾）

---

## 📋 任务概览

| 模块 | 任务数 | 预计天数 | 状态 |
| :--- | :--- | :--- | :--- |
| 1. 基础设施搭建 | 2 | 3天（已完成1天）| 🟢 进行中 |
| 2. 冲煮方案库 | 3 | 6天 | 🔴 未开始 |
| 3. 智能冲煮助手 | 5 | 12天 | 🔴 未开始 |
| 4. 风味记录系统 | 4 | 12天 | 🔴 未开始 |
| 5. 历史记录 | 2 | 4天 | 🔴 未开始 |
| 6. 路由配置 | 1 | 1天 | 🔴 未开始 |
| **总计** | **17** | **~25天** | - |

---

## 1. 基础设施搭建

### 1.1 项目初始化 ✅ 已完成

**任务清单**:
- [x] Vue 3.5 + Vite 7.3 项目脚手架
- [x] Tailwind CSS 4.1 配置
- [x] Vue Router 4.6 安装
- [x] Pinia 3.0 + 持久化插件安装
- [x] 目录结构规划

**验收标准**:
- [x] `npm run dev` 正常启动
- [x] `npm run build` 成功构建
- [x] Tailwind CSS 样式正常工作
- [x] 路由跳转正常
- [x] Pinia store 可正常使用

**时间**: ✅ 已完成

---

### 1.2 基础 UI 组件库

**任务清单**:
- [ ] `Button.vue` - 按钮组件（主要、次要、轮廓、危险）
- [ ] `Card.vue` - 卡片容器
- [ ] `Modal.vue` - 模态框（确认、警告）
- [ ] `Input.vue` - 输入框（文本、数字）
- [ ] `StarRating.vue` - 星级评分组件（1-5星）
- [ ] `TabBar.vue` - 底部导航栏
- [ ] `Header.vue` - 顶部标题栏

**验收标准**:
- [ ] 所有组件支持暗色主题（可选）
- [ ] 按钮最小触摸区域 44x44px
- [ ] 所有组件响应式适配（手机、平板）
- [ ] 符合 WCAG AA 色彩对比度标准
- [ ] 组件使用 Composition API `<script setup>`

**时间**: 3 天

**文件位置**:
```
src/components/ui/
├── Button.vue
├── Card.vue
├── Modal.vue
├── Input.vue
├── StarRating.vue
└── layout/
    ├── Header.vue
    └── TabBar.vue
```

---

## 2. 冲煮方案库（Recipe Library）

### 2.1 数据准备

**任务清单**:
- [ ] 创建方案数据结构（见 PRD 2.1 数据模型）
- [ ] 准备至少 3 个预设方案：
  - [ ] V60 标准四六法
  - [ ] Chemex 经典冲煮
  - [ ] 爱乐压快速萃取
- [ ] 创建 `recipeStore.js`

**验收标准**:
- [ ] 每个方案包含完整参数（粉量、水量、水温、研磨度）
- [ ] 分段注水步骤定义清晰（步骤名、水量、时长、说明）
- [ ] 方案存储在 localStorage（持久化）
- [ ] 可通过 ID 查询方案

**时间**: 2 天

**文件位置**:
```
src/stores/recipeStore.js
src/utils/constants.js  # 预设方案数据
```

**数据示例**:
```javascript
{
  recipeId: "v60-standard",
  name: "V60 标准四六法",
  device: "V60",
  coffeeWeight: 20,
  totalWater: 300,
  ratio: "1:15",
  temperature: 92,
  grindSize: 800,
  grindSizeDesc: "中细研磨",
  steps: [
    {
      stepId: 0,
      name: "闷蒸",
      waterAmount: 60,
      duration: 30,
      instruction: "轻柔注水，浸润所有粉层",
      startTime: 0,
      endTime: 30
    },
    // ... 更多步骤
  ],
  tags: ["浅烘焙", "果香调", "四六法"],
  difficulty: "初级",
  isPreset: true,
  createdBy: "system"
}
```

---

### 2.2 方案列表页面（HomeView）

**任务清单**:
- [ ] 创建 `HomeView.vue`
- [ ] 创建 `RecipeCard.vue` 组件
- [ ] 显示所有预设方案（卡片网格布局）
- [ ] 点击卡片查看方案详情
- [ ] 显示方案关键信息（器具、粉水比、难度、标签）

**验收标准**:
- [ ] 卡片显示方案名称、器具图标、粉水比
- [ ] 卡片支持点击，跳转到方案详情
- [ ] 响应式布局（手机 1 列，平板 2 列）
- [ ] 卡片有 hover 效果（阴影、缩放）
- [ ] 空状态提示（无方案时）

**时间**: 2 天

**文件位置**:
```
src/views/HomeView.vue
src/components/recipes/RecipeCard.vue
```

---

### 2.3 方案详情页面（RecipeDetail）

**任务清单**:
- [ ] 创建 `RecipeDetail.vue` 组件
- [ ] 显示完整方案参数（粉量、水量、水温、研磨度）
- [ ] 显示分段注水步骤（步骤名、水量、时长、说明）
- [ ] "开始冲煮" 按钮 → 跳转到冲煮配置页
- [ ] 步骤时间轴可视化（可选）

**验收标准**:
- [ ] 所有方案参数正确显示
- [ ] 步骤列表清晰易读（序号、名称、水量、时长）
- [ ] "开始冲煮" 按钮明显且易点击
- [ ] 返回按钮可回到首页
- [ ] 支持左右滑动切换方案（可选）

**时间**: 2 天

**文件位置**:
```
src/components/recipes/RecipeDetail.vue
```

---

## 3. 智能冲煮助手（Brewing Assistant）⭐ 核心

### 3.1 Pinia 冲煮状态管理（brewingStore）

**任务清单**:
- [ ] 创建 `brewingStore.js`（见 PRD 2.2 技术实现）
- [ ] 实现状态管理：
  - [ ] `activeRecipe` - 当前方案
  - [ ] `isBrewing` - 是否正在冲煮
  - [ ] `isPaused` - 是否暂停
  - [ ] `currentStepIndex` - 当前步骤索引
  - [ ] `currentTime` - 当前步骤用时
  - [ ] `totalElapsedTime` - 总用时
- [ ] 实现 Actions：
  - [ ] `startBrew(recipe)` - 开始冲煮
  - [ ] `tick()` - 计时器 tick（使用 performance.now()）
  - [ ] `pauseBrew()` - 暂停
  - [ ] `resumeBrew()` - 恢复
  - [ ] `completeCurrentStep()` - 完成当前步骤
  - [ ] `finishBrew()` - 结束冲煮
  - [ ] `resetBrew()` - 重置
- [ ] 配置 sessionStorage 持久化（临时存储）

**验收标准**:
- [ ] 计时器精度误差 < 0.1s
- [ ] 暂停/恢复功能正常
- [ ] 步骤自动切换准确
- [ ] 刷新页面后状态恢复（sessionStorage）
- [ ] 关闭页面后状态清除

**时间**: 3 天

**文件位置**:
```
src/stores/brewingStore.js
```

**完整实现代码**:

```javascript
// src/stores/brewing.js
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

  /**
   * 当前步骤对象
   */
  const currentStep = computed(() => {
    if (!currentRecipe.value) return null
    return currentRecipe.value.steps[currentStepIndex.value]
  })

  /**
   * 总步骤数
   */
  const totalSteps = computed(() => {
    return currentRecipe.value?.steps.length || 0
  })

  /**
   * 进度百分比
   */
  const progress = computed(() => {
    if (totalSteps.value === 0) return 0
    return ((currentStepIndex.value + 1) / totalSteps.value) * 100
  })

  /**
   * 是否最后一步
   */
  const isLastStep = computed(() => {
    return currentStepIndex.value === totalSteps.value - 1
  })

  /**
   * 当前步骤进度百分比
   */
  const currentStepProgress = computed(() => {
    const step = currentStep.value
    if (!step) return 0
    return Math.min((currentTime.value / step.duration) * 100, 100)
  })

  // ===== Actions =====

  /**
   * 开始冲煮
   * @param {Object} recipe - 冲煮方案
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
      id: crypto.randomUUID(),
      recipeId: recipe.id,
      recipeName: recipe.name,
      startTime: new Date().toISOString(),
      endTime: null,
      actualSteps: [],
      actualParameters: { ...recipe.parameters }
    }

    // 启动计时循环
    tick()
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

    // 累计暂停时长
    pausedTime.value += performance.now() - pauseStartTime.value
    isPaused.value = false

    // 继续计时
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
   * 完成当前步骤
   */
  function completeCurrentStep() {
    const step = currentStep.value
    if (!step) return

    // 记录实际执行数据
    brewRecord.value.actualSteps.push({
      stepId: step.id,
      startTime: step.startTime,
      endTime: totalElapsedTime.value,
      actualDuration: currentTime.value,
      completed: true
    })

    // 播放提示音和振动
    playSound()
    vibrate()

    // 切换到下一步
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

    // 保存到历史记录
    // 注意：这里需要调用 historyStore 的 addRecord 方法
    // const historyStore = useHistoryStore()
    // historyStore.addRecord(brewRecord.value)

    // 可选：跳转到品鉴记录页面
    // router.push({ name: 'TastingNotes', params: { recordId: brewRecord.value.id } })
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
      // 振动模式：200ms-100ms-200ms
      navigator.vibrate([200, 100, 200])
    }
  }

  /**
   * 发送通知提醒
   * @param {string} message - 通知内容
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
  // 使用 sessionStorage 临时存储（关闭标签页后清除）
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
```

**关键设计说明**：

1. **高精度计时**：
   - 使用 `performance.now()` 获取高精度时间戳
   - 使用 `requestAnimationFrame` 保证流畅更新（60fps）
   - 精度误差 < 0.1秒

2. **暂停逻辑**：
   - `pausedTime` 累计所有暂停时长
   - 恢复时扣除暂停时间：`elapsed = now - startTime - pausedTime`

3. **步骤管理**：
   - 每个步骤有 `startTime`（相对于冲煮开始的秒数）
   - 当前步骤时长 = 总时长 - 步骤开始时间
   - 自动检测步骤完成并切换

4. **持久化策略**：
   - 使用 `sessionStorage` 而非 `localStorage`
   - 关闭标签页后自动清除，避免残留状态
   - 刷新页面可恢复冲煮状态

5. **提醒功能**：
   - 提示音：`playSound()` 播放音频文件
   - 振动：`vibrate()` 使用振动API
   - 通知：`sendNotification()` 使用 Notification API

---

### 3.2 声音/振动提醒

**任务清单**:
- [ ] 准备提示音文件（`step-complete.mp3`）
- [ ] 实现 `playSound()` 方法
- [ ] 实现振动反馈（`navigator.vibrate`）
- [ ] 实现通知提示（Notification API）
- [ ] 步骤完成时触发提醒

**验收标准**:
- [ ] 每个步骤结束时播放提示音
- [ ] 支持振动的设备有振动反馈（200ms-100ms-200ms）
- [ ] 通知权限已授予时显示下一步提示
- [ ] 用户可在设置中关闭提醒（可选）
- [ ] 提示音文件 < 50KB

**时间**: 1 天

**文件位置**:
```
src/assets/sounds/step-complete.mp3
src/stores/brewingStore.js (playSound 方法)
```

---

### 3.3 冲煮配置页面（BrewingView）

**任务清单**:
- [ ] 创建 `BrewingView.vue`（全屏配置页）
- [ ] 显示方案参数预览
- [ ] 器具准备检查清单（可选）
- [ ] "开始计时" 按钮 → 启动冲煮并返回首页
- [ ] 展示 Bottom Sheet 冲煮面板

**验收标准**:
- [ ] 显示即将使用的方案名称和参数
- [ ] "开始计时" 按钮明显且易点击
- [ ] 点击后正确启动计时器
- [ ] 自动返回首页并展开 Bottom Sheet
- [ ] 可返回修改方案选择

**时间**: 2 天

**文件位置**:
```
src/views/BrewingView.vue
```

---

### 3.4 Bottom Sheet 冲煮面板 ⭐ 核心

**任务清单**:
- [ ] 创建 `BrewingBottomSheet.vue`（见 PRD 2.2.1）
- [ ] 实现三种状态：
  - [ ] Hidden（隐藏）
  - [ ] Collapsed（收起，80px）
  - [ ] Expanded（展开，90vh）
- [ ] 实现交互方式：
  - [ ] 拖动手势（使用 VueUse `useSwipe`）
  - [ ] 点击切换
  - [ ] 背景遮罩点击收起
- [ ] 收起状态显示：
  - [ ] 步骤名称和进度（1/4）
  - [ ] 紧凑计时器
  - [ ] 暂停/播放按钮
  - [ ] 展开按钮
- [ ] 展开状态显示：
  - [ ] 当前步骤名称（48px 大字）
  - [ ] 圆环计时器
  - [ ] 水量提示和注水说明
  - [ ] 下一步预览
  - [ ] 操作按钮（暂停、跳过、结束）

**验收标准**:
- [ ] 拖动手势流畅，无卡顿
- [ ] 三种状态切换动画自然（300ms ease-out）
- [ ] 收起状态正确显示步骤名、计时、操作按钮
- [ ] 展开状态正确显示完整冲煮界面
- [ ] 背景遮罩在展开时显示，点击收起
- [ ] 多任务：收起时可正常浏览其他页面，冲煮不中断
- [ ] 计时器在所有状态下精准运行
- [ ] 所有触摸区域 ≥ 44x44px
- [ ] 在 iOS Safari 和 Android Chrome 测试通过

**时间**: 4 天

**文件位置**:
```
src/components/brewing/BrewingBottomSheet.vue
```

**设计规范**:
- 收起高度: 80px
- 展开高度: 90vh
- z-index: 遮罩 40, 面板 50
- 圆角: 24px (rounded-t-3xl)
- 过渡时间: 300ms ease-out
- 拖动手柄: 48px × 6px, gray-300

**参考**: 详细实现代码见 PRD 文档 2.2.1 章节

---

### 3.5 圆环计时器组件（BrewTimer）

**任务清单**:
- [ ] 创建 `BrewTimer.vue`
- [ ] SVG 圆环进度条（strokeDashoffset 动画）
- [ ] 显示当前时间 / 总时间（00:25 / 00:30）
- [ ] 使用 wyxqn 字体（64px）
- [ ] 进度颜色根据状态变化（进行中、即将完成、已完成）

**验收标准**:
- [ ] 圆环进度平滑更新（60fps）
- [ ] 时间格式正确（MM:SS）
- [ ] 字体清晰易读（wyxqn）
- [ ] 进度颜色区分明显
- [ ] 响应式适配（小屏缩小）

**时间**: 2 天

**文件位置**:
```
src/components/brewing/BrewTimer.vue
```

---

## 4. 风味记录与品鉴系统（Tasting Notes）⭐ 核心

### 4.1 冲煮记录数据管理（tastingStore）

**任务清单**:
- [ ] 创建 `tastingStore.js`
- [ ] 定义 BrewRecord 数据结构（见 PRD 2.3.2）
- [ ] 实现 Actions：
  - [ ] `createRecord(recipeId)` - 创建新记录
  - [ ] `updateRecord(recordId, data)` - 更新记录
  - [ ] `getRecordById(id)` - 查询记录
  - [ ] `getAllRecords()` - 获取所有记录
  - [ ] `deleteRecord(id)` - 删除记录
- [ ] 配置 localStorage 持久化

**验收标准**:
- [ ] 记录正确关联方案 ID
- [ ] 记录包含实际参数和风味数据
- [ ] 数据持久化到 localStorage
- [ ] 刷新页面后数据不丢失
- [ ] 支持导出 JSON（可选）

**时间**: 2 天

**文件位置**:
```
src/stores/tastingStore.js
```

---

### 4.2 交互式风味轮组件 ⭐ 核心

**任务清单**:
- [ ] 创建 `FlavorWheel.vue`（见 PRD 2.3.1）
- [ ] 准备风味轮数据（9 大类、30+ 细分）
- [ ] 实现三层结构：
  - [ ] 中心圈：主类别（果香、花香等）
  - [ ] 中间圈：细分风味（柑橘、浆果等）
  - [ ] 外圈：具体描述（橙子、柠檬等）
- [ ] 实现交互逻辑：
  - [ ] 点击主类别展开细分
  - [ ] 点击细分展开具体描述
  - [ ] 点击具体描述选中/取消
- [ ] 显示已选标签（可删除）
- [ ] 提供快捷标签（常用风味）

**验收标准**:
- [ ] 风味轮包含至少 9 大类、30 种细分风味
- [ ] SVG 渲染流畅，无卡顿
- [ ] 点击交互准确（容错 10px）
- [ ] 已选标签正确显示和删除
- [ ] 颜色区分清晰（每类不同颜色）
- [ ] 响应式适配（小屏缩小）

**时间**: 5 天

**文件位置**:
```
src/components/tasting/FlavorWheel.vue
src/utils/constants.js  # FLAVOR_WHEEL_DATA
```

**数据结构**:
```javascript
const FLAVOR_WHEEL_DATA = {
  categories: [
    {
      id: 'fruity',
      name: '果香',
      color: '#FF6B6B',
      icon: '🍎',
      subcategories: [
        {
          id: 'citrus',
          name: '柑橘',
          flavors: ['橙子', '柠檬', '柚子']
        }
      ]
    },
    // ... 更多类别
  ]
};
```

**参考**: 详细实现代码见 PRD 文档 2.3.1 章节

---

### 4.3 维度评分组件（DimensionRating）

**任务清单**:
- [ ] 创建 `DimensionRating.vue`（见 PRD 2.3.2）
- [ ] 实现 5 个维度滑块：
  - [ ] 香气（aroma）
  - [ ] 醇厚度（body）
  - [ ] 酸度（acidity）
  - [ ] 甜度（sweetness）
  - [ ] 余韵（aftertaste）
- [ ] 每个维度 1-5 分（步长 0.5）
- [ ] 实时显示分数
- [ ] 滑块颜色根据维度变化

**验收标准**:
- [ ] 5 个维度滑块正常工作
- [ ] 分数范围 1-5，步长 0.5
- [ ] 分数实时显示在滑块右侧
- [ ] 滑块颜色与维度对应
- [ ] 触摸区域足够大（易操作）

**时间**: 2 天

**文件位置**:
```
src/components/tasting/DimensionRating.vue
```

**参考**: 详细实现代码见 PRD 文档 2.3.2 章节

---

### 4.4 品鉴记录页面（TastingNotesView）

**任务清单**:
- [ ] 创建 `TastingNotesView.vue`
- [ ] 冲煮完成后自动跳转到此页面
- [ ] 显示本次冲煮的实际参数（只读）
- [ ] 集成 FlavorWheel 组件
- [ ] 集成 DimensionRating 组件
- [ ] 整体评分（StarRating 1-5星）
- [ ] 自定义笔记（textarea）
- [ ] "保存记录" 按钮 → 保存并返回首页

**验收标准**:
- [ ] 自动关联当前冲煮方案
- [ ] 实际参数正确显示
- [ ] 风味轮、维度评分、星级评分正常工作
- [ ] 笔记支持多行输入
- [ ] 点击保存后数据持久化
- [ ] 保存后跳转到历史记录

**时间**: 3 天

**文件位置**:
```
src/views/TastingNotesView.vue
```

---

## 5. 历史记录（History）

### 5.1 历史记录列表页面（HistoryView）

**任务清单**:
- [ ] 创建 `HistoryView.vue`
- [ ] 显示所有冲煮记录（时间倒序）
- [ ] 每条记录显示：
  - [ ] 方案名称
  - [ ] 冲煮日期时间
  - [ ] 整体评分（星级）
  - [ ] 风味标签（前 3 个）
- [ ] 点击记录查看详情
- [ ] "再来一次" 快速重复冲煮按钮

**验收标准**:
- [ ] 记录按时间倒序排列
- [ ] 显示关键信息（方案、日期、评分、风味）
- [ ] 点击可查看完整记录详情
- [ ] "再来一次" 按钮载入方案并跳转到冲煮配置
- [ ] 空状态提示（无记录时）
- [ ] 支持下拉刷新（可选）

**时间**: 2 天

**文件位置**:
```
src/views/HistoryView.vue
```

---

### 5.2 记录详情页面（RecordDetail）

**任务清单**:
- [ ] 创建 `RecordDetail.vue` 组件
- [ ] 显示完整冲煮记录：
  - [ ] 方案信息
  - [ ] 实际参数（粉量、水量、水温、总时长）
  - [ ] 风味标签（全部）
  - [ ] 维度评分（雷达图可选）
  - [ ] 整体评分
  - [ ] 自定义笔记
  - [ ] 冲煮日期时间
- [ ] "再来一次" 按钮
- [ ] "编辑" 按钮（可选）
- [ ] "删除" 按钮（需确认）

**验收标准**:
- [ ] 所有信息正确显示
- [ ] 风味标签按颜色分组显示
- [ ] 维度评分可视化（条形图或雷达图）
- [ ] 删除需二次确认
- [ ] 返回按钮可回到历史记录列表

**时间**: 2 天

**文件位置**:
```
src/components/tasting/RecordDetail.vue
```

---

## 6. 路由配置

**任务清单**:
- [ ] 配置完整路由表
- [ ] 设置页面标题（meta.title）
- [ ] 配置 Bottom Sheet 显示规则（meta.showBottomSheet）
- [ ] 设置默认路由（/）
- [ ] 配置 404 页面（可选）

**路由表**:
```javascript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页', showBottomSheet: true }
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetail',
    component: () => import('@/components/recipes/RecipeDetail.vue'),
    meta: { title: '方案详情', showBottomSheet: false }
  },
  {
    path: '/brewing',
    name: 'Brewing',
    component: () => import('@/views/BrewingView.vue'),
    meta: { title: '准备冲煮', showBottomSheet: false }
  },
  {
    path: '/tasting/:recordId?',
    name: 'TastingNotes',
    component: () => import('@/views/TastingNotesView.vue'),
    meta: { title: '品鉴记录', showBottomSheet: false }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/HistoryView.vue'),
    meta: { title: '历史记录', showBottomSheet: true }
  },
  {
    path: '/record/:id',
    name: 'RecordDetail',
    component: () => import('@/components/tasting/RecordDetail.vue'),
    meta: { title: '记录详情', showBottomSheet: false }
  }
];
```

**验收标准**:
- [ ] 所有路由正常跳转
- [ ] 页面标题正确显示
- [ ] Bottom Sheet 在正确的页面显示/隐藏
- [ ] 浏览器前进/后退正常工作
- [ ] 路由参数正确传递

**时间**: 1 天

**文件位置**:
```
src/router/index.js
```

---

## P0 总验收标准

### 功能完整性验收

- [ ] **预设方案库**至少包含 3 个方案（V60、Chemex、爱乐压）
- [ ] **计时器精度**误差 < 0.1s
- [ ] **提示音**：每个步骤结束时播放提示音
- [ ] **风味轮**：包含至少 9 大类、30 种细分风味
- [ ] **历史记录**：正确保存并可查看
- [ ] **快速重复冲煮**：功能正常

### 用户体验验收

- [ ] **启动速度** < 2s
- [ ] **触摸区域** ≥ 44x44px（所有交互元素）
- [ ] **竖屏优化**：支持竖屏使用，横屏有提示
- [ ] **色彩对比度**：符合 WCAG AA 标准
- [ ] **流畅度**：无明显卡顿或延迟

### 数据完整性验收

- [ ] **记录关联**：冲煮记录正确关联方案
- [ ] **数据持久化**：刷新页面后数据不丢失
- [ ] **风味标签**：正确保存和显示
- [ ] **评分数据**：正确保存和显示

### 兼容性验收

- [ ] **iOS Safari**：测试通过
- [ ] **Android Chrome**：测试通过
- [ ] **响应式适配**：至少 3 种屏幕尺寸（320px、375px、768px）

### 性能验收

- [ ] **Lighthouse Performance** ≥ 90
- [ ] **FCP**（首次内容绘制）< 1.5s
- [ ] **LCP**（最大内容绘制）< 2.5s

---

## 📚 相关文档

- [完整 PRD](./v2-feature-prd.md) - 产品需求文档
- [验收报告模板](./Acceptance-Report-Template.md) - 用于记录验收结果
- [文档索引](./README.md) - 返回文档总览

---

## 🔄 下一步

P0 阶段完成并通过验收后：
1. 填写验收报告
2. 修复所有严重缺陷
3. 进入 [P1 阶段](./P1-Enhanced-Checklist.md) - 重要增强功能

---

**最后更新**: 2026-01-16
**维护者**: Claude
