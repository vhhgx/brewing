# 手冲咖啡冲泡助手 - AI 开发参考手册

| 文档版本 | 最后更新 | 状态 |
| :--- | :--- | :--- |
| v3.0 | 2026-01-16 | 📝 活跃 |

> **文档定位**：为 AI 代码助手提供完整的开发规范、架构模式和编码标准，确保生成代码符合项目要求。

> **重要声明**：
> - **数据模型、功能实现细节、完整代码以各阶段开发文档为准**
>   - P0 阶段：[P0-MVP-Checklist.md](./P0-MVP-Checklist.md)
>   - P1 阶段：[P1-Enhanced-Checklist.md](./P1-Enhanced-Checklist.md)
>   - P2 阶段：[P2-Advanced-Checklist.md](./P2-Advanced-Checklist.md)
> - **本文档提供：架构规范、编码标准、设计原则、快速参考**
> - **如有冲突，以 P 文档为准**

---

## 📋 目录

1. [技术栈速查](#技术栈速查)
2. [项目架构](#项目架构)
3. [编码规范](#编码规范)
4. [核心设计原则](#核心设计原则)
5. [组件开发指南](#组件开发指南)
6. [样式规范](#样式规范)
7. [性能优化指南](#性能优化指南)
8. [常见代码片段](#常见代码片段)
9. [快速参考](#快速参考)

---

## 技术栈速查

### 核心依赖及版本

| 技术 | 版本 | 用途 | 关键配置 |
| :--- | :--- | :--- | :--- |
| Vue | 3.5.x | 前端框架 | Composition API + `<script setup>` |
| Vite | 7.3.x | 构建工具 | HMR, ESBuild |
| Pinia | 3.0.x | 状态管理 | pinia-plugin-persistedstate |
| Vue Router | 4.6.x | 路由管理 | History 模式 |
| Tailwind CSS | 4.1.x | 样式框架 | @tailwindcss/postcss |
| SCSS | 1.97.x | CSS 预处理器 | **必须使用 @use，禁止 @import** |
| VueUse | latest | 组合式工具库 | useSwipe, useStorage 等 |

### 重要迁移说明

#### Tailwind CSS 4.x 变化
```javascript
// ✅ 新配置 (tailwind.config.js)
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        'coffee-brown': '#8B4513',
        'espresso': '#3E2723',
        'milk-foam': '#F5F5DC'
      }
    }
  }
}

// ✅ PostCSS 配置必须使用 @tailwindcss/postcss
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

#### SCSS 模块化
```scss
// ❌ 错误 - 不要使用 @import
@import 'variables';

// ✅ 正确 - 使用 @use
@use './variables' as vars;
@use 'sass:math';

.component {
  color: vars.$primary-color;
  width: math.div(100%, 3);
}
```

---

## 项目架构

### 目录结构

```
src/
├── assets/             # 静态资源
│   ├── images/
│   └── styles/
│       ├── main.scss      # 全局样式入口
│       ├── _variables.scss # SCSS 变量
│       └── _mixins.scss    # SCSS 混入
├── components/         # 可复用组件
│   ├── common/           # 通用组件
│   ├── brewing/          # 冲煮相关
│   ├── flavor/           # 风味相关
│   └── recipe/           # 方案相关
├── composables/        # 组合式函数
│   ├── useTimer.js
│   ├── useSwipe.js
│   └── useFlavorData.js
├── router/             # 路由配置
│   └── index.js
├── stores/             # Pinia 状态管理
│   ├── recipe.js         # 方案库
│   ├── brewing.js        # 冲煮状态
│   ├── tasting.js        # 品鉴记录
│   └── bean.js          # 咖啡豆库
├── utils/              # 工具函数
│   ├── calculations.js   # 萃取计算
│   ├── storage.js       # 本地存储
│   └── validators.js    # 验证函数
├── views/              # 页面组件
│   ├── Home.vue
│   ├── RecipeList.vue
│   ├── RecipeDetail.vue
│   └── BrewingSession.vue
├── App.vue             # 根组件
└── main.js             # 入口文件
```

### 命名规范

| 类型 | 规范 | 示例 |
| :--- | :--- | :--- |
| 组件文件 | PascalCase | `BrewTimer.vue`, `FlavorWheel.vue` |
| 组合式函数 | camelCase, use 前缀 | `useTimer.js`, `useBrewingState.js` |
| Store 文件 | camelCase, 单数名词 | `recipe.js`, `brewing.js` |
| 工具函数 | camelCase | `calculateTDS.js`, `formatTime.js` |
| 常量 | UPPER_SNAKE_CASE | `MAX_BREW_TIME`, `DEFAULT_RATIO` |
| CSS 类名 | kebab-case | `brew-timer`, `flavor-tag` |

---

## 编码规范

### Vue 组件结构

**标准组件模板**（按顺序组织）：

```vue
<script setup>
// 1. 导入依赖
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBrewingStore } from '@/stores/brewing'

// 2. Props 定义
const props = defineProps({
  recipeId: {
    type: String,
    required: true
  },
  autoStart: {
    type: Boolean,
    default: false
  }
})

// 3. Emits 定义
const emit = defineEmits(['complete', 'cancel'])

// 4. Composables
const router = useRouter()
const brewingStore = useBrewingStore()

// 5. 响应式数据
const currentStep = ref(0)
const isPaused = ref(false)

// 6. 计算属性
const progress = computed(() => {
  return (currentStep.value / totalSteps.value) * 100
})

// 7. 方法
function startBrewing() {
  brewingStore.startTimer()
  emit('complete')
}

// 8. 生命周期
onMounted(() => {
  if (props.autoStart) {
    startBrewing()
  }
})

// 9. 监听器
watch(() => props.recipeId, (newId) => {
  // 处理方案变化
})
</script>

<template>
  <!-- 根元素必须有语义化类名 -->
  <div class="brew-timer">
    <!-- 优先使用 Tailwind 原子类 -->
    <div class="flex items-center justify-between p-4">
      <button
        v-if="!isPaused"
        class="btn-primary"
        @click="startBrewing"
      >
        开始冲煮
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 仅在 Tailwind 无法满足时使用自定义样式
@use '@/assets/styles/variables' as vars;

.brew-timer {
  background: vars.$surface-color;

  // 复杂动画等特殊场景
  .progress-ring {
    animation: rotate 2s linear infinite;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
```

### JSDoc 注释规范

```javascript
/**
 * 计算萃取率
 * @param {number} coffeeWeight - 咖啡粉重量（克）
 * @param {number} waterWeight - 注水量（克）
 * @param {number} tds - TDS 浓度（百分比）
 * @returns {number} 萃取率（百分比）
 */
export function calculateExtractionYield(coffeeWeight, waterWeight, tds) {
  return (waterWeight * tds) / coffeeWeight
}
```

### 错误处理模式

```javascript
// ✅ 推荐：统一错误处理结构
async function loadRecipe(id) {
  try {
    const recipe = await api.getRecipe(id)
    return { success: true, data: recipe }
  } catch (error) {
    console.error('Failed to load recipe:', error)
    return { success: false, error: error.message }
  }
}

// 使用
const result = await loadRecipe(id)
if (result.success) {
  // 处理数据
} else {
  // 显示错误提示
}
```

---

## 核心设计原则

### 数据模型

> **完整数据模型定义请查看**：
> - Recipe, BrewRecord, TastingNote: [P0-MVP-Checklist.md § 数据模型](./P0-MVP-Checklist.md)
> - CoffeeBean: [P1-Enhanced-Checklist.md § 咖啡豆库](./P1-Enhanced-Checklist.md)

**设计原则**：
- 使用 UUID 作为唯一标识
- 时间戳使用 ISO 8601 格式
- 关联数据使用 ID 引用 + 名称快照
- 可选字段明确标注默认值

### 状态管理架构

> **完整 Store 实现请查看**：[P0-MVP-Checklist.md § Pinia Store](./P0-MVP-Checklist.md)

**核心模式**：

```javascript
// stores/brewing.js - 架构模式
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBrewingStore = defineStore('brewing', () => {
  // ===== State（使用 ref/reactive）=====
  const currentRecipe = ref(null)
  const isBrewing = ref(false)

  // ===== Getters（使用 computed）=====
  const currentStep = computed(() => {
    // 计算逻辑
  })

  // ===== Actions（普通函数）=====
  function startBrewing(recipe) {
    // 业务逻辑
  }

  return {
    // 导出 state, getters, actions
    currentRecipe,
    isBrewing,
    currentStep,
    startBrewing,
  }
})
```

**关键原则**：
1. **计时使用 `performance.now()` + `requestAnimationFrame`** - 确保高精度
2. **暂停时累计暂停时长** - 计算总时长时扣除
3. **仅对用户数据启用持久化** - 避免状态冲突
4. **Store 模块化** - 按功能划分（recipe, brewing, tasting, bean）

### Bottom Sheet 设计模式

> **完整实现代码请查看**：[v2-feature-prd.md § 2.2.1](./v2-feature-prd.md#221-bottom-sheet-冲煮面板设计--重点)

**三种状态**：
- **Hidden**: 完全隐藏（`height: 0`）
- **Collapsed**: 收起状态（`height: 80px`）显示关键信息
- **Expanded**: 展开状态（`height: 90vh`）显示完整界面

**核心技术**：
- 使用 `Teleport` 渲染到 body
- 使用 VueUse 的 `useSwipe` 处理手势
- 三态切换动画（300ms ease-out）
- 背景遮罩（展开时 `rgba(0,0,0,0.3)`）

### 风味轮数据架构

> **完整数据结构请查看**：[P0-MVP-Checklist.md § 风味轮](./P0-MVP-Checklist.md)

**基于 SCA Coffee Flavor Wheel**：
- 6 大类别（果香、花香、甜感、坚果、香料、烘焙）
- 每个类别包含多个子类别
- 每个子类别包含具体描述符
- 维度评分（酸度、甜度、苦度、醇厚度、余韵）

---

## 组件开发指南

### 按钮组件标准实现

```vue
<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: Boolean,
  loading: Boolean
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  return [
    'btn',
    `btn-${props.variant}`,
    `btn-${props.size}`,
    (props.disabled || props.loading) && 'btn-disabled'
  ].filter(Boolean).join(' ')
})
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <slot v-else></slot>
  </button>
</template>

<style scoped lang="scss">
.btn {
  @apply inline-flex items-center justify-center rounded-lg font-medium transition-all;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;

  &-primary { @apply bg-coffee-brown text-white hover:bg-espresso; }
  &-secondary { @apply bg-gray-200 text-gray-900 hover:bg-gray-300; }
  &-ghost { @apply bg-transparent border border-gray-300 hover:bg-gray-50; }

  &-sm { @apply px-3 py-1.5 text-sm; }
  &-md { @apply px-4 py-2 text-base; }
  &-lg { @apply px-6 py-3 text-lg; }

  &-disabled { @apply opacity-50 cursor-not-allowed; }
}

.btn-spinner {
  @apply inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin;
}
</style>
```

### Props 验证最佳实践

```javascript
// ✅ 推荐：详细的 Props 定义
defineProps({
  recipeId: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  config: {
    type: Object,
    default: () => ({})  // 对象/数组必须使用函数返回
  }
})

// ❌ 避免：简单类型定义
defineProps({
  recipeId: String,
  variant: String
})
```

---

## 样式规范

### Tailwind CSS 优先原则

```vue
<template>
  <!-- ✅ 推荐：优先使用 Tailwind 原子类 -->
  <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold text-gray-900">标题</h2>
    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      按钮
    </button>
  </div>

  <!-- ❌ 避免：不要为简单样式创建自定义类 -->
  <div class="custom-container">
    <h2 class="custom-title">标题</h2>
  </div>
</template>
```

### 响应式设计约定

```vue
<template>
  <!-- 移动优先：默认样式为移动端 -->
  <div class="
    w-full p-4
    md:w-1/2 md:p-6
    lg:w-1/3 lg:p-8
  ">
    <!-- 内容 -->
  </div>

  <!-- 网格布局 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- 卡片 -->
  </div>
</template>
```

### 自定义 SCSS 使用场景

**仅在以下情况使用自定义 SCSS**：

1. 复杂动画（`@keyframes`）
2. 复杂伪元素样式（`::before`, `::after`）
3. 跨浏览器兼容性处理
4. SVG 样式

```scss
// assets/styles/_variables.scss
$primary-color: #8B4513;
$secondary-color: #F5F5DC;
$surface-color: #FFFFFF;

$transition-fast: 150ms;
$transition-base: 300ms;
$transition-slow: 500ms;

$border-radius-sm: 0.375rem;
$border-radius-md: 0.5rem;
$border-radius-lg: 1rem;
```

```scss
// 复杂动画示例
.progress-ring {
  animation: rotate vars.$transition-slow linear infinite;

  circle {
    stroke: vars.$primary-color;
    transition: stroke-dashoffset vars.$transition-base ease;
  }
}

@keyframes rotate {
  from { transform: rotate(-90deg); }
  to { transform: rotate(270deg); }
}
```

---

## 性能优化指南

### 1. 组件懒加载

```javascript
// router/index.js
const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/recipe/:id',
    component: () => import('@/views/RecipeDetail.vue')
  }
]
```

### 2. 虚拟滚动（长列表优化）

**核心思路**：只渲染可见区域的项目

```javascript
const visibleItems = computed(() => {
  const start = Math.floor(scrollTop.value / itemHeight)
  const end = start + visibleItemCount.value
  return items.value.slice(start, end)
})

const offsetY = computed(() => {
  return startIndex.value * itemHeight
})
```

### 3. 防抖与节流

```javascript
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

// 防抖（延迟执行）
const debouncedSearch = useDebounceFn((query) => {
  // 执行搜索
}, 500)

// 节流（固定频率执行）
const throttledScroll = useThrottleFn(() => {
  // 处理滚动
}, 100)
```

### 4. 图片懒加载

```javascript
// 使用 IntersectionObserver API
const imgRef = ref(null)
const isLoaded = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isLoaded.value = true
      observer.disconnect()
    }
  })
  observer.observe(imgRef.value)
})
```

### 5. 计算属性缓存

```javascript
// ✅ 推荐：使用计算属性（自动缓存）
const filteredRecipes = computed(() => {
  return recipes.value.filter(r => r.equipment === selectedEquipment.value)
})

// ❌ 避免：在模板中直接调用方法（每次都执行）
function filterRecipes() {
  return recipes.value.filter(r => r.equipment === selectedEquipment.value)
}
```

---

## 常见代码片段

### 格式化工具

```javascript
// utils/formatters.js

/**
 * 格式化时间为 MM:SS
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * 格式化日期 YYYY-MM-DD
 */
export function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 相对时间（"2小时前"）
 */
export function relativeTime(date) {
  const now = new Date()
  const diffMs = now - new Date(date)
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  return formatDate(date)
}
```

### 表单验证

```javascript
// utils/validators.js

export function validateCoffeeWeight(weight) {
  return weight >= 10 && weight <= 50
}

export function validateTemperature(temperature) {
  return temperature >= 80 && temperature <= 100
}

export function validateRatio(coffeeWeight, waterWeight) {
  const ratio = waterWeight / coffeeWeight
  const isValid = ratio >= 10 && ratio <= 20
  return {
    isValid,
    ratio: `1:${ratio.toFixed(1)}`,
    message: isValid ? '' : '粉水比应在 1:10 到 1:20 之间'
  }
}

export function validateRecipeName(name) {
  const isValid = name.length >= 2 && name.length <= 30
  return {
    isValid,
    message: isValid ? '' : '方案名称长度应在 2-30 字符之间'
  }
}
```

### 本地存储封装

```javascript
// utils/storage.js
const PREFIX = 'brewing_'

export function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(PREFIX + key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    return defaultValue
  }
}

export function removeItem(key) {
  localStorage.removeItem(PREFIX + key)
}

export function exportData() {
  const data = {}
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(PREFIX)) {
      const cleanKey = key.replace(PREFIX, '')
      data[cleanKey] = getItem(cleanKey)
    }
  })
  return data
}

export function importData(data) {
  Object.keys(data).forEach(key => {
    setItem(key, data[key])
  })
}
```

---

## 快速参考

### Vue 3 Composition API

```javascript
// 响应式
import { ref, reactive, computed, watch, watchEffect } from 'vue'

// 生命周期
import { onMounted, onUnmounted, onBeforeMount, onBeforeUnmount } from 'vue'

// 组件通信
import { defineProps, defineEmits, defineExpose } from 'vue'

// 依赖注入
import { provide, inject } from 'vue'
```

### VueUse 常用工具

```javascript
import {
  useSwipe,           // 滑动手势
  useStorage,         // 响应式 localStorage
  useDebounceFn,      // 防抖函数
  useThrottleFn,      // 节流函数
  useIntersectionObserver, // 可见性检测
  useMediaQuery,      // 媒体查询
  useNetwork,         // 网络状态
} from '@vueuse/core'
```

### 项目命令

```bash
npm install        # 安装依赖
npm run dev        # 开发服务器（默认 http://localhost:5173）
npm run build      # 构建生产版本
npm run preview    # 预览生产构建
```

### 核心功能实现参考

| 功能 | 实现文档 | 关键技术 |
| :--- | :--- | :--- |
| 计时器 | [P0 § 冲煮助手](./P0-MVP-Checklist.md) | `performance.now()` + `requestAnimationFrame` |
| Bottom Sheet | [PRD § 2.2.1](./v2-feature-prd.md) | VueUse `useSwipe` + Teleport |
| 风味轮 | [P0 § 风味记录](./P0-MVP-Checklist.md) | SVG + 交互式选择 |
| 金杯计算器 | [P2 § 数据分析](./P2-Advanced-Checklist.md) | 萃取率公式 + 评估算法 |
| 图片压缩 | [P1 § 照片上传](./P1-Enhanced-Checklist.md) | `browser-image-compression` |

---

## 📝 更新日志

### v3.0 - 2026-01-16
- 重构为混合方案架构
- 精简为规范 + 原则 + 快速参考
- 完整实现代码迁移到 P0/P1/P2 文档
- 新增优先级声明：以 P 文档为准
- 优化文档结构，消除冗余

---

## 📮 使用说明

**本文档为 AI 代码助手提供开发规范和快速参考。生成代码时**：

1. ✅ **遵循本文档的编码规范和架构模式**
2. ✅ **查看 P0/P1/P2 文档获取完整实现代码**
3. ✅ **参考代码片段和设计原则**
4. ✅ **注意技术栈版本要求**

**文档关系**：
- **本文档**：规范 + 原则 + 模式
- **P0/P1/P2 文档**：完整实现 + 数据模型 + 验收标准
- **PRD 文档**：产品需求 + 交互设计

---

**最后更新**: 2026-01-16
**维护者**: Claude
**定位**: AI 开发参考手册（配合 P 文档使用）
