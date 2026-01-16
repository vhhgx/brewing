# 手冲咖啡冲泡助手应用 - 产品需求文档 (PRD)

| 文档版本 | 产品经理 | 最后更新日期 | 状态   |
| :------- | :------- | :----------- | :----- |
| v2.1     | Claude   | 2026-01-16   | 待评审 |

## 📝 变更日志

**v2.1 (2026-01-16)**

- 新增 Bottom Sheet 冲煮面板设计（Material Design）
- 补充完整的 BrewingBottomSheet.vue 组件实现
- 定义三种面板状态（隐藏、收起、展开）及交互方式
- 添加用户体验流程和验收标准

**v2.0 (2026-01-16)**

- 调整功能优先级（咖啡豆库 P2→P1，金杯计算器 P1→P2）
- 新增声音/振动提醒功能（P0）
- 新增快速重复冲煮功能（P1）
- 重点补充交互式风味轮设计
- 完善数据模型定义
- 优化 MVP 范围
- 补充技术实现细节

---

## 1. 产品概述

### 1.1 产品愿景

打造一款面向手冲咖啡爱好者，集**标准化冲煮指导、个性化参数记录、专业品鉴分析**于一体的全方位工具型应用。旨在帮助用户从新手快速入门，并辅助资深爱好者精准探索和复现理想风味。

### 1.2 目标用户

- **咖啡新手**（60%）：希望系统学习手冲咖啡技巧，需要清晰的步骤引导和参数推荐。
- **咖啡爱好者**（35%）：已具备基础知识，希望记录和对比不同冲煮参数下的风味差异，以优化自己的冲煮方案。
- **专业咖啡师**（5%）：需要一款精准的工具来记录和复现冲煮方案，并进行专业的风味品鉴分析。

### 1.3 技术栈

- **前端框架**: Vue 3.5 (组合式 API, `<script setup>`)
- **构建工具**: Vite 7.3
- **状态管理**: Pinia 3.0 (支持持久化: pinia-plugin-persistedstate)
- **样式方案**:
  - Tailwind CSS 4.1 (主要工具类，响应式布局)
  - SCSS 1.97 (复杂组件样式、全局变量和混合宏)
- **路由**: Vue Router 4.6
- **工具库**: VueUse (组合式工具函数)
- **图表**: Chart.js 或 D3.js (风味轮、金杯图表)
- **类型检查** (可选): TypeScript

---

## 2. 功能需求

### 2.1 冲煮方案库 (Recipe Library)

此模块为用户提供标准化的冲煮方案，并支持自定义创建。

| 功能点            | 优先级 | 描述                                                                                                              | MVP |
| :---------------- | :----- | :---------------------------------------------------------------------------------------------------------------- | :-- |
| **预设方案**      | P0     | 内置 3-5 种经典冲煮方案（V60 标准、Chemex、爱乐压等）和冲煮比赛冠军的冲煮方案等，方案参数需符合手冲咖啡技术规程。 | ✅  |
| **方案详情**      | P0     | 展示方案的详细参数：器具、粉量、水量、水温、研磨度、分段注水步骤（水量/时间）等。                                 | ✅  |
| **快速重复冲煮**  | P1     | 历史记录中的"再来一次"按钮，直接载入该方案并开始计时，预填充上次的豆子信息。                                      | ✅  |
| **自定义方案**    | P1     | 用户可基于预设方案修改或完全自定义新方案，并保存至个人库。                                                        | ❌  |
| **方案筛选/搜索** | P2     | 支持按器具、烘焙度等标签筛选方案，支持关键字搜索。（方案数量少时不需要）                                          | ❌  |

**用户故事**：

> 作为一名咖啡新手，我希望能够快速选择一个适合我器具（如 V60）的经典冲煮方案，以便我能按照专业的指导开始我的第一次冲煮。

**验收标准**：

- 预设方案库包含至少 3 种经典方案（V60、Chemex、爱乐压）
- 每个方案包含完整的分段注水步骤定义
- 快速重复冲煮能一键载入历史方案

**数据模型**：

```javascript
// Recipe 方案数据结构
{
  recipeId: String,              // 唯一ID
  name: String,                  // "V60 标准四六法"
  device: String,                // "V60", "Chemex", "Kalita Wave"
  coffeeWeight: Number,          // 20 (克)
  totalWater: Number,            // 300 (克)
  ratio: String,                 // "1:15"
  temperature: Number,           // 92 (℃)
  grindSize: Number,             // 800 (μm)
  grindSizeDesc: String,         // "中细研磨"
  steps: [
    {
      stepId: Number,            // 0, 1, 2...
      name: String,              // "闷蒸", "第一次注水"
      waterAmount: Number,       // 60 (克)
      duration: Number,          // 30 (秒)
      instruction: String,       // "轻柔注水，浸润所有粉层"
      startTime: Number,         // 累计 0s
      endTime: Number,           // 累计 30s
    },
    // ... 更多步骤
  ],
  tags: String[],                // ["浅烘焙", "果香调", "四六法"]
  difficulty: String,            // "初级", "中级", "高级"
  isPreset: Boolean,             // true=预设, false=自定义
  createdBy: String,             // "system" or userId
  createdAt: Date,
  updatedAt: Date,
}
```

---

### 2.2 智能冲煮助手 (Brewing Assistant)

此为应用核心，提供引导式的实时冲煮体验。

| 功能点             | 优先级 | 描述                                                                                            | MVP |
| :----------------- | :----- | :---------------------------------------------------------------------------------------------- | :-- |
| **方案选择与载入** | P0     | 从方案库或历史记录中选择一个方案后，进入冲煮准备界面。                                          | ✅  |
| **精准计时器**     | P0     | 使用 `performance.now()` 确保精度，具备开始、暂停、重置功能。总时长和当前步骤倒计时需清晰显示。 | ✅  |
| **多阶段引导**     | P0     | 根据方案定义的步骤（如闷蒸、分段注水），动态显示当前步骤说明、目标水量和时间。                  | ✅  |
| **声音/振动提醒**  | P0     | 每个步骤结束时播放提示音、振动反馈、通知提示。                                                  | ✅  |
| **参数实时计算**   | P1     | 实时显示已注入水量、粉水比等数据。                                                              | ❌  |
| **互动注水引导**   | P2     | 在注水阶段，通过图形动画（如同心圆扩散）引导用户注水路径和速度。                                | ❌  |
| **冲煮中断与恢复** | P2     | 允许用户暂停冲煮并在之后恢复。（使用 sessionStorage）                                           | ❌  |

**交互设计重点**：

```
冲煮界面布局（竖屏）：
┌─────────────────────────────┐
│   【当前步骤名称】             │
│   闷蒸 (超大字号 48px)         │
├─────────────────────────────┤
│   【圆环计时器】               │
│   ⏱ 00:25 / 00:30            │
│   (SVG 动画进度环)            │
├─────────────────────────────┤
│   【水量提示】                 │
│   目标: 60g                   │
│   注水方式: 轻柔绕圈           │
├─────────────────────────────┤
│   【下一步预览】(半透明)       │
│   接下来: 第一次注水 (110g)   │
├─────────────────────────────┤
│   【操作按钮】                 │
│   [暂停] [跳过] [结束冲煮]    │
└─────────────────────────────┘

关键设计规范：
- 计时器数字: font-size: 64px (wyxqn 字体)
- 步骤名称: font-size: 48px
- 触摸区域: 最小 44x44px (iOS 标准)
- 配色: 咖啡色系主题
- 横屏提示: 引导用户旋转设备


```

**技术实现要点**：

```javascript
// stores/brewingStore.js
import { defineStore } from 'pinia';
import { useRafFn } from '@vueuse/core';

export const useBrewingStore = defineStore('brewing', {
  state: () => ({
    activeRecipe: null,        // 当前方案
    isBrewing: false,          // 是否正在冲煮
    isPaused: false,           // 是否暂停
    currentStepIndex: 0,       // 当前步骤索引
    currentTime: 0,            // 当前步骤用时（秒）
    totalElapsedTime: 0,       // 总用时（秒）
    startTime: null,           // 开始时间戳 (performance.now())
    pausedTime: 0,             // 暂停累计时间
    stepsCompleted: [],        // 记录每步完成时间
  }),

  getters: {
    currentStep: (state) =>
      state.activeRecipe?.steps[state.currentStepIndex],

    totalProgress: (state) =>
      state.activeRecipe
        ? (state.currentStepIndex / state.activeRecipe.steps.length) * 100
        : 0,

    isLastStep: (state) =>
      state.currentStepIndex === state.activeRecipe?.steps.length - 1,
  },

  actions: {
    startBrew(recipe) {
      this.activeRecipe = recipe;
      this.isBrewing = true;
      this.isPaused = false;
      this.currentStepIndex = 0;
      this.currentTime = 0;
      this.totalElapsedTime = 0;
      this.startTime = performance.now();
      this.pausedTime = 0;
      this.stepsCompleted = [];
      this.tick();
    },

    tick() {
      if (!this.isBrewing || this.isPaused) return;

      const elapsed = performance.now() - this.startTime - this.pausedTime;
      this.totalElapsedTime = Math.floor(elapsed / 1000);

      // 计算当前步骤用时
      const currentStep = this.currentStep;
      if (currentStep) {
        this.currentTime = this.totalElapsedTime - currentStep.startTime;

        // 检查步骤是否完成
        if (this.currentTime >= currentStep.duration) {
          this.completeCurrentStep();
        }
      }

      requestAnimationFrame(() => this.tick());
    },

    completeCurrentStep() {
      // 播放提示音
      this.playSound();

      // 振动反馈
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }

      // 通知
      if (Notification.permission === 'granted') {
        const nextStep = this.activeRecipe.steps[this.currentStepIndex + 1];
        if (nextStep) {
          new Notification(`下一步: ${nextStep.name}`, {
            body: `目标水量: ${nextStep.waterAmount}g`,
            icon: '/icon.png'
          });
        }
      }

      // 记录完成时间
      this.stepsCompleted.push({
        stepId: this.currentStepIndex,
        completedAt: this.totalElapsedTime
      });

      // 进入下一步或结束
      if (!this.isLastStep) {
        this.currentStepIndex++;
        this.currentTime = 0;
      } else {
        this.finishBrew();
      }
    },

    playSound() {
      const audio = new Audio('/sounds/step-complete.mp3');
      audio.play().catch(err => console.log('Sound play failed:', err));
    },

    pauseBrew() {
      if (!this.isBrewing) return;
      this.isPaused = true;
      this.pauseStartTime = performance.now();
    },

    resumeBrew() {
      if (!this.isPaused) return;
      this.isPaused = false;
      this.pausedTime += performance.now() - this.pauseStartTime;
      this.tick();
    },

    finishBrew() {
      this.isBrewing = false;
      // 跳转到风味记录页面
      router.push({
        name: 'TastingNotes',
        params: { brewRecordId: 'new' }
      });
    },

    resetBrew() {
      this.isBrewing = false;
      this.isPaused = false;
      this.currentStepIndex = 0;
      this.currentTime = 0;
      this.totalElapsedTime = 0;
      this.stepsCompleted = [];
    },
  },

  persist: {
    key: 'brewing-session',
    storage: sessionStorage, // 临时存储，关闭页面即清除
    paths: ['activeRecipe', 'currentStepIndex', 'totalElapsedTime'], // 只持久化必要字段
  }
});
```

---

### 2.3 风味记录与品鉴系统 (Tasting Notes) ⭐ 核心功能

将每一次冲煮的数据与感官体验关联，是用户优化方案的关键。

| 功能点               | 优先级 | 描述                                                              | MVP |
| :------------------- | :----- | :---------------------------------------------------------------- | :-- |
| **自动关联冲煮数据** | P0     | 每次冲煮完成后，自动创建一条记录，并关联所使用的方案和实际参数。  | ✅  |
| **交互式风味轮**     | P0     | 基于 SCA 咖啡风味轮设计的交互式圆环选择器，用户点击选择风味标签。 | ✅  |
| **维度评分**         | P0     | 香气、醇厚度、酸度、甜度、余韵 5 个维度的滑块评分（1-5分）。      | ✅  |
| **整体满意度**       | P0     | 1-5 星的整体评分系统。                                            | ✅  |
| **自定义笔记**       | P0     | 支持用户输入自由文本，记录更细致的感受。                          | ✅  |
| **照片上传**         | P1     | 允许用户为当前使用的咖啡豆或冲煮成果拍照上传（压缩后存储）。      | ❌  |

#### 2.3.1 交互式风味轮设计 ⭐ 重点

**设计理念**：
基于 SCA（美国精品咖啡协会）咖啡风味轮，简化为三层结构：

1. **中心圈**：主要风味类别（9 大类）
2. **中间圈**：细分风味（约 30 种）
3. **外圈**：具体描述（可选，约 80 种）

**交互方式**：

```
风味轮界面布局：
┌─────────────────────────────┐
│   【风味轮标题】               │
│   选择本次冲煮的风味特征       │
├─────────────────────────────┤
│                              │
│      【交互式风味轮】          │
│    (SVG 圆环，可点击)         │
│                              │
│   中心：主类别（花香、果香等） │
│   中间：细分（茉莉、玫瑰等）   │
│   外圈：具体（白桃、柑橘等）   │
│                              │
├─────────────────────────────┤
│   【已选标签】                 │
│   [果香-柑橘] [花香-茉莉]     │
│   [甜感-焦糖]                 │
├─────────────────────────────┤
│   【快捷标签】（常用）         │
│   [果香] [醇厚] [明亮]        │
└─────────────────────────────┘

交互流程：
1. 点击中心圈选择主类别（如"果香"）
2. 中间圈展开显示细分（如"柑橘"、"浆果"）
3. 点击细分后，外圈展开具体描述（如"橙子"、"柠檬"）
4. 已选标签显示在下方，可点击删除
5. 提供快捷标签供快速选择
```

**风味轮数据结构**：

```javascript
// 风味轮数据
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
          flavors: ['橙子', '柠檬', '柚子', '柑橘']
        },
        {
          id: 'berry',
          name: '浆果',
          flavors: ['草莓', '蓝莓', '覆盆子', '黑莓']
        },
        {
          id: 'stone-fruit',
          name: '核果',
          flavors: ['桃子', '李子', '樱桃', '杏']
        },
        {
          id: 'tropical',
          name: '热带水果',
          flavors: ['芒果', '菠萝', '百香果', '荔枝']
        }
      ]
    },
    {
      id: 'floral',
      name: '花香',
      color: '#FFB6C1',
      icon: '🌸',
      subcategories: [
        {
          id: 'white-floral',
          name: '白花',
          flavors: ['茉莉', '栀子', '百合', '橙花']
        },
        {
          id: 'rose',
          name: '玫瑰',
          flavors: ['玫瑰', '月季']
        }
      ]
    },
    {
      id: 'sweet',
      name: '甜感',
      color: '#FFD700',
      icon: '🍯',
      subcategories: [
        {
          id: 'caramel',
          name: '焦糖',
          flavors: ['焦糖', '太妃糖', '枫糖']
        },
        {
          id: 'chocolate',
          name: '巧克力',
          flavors: ['黑巧克力', '牛奶巧克力', '可可']
        },
        {
          id: 'honey',
          name: '蜂蜜',
          flavors: ['蜂蜜', '糖浆']
        }
      ]
    },
    {
      id: 'nutty',
      name: '坚果',
      color: '#A0522D',
      icon: '🥜',
      subcategories: [
        {
          id: 'almond',
          name: '杏仁',
          flavors: ['杏仁', '榛子', '核桃']
        }
      ]
    },
    {
      id: 'spicy',
      name: '香料',
      color: '#CD853F',
      icon: '🌶️',
      subcategories: [
        {
          id: 'cinnamon',
          name: '肉桂',
          flavors: ['肉桂', '丁香', '肉豆蔻']
        }
      ]
    },
    {
      id: 'roasted',
      name: '烘焙',
      color: '#8B4513',
      icon: '☕',
      subcategories: [
        {
          id: 'toast',
          name: '烤面包',
          flavors: ['烤面包', '谷物', '麦芽']
        }
      ]
    },
    {
      id: 'herbal',
      name: '草本',
      color: '#90EE90',
      icon: '🌿',
      subcategories: [
        {
          id: 'tea',
          name: '茶感',
          flavors: ['红茶', '绿茶', '草本']
        }
      ]
    },
    {
      id: 'earthy',
      name: '泥土',
      color: '#8B7355',
      icon: '🌱',
      subcategories: [
        {
          id: 'woody',
          name: '木质',
          flavors: ['木质', '雪松', '烟熏']
        }
      ]
    },
    {
      id: 'others',
      name: '其他',
      color: '#808080',
      icon: '✨',
      subcategories: [
        {
          id: 'wine',
          name: '酒香',
          flavors: ['红酒', '威士忌', '兰姆']
        }
      ]
    }
  ]
};
```

**技术实现架构**：

> **完整实现代码请查看**: [P0-MVP-Checklist.md § 风味记录系统](./P0-MVP-Checklist.md#4-风味记录系统tasting-notes)

**核心技术方案**：

1. **SVG 三层圆环设计**

```
内圈（半径 150px）：6 大类别（果香、花香、甜感、坚果、香料、烘焙）
中圈（半径 180px）：细分类别（动态显示，点击内圈后展开）
外圈（半径 200px）：具体风味（动态显示，点击中圈后展开）
中心圆（半径 80px）：显示当前类别图标和名称
```

2. **交互逻辑**

```javascript
// 三级逐步展开
用户点击内圈类别 → 中圈展开该类别的细分项
用户点击中圈细分项 → 外圈展开具体风味
用户点击外圈风味 → 添加到已选标签

// SVG 路径生成（圆弧计算）
generateArcPath(index, total, radius, thickness) {
  // 计算扇形的起始角度和结束角度
  // 生成 SVG Path 的 M, L, A 命令
  // 返回闭合路径字符串
}
```

3. **组件结构**

```vue
<FlavorWheel v-model="selectedFlavors">
  <!-- SVG 圆环（三层） -->
  <!-- 已选标签区域（可删除） -->
  <!-- 快捷标签（预设常用风味） -->
</FlavorWheel>
```

4. **数据格式**

```javascript
// 用户选中的风味
selectedFlavors = [
  {
    category: "果香",
    subcategory: "柑橘",
    flavor: "橙子",
    color: "#FF6B6B"
  }
]
```

#### 2.3.2 维度评分组件

**5 个评分维度**（1-5 分，支持 0.5 步进）：

| 维度              | 图标 | 说明                   | 颜色    |
| :---------------- | :--- | :--------------------- | :------ |
| 香气 (Aroma)      | 👃   | 咖啡的香气强度和复杂度 | #FF6B6B |
| 醇厚度 (Body)     | 🫗   | 口感的饱满程度         | #4ECDC4 |
| 酸度 (Acidity)    | 🍋   | 明亮度和酸质表现       | #FFE66D |
| 甜度 (Sweetness)  | 🍯   | 甜感强度               | #FFB6C1 |
| 余韵 (Aftertaste) | ✨   | 风味持久度             | #A8E6CF |

**交互设计**：

- 使用渐变滑块（`<input type="range">`）
- 滑块背景色随值动态变化
- 实时显示当前分数
- 显示"弱-中-强"刻度提示

**组件接口**：

```vue
<DimensionRating v-model="dimensions" />

<!-- v-model 数据格式 -->
{ aroma: 3.5, body: 4, acidity: 3, sweetness: 4.5, aftertaste: 4 }
```

**完整数据模型**：

```javascript
// Brew Record 冲煮记录数据结构
{
  brewRecordId: String,          // 唯一ID
  linkedRecipeId: String,        // 关联的方案ID
  linkedCoffeeBean: String,      // 关联的咖啡豆ID (P1功能)
  timestamp: Date,               // 冲煮时间

  // 实际参数（可能与方案不同）
  actualParameters: {
    coffeeWeight: Number,        // 实际粉重
    waterWeight: Number,         // 实际水重
    temperature: Number,         // 实际水温
    totalTime: Number,           // 总耗时（秒）
    stepsCompleted: [            // 每步完成时间
      { stepId: 0, completedAt: 30 },
      { stepId: 1, completedAt: 90 },
    ],
    deviations: String,          // 偏差说明："第二次注水提前了5秒"
  },

  // 风味品鉴
  tastingNotes: {
    // 风味标签（来自风味轮）
    flavorTags: [
      { category: '果香', subcategory: '柑橘', flavor: '橙子', color: '#FF6B6B' },
      { category: '花香', subcategory: '白花', flavor: '茉莉', color: '#FFB6C1' },
    ],

    // 维度评分
    dimensions: {
      aroma: Number,             // 香气 1-5
      body: Number,              // 醇厚度 1-5
      acidity: Number,           // 酸度 1-5
      sweetness: Number,         // 甜度 1-5
      aftertaste: Number,        // 余韵 1-5
    },

    // 整体评分
    overallScore: Number,        // 1-5 星

    // 自定义笔记
    notes: String,               // "入口明亮，余韵持久，非常满意"

    // 照片（可选）
    imageUrl: String,            // 压缩后的照片 URL
  },

  // 环境因素（可选，P2）
  environment: {
    roomTemp: Number,
    humidity: Number,
  },

  createdAt: Date,
  updatedAt: Date,
}
```

---

### 2.4 咖啡豆库 (Coffee Bean Library)

| 功能点       | 优先级 | 描述                                                       | MVP |
| :----------- | :----- | :--------------------------------------------------------- | :-- |
| **豆子档案** | P1     | 创建咖啡豆档案，记录产地、处理法、烘焙度、烘焙日期等信息。 | ❌  |
| **关联记录** | P1     | 冲煮记录可关联到具体豆子，便于追踪同一豆子的不同冲煮结果。 | ❌  |
| **豆子评价** | P2     | 对豆子整体评价，汇总该豆子的所有冲煮记录。                 | ❌  |

**数据模型**：

```javascript
{
  beanId: String,
  name: String,              // "埃塞俄比亚 耶加雪菲"
  origin: String,            // "埃塞俄比亚"
  region: String,            // "耶加雪菲"
  variety: String,           // "原生种"
  process: String,           // "水洗"/"日晒"/"蜜处理"
  roastLevel: String,        // "浅烘焙"/"中烘焙"/"深烘焙"
  roastDate: Date,           // 烘焙日期
  purchaseDate: Date,        // 购买日期
  weight: Number,            // 剩余重量（克）
  notes: String,             // 备注
  imageUrl: String,          // 照片
  brewRecords: String[],     // 关联的冲煮记录ID
  createdAt: Date,
}
```

---

### 2.5 金杯萃取计算器 (Golden Cup Calculator)

为进阶用户提供的专业工具，用于科学评估萃取效果。

| 功能点       | 优先级 | 描述                                               | MVP |
| :----------- | :----- | :------------------------------------------------- | :-- |
| **核心计算** | P2     | 输入咖啡粉重、咖啡液重、TDS 值，计算萃取率和浓度。 | ❌  |
| **金杯图表** | P2     | 在浓度-萃取率坐标图上标记当前结果，标出金杯范围。  | ❌  |
| **参数模拟** | P2     | 拖拽调整参数，实时观察结果变化。                   | ❌  |

---

### 2.6 个人中心 (Personal Hub)

| 功能点       | 优先级 | 描述                                         | MVP |
| :----------- | :----- | :------------------------------------------- | :-- |
| **历史记录** | P0     | 时间线形式展示所有冲煮记录，可点击查看详情。 | ✅  |
| **记录对比** | P2     | 并排对比 2-3 个冲煮记录，高亮参数差异。      | ❌  |
| **数据统计** | P2     | 每月冲煮次数、最常用方案、平均评分趋势图表。 | ❌  |

---

## 3. 非功能性需求

| 需求           | 描述                             | 实现方案                                                  |
| :------------- | :------------------------------- | :-------------------------------------------------------- |
| **性能**       | 应用启动 < 2s，计时器精准无延迟  | 使用 `performance.now()`，代码分割，图片懒加载            |
| **兼容性**     | 支持 iOS/Android，响应式适配     | Tailwind 响应式工具类，移动端优先设计                     |
| **可访问性**   | 支持动态字体，色彩对比度 AA 标准 | WCAG 2.1 标准，最小触摸区域 44x44px                       |
| **数据持久化** | 本地存储，防止数据丢失           | Pinia + pinia-plugin-persistedstate + IndexedDB(大量数据) |
| **离线使用**   | 无网络也能使用核心功能           | PWA + Service Worker                                      |
| **数据备份**   | 导出/导入 JSON 数据              | P2 功能                                                   |

---

## 4. 技术架构与实现要点

### 4.1 项目结构

```
src/
├── assets/
│   ├── style/
│   │   ├── base.css          # 基础样式、字体定义
│   │   ├── main.scss         # SCSS 变量、混合宏
│   │   └── index.scss        # 样式入口
│   ├── sounds/               # 提示音
│   │   └── step-complete.mp3
│   └── images/               # 图片资源
├── components/
│   ├── brewing/
│   │   ├── BrewTimer.vue     # 计时器组件
│   │   ├── BrewProgress.vue  # 进度环
│   │   └── StepGuide.vue     # 步骤引导
│   ├── recipes/
│   │   ├── RecipeCard.vue    # 方案卡片
│   │   ├── RecipeDetail.vue  # 方案详情
│   │   └── RecipeEditor.vue  # 方案编辑器 (P1)
│   ├── tasting/
│   │   ├── FlavorWheel.vue   # 风味轮 ⭐
│   │   ├── DimensionRating.vue # 维度评分
│   │   └── TastingForm.vue   # 品鉴表单
│   ├── ui/                   # 基础 UI 组件
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Modal.vue
│   │   ├── Input.vue
│   │   └── StarRating.vue
│   └── layout/
│       ├── Header.vue
│       └── TabBar.vue
├── composables/              # 组合式函数
│   ├── useTimer.js           # 计时器逻辑
│   ├── useSound.js           # 声音提醒
│   └── useNotification.js    # 通知
├── stores/                   # Pinia 状态库
│   ├── recipeStore.js        # 方案管理
│   ├── brewingStore.js       # 冲煮状态 ⭐
│   ├── tastingStore.js       # 品鉴记录
│   └── beanStore.js          # 咖啡豆库 (P1)
├── router/
│   └── index.js              # 路由配置
├── utils/
│   ├── constants.js          # 常量（风味轮数据等）
│   ├── storage.js            # 本地存储封装
│   └── calculations.js       # 金杯计算等
├── views/                    # 页面级组件
│   ├── HomeView.vue          # 首页（方案列表）
│   ├── BrewingView.vue       # 冲煮页面
│   ├── TastingNotesView.vue  # 风味记录页面 ⭐
│   ├── HistoryView.vue       # 历史记录
│   └── ProfileView.vue       # 个人中心
├── App.vue
└── main.js
```

#### 2.2.1 Bottom Sheet 冲煮面板设计 ⭐ 重点

**设计理念**：
冲煮页面采用 Material Design 的 Bottom Sheet 模式，将冲煮界面设计为一个从底部弹出的面板，具有三种状态：

1. **隐藏状态 (Hidden)**: 完全不可见
2. **收起状态 (Collapsed)**: 显示 80px 高度的紧凑信息条
3. **展开状态 (Expanded)**: 显示完整的冲煮界面（90vh）

**优势**：

- 专注体验：冲煮时不受其他内容干扰
- 快捷操作：通过手势快速切换状态
- 信息层级：收起时显示关键信息（计时、步骤），展开时显示完整引导
- 多任务：冲煮过程中可快速查看其他页面

**三种状态详解**：

```
状态一：隐藏 (Hidden)
┌─────────────────────────────┐
│   主页/历史记录/其他页面      │
│                              │
│                              │
│   （无冲煮面板）              │
│                              │
│                              │
└─────────────────────────────┘

状态二：收起 (Collapsed) - 80px 高度
┌─────────────────────────────┐
│   主页/历史记录/其他页面      │
│   （可正常浏览）              │
│                              │
├─────────────────────────────┤ ← 可拖动的分隔线
│  ━━  【闷蒸】 ⏱ 00:25       │
│  ⏸ 暂停  ⬆ 展开              │ ← 紧凑信息条 (80px)
└─────────────────────────────┘

状态三：展开 (Expanded) - 90vh 高度
┌─────────────────────────────┐
│  ━━  可拖动关闭               │ ← 拖动手柄
├─────────────────────────────┤
│                              │
│   【闷蒸】                    │
│   (超大字号 48px)             │
│                              │
│   ⏱ 00:25 / 00:30           │
│   (圆环计时器)                │
│                              │
│   目标: 60g                   │
│   轻柔绕圈                    │
│                              │
│   接下来: 第一次注水 (110g)   │
│                              │
│   [暂停] [跳过] [结束]        │
│                              │
└─────────────────────────────┘
```

**交互方式**：

1. **拖动手势**：
   - 向上拖动：收起 → 展开
   - 向下拖动：展开 → 收起 → 隐藏
   - 阻尼效果：拖动到边界有弹性回弹

2. **点击切换**：
   - 点击收起状态的"展开"按钮 → 展开
   - 点击展开状态的拖动手柄 → 收起

3. **背景遮罩**：
   - 展开状态时，后方内容有半透明遮罩（rgba(0,0,0,0.3)）
   - 点击遮罩 → 收起

**技术实现架构**：

> **完整实现代码请查看**: [P0-MVP-Checklist.md § Bottom Sheet 冲煮面板](./P0-MVP-Checklist.md#34-bottom-sheet-冲煮面板--核心)

**核心技术方案**：

1. **状态管理**（3 个状态）

```javascript
SHEET_STATE = {
  HIDDEN: 'hidden',       // 高度 0
  COLLAPSED: 'collapsed', // 高度 80px
  EXPANDED: 'expanded'    // 高度 90vh
}
```

2. **手势识别**（使用 VueUse）

```javascript
// 使用 useSwipe 监听拖动
useSwipe(sheetRef, {
  onSwipeEnd(direction) {
    if (direction === 'up') {
      // 收起 → 展开
    } else if (direction === 'down') {
      // 展开 → 收起 → 隐藏
    }
  }
})
```

3. **渲染层级**（使用 Teleport）

```vue
<Teleport to="body">
  <!-- 背景遮罩（z-index: 40） -->
  <Transition name="fade">
    <div v-if="isExpanded" class="bg-black/30" />
  </Transition>

  <!-- Bottom Sheet 主体（z-index: 50） -->
  <div class="bottom-sheet" :style="{ height: currentHeight }">
    <!-- 拖动手柄 -->
    <!-- 紧凑信息条（Collapsed 状态） -->
    <!-- 完整冲煮界面（Expanded 状态） -->
  </div>
</Teleport>
```

4. **内容区域设计**

**收起状态（Collapsed）**：

- 左侧：步骤进度（"1/4"）+ 步骤名称
- 中间：紧凑计时器（MM:SS）
- 右侧：暂停按钮 + 展开按钮

**展开状态（Expanded）**：

- 当前步骤名称（48px 大字）
- 圆环计时器组件
- 水量提示和注水说明
- 下一步预览
- 操作按钮（暂停、跳过、结束）

**设计规范**：

| 属性             | 值                                 | 说明                       |
| :--------------- | :--------------------------------- | :------------------------- |
| **收起高度**     | 80px                               | 显示步骤名、计时、操作按钮 |
| **展开高度**     | 90vh                               | 显示完整冲煮界面           |
| **z-index**      | 遮罩: 40<br>面板: 50               | 确保在最顶层               |
| **圆角**         | 24px (rounded-t-3xl)               | 顶部圆角                   |
| **阴影**         | shadow-2xl                         | 大阴影增强层级感           |
| **过渡时间**     | 300ms                              | 状态切换动画时长           |
| **缓动函数**     | ease-out                           | 自然的动画效果             |
| **拖动手柄**     | 宽 48px × 高 6px<br>颜色: gray-300 | 清晰的拖动提示             |
| **背景遮罩**     | rgba(0,0,0,0.3)                    | 展开时后方半透明           |
| **最小触摸区域** | 44x44px                            | iOS 可访问性标准           |

**路由集成**：

```javascript
// router/index.js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { showBottomSheet: true }  // 支持 Bottom Sheet
  },
  {
    path: '/brewing',
    name: 'Brewing',
    component: () => import('@/views/BrewingView.vue'),
    meta: { showBottomSheet: false }  // 全屏冲煮配置页
  },
  // ... 其他路由
];
```

**用户体验流程**：

```
用户操作流程：
1. 首页选择方案 → 点击"开始冲煮"
   ↓
2. 跳转到 /brewing (冲煮配置页)
   - 确认参数（粉量、水温等）
   - 准备器具
   - 点击"开始计时"
   ↓
3. 回到首页，Bottom Sheet 自动展开
   - 显示完整冲煮界面
   - 计时开始
   ↓
4. 用户可选择：
   - 保持展开状态：专注冲煮
   - 向下拖动收起：查看其他信息但不中断冲煮
   - 在收起状态查看其他页面，随时点击展开恢复
   ↓
5. 冲煮完成 → 自动跳转到风味记录页面
```

**验收标准**：

- [ ] 拖动手势流畅，无卡顿
- [ ] 三种状态切换动画自然（300ms ease-out）
- [ ] 收起状态正确显示步骤名、计时、操作按钮
- [ ] 展开状态正确显示完整冲煮界面
- [ ] 背景遮罩在展开时显示，点击收起
- [ ] 多任务：收起时可正常浏览其他页面，冲煮不中断
- [ ] 计时器在所有状态下精准运行
- [ ] 所有触摸区域 ≥ 44x44px
- [ ] 在 iOS Safari 和 Android Chrome 测试通过

---

### 4.2 数据持久化策略

```javascript
// main.js
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// stores/recipeStore.js - 方案库
export const useRecipeStore = defineStore('recipes', {
  state: () => ({
    presetRecipes: [], // 预设方案
    customRecipes: [], // 自定义方案
  }),
  persist: {
    key: 'recipes',
    storage: localStorage, // 持久存储
  }
});

// stores/tastingStore.js - 品鉴记录
export const useTastingStore = defineStore('tasting', {
  state: () => ({
    records: [], // 所有冲煮记录
  }),
  persist: {
    key: 'tasting-records',
    storage: localStorage,
    // 如果记录太多，考虑使用 IndexedDB
  }
});

// stores/brewingStore.js - 当前冲煮会话
export const useBrewingStore = defineStore('brewing', {
  state: () => ({
    activeRecipe: null,
    isBrewing: false,
    // ...
  }),
  persist: {
    key: 'brewing-session',
    storage: sessionStorage, // 临时存储，关闭页面即清除
    paths: ['activeRecipe', 'currentStepIndex'], // 只持久化必要字段
  }
});
```

### 4.3 性能优化

```javascript
// 1. 路由懒加载
const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/brewing',
    component: () => import('@/views/BrewingView.vue')
  },
  // ...
];

// 2. 图片懒加载
<img loading="lazy" :src="imageUrl" />

// 3. 大列表虚拟滚动（历史记录）
import { useVirtualList } from '@vueuse/core';

const { list, containerProps, wrapperProps } = useVirtualList(
  records,
  { itemHeight: 80 }
);

// 4. 防抖优化（自动保存）
import { useDebounceFn } from '@vueuse/core';

const debouncedSave = useDebounceFn(() => {
  saveToLocalStorage();
}, 500);
```

---

## 5. 项目路线图 (Roadmap)

### 阶段一：MVP (2-3 周) ⭐ 当前目标

**Week 1: 基础搭建**

- ✅ 项目初始化、依赖安装
- ✅ 基础组件库（Button, Card, Modal, Input）
- ✅ 路由配置
- ✅ Pinia stores 创建
- ✅ 预设方案数据准备（3-5 个）

**Week 2: 核心冲煮流程**

- ✅ 方案列表页面
- ✅ 冲煮计时器开发（精准计时）
- ✅ 多阶段引导 UI
- ✅ 声音/振动提醒
- ✅ 快速重复冲煮

**Week 3: 风味记录系统**

- ✅ 交互式风味轮组件 ⭐
- ✅ 维度评分组件
- ✅ 整体评分 + 笔记
- ✅ 历史记录列表
- ✅ 数据持久化

**Week 4: 优化与测试**

- ✅ UI/UX 优化
- ✅ 性能优化
- ✅ PWA 配置
- ✅ 测试和 Bug 修复

**MVP 交付物**：

- 3-5 个预设方案
- 完整的冲煮计时流程
- 交互式风味轮品鉴系统
- 历史记录查看
- 本地数据持久化

---

### 阶段二：增强功能 (2-3 周)

**功能清单**：

- 自定义方案编辑器
- 咖啡豆库管理
- 照片上传（压缩）
- 方案筛选/搜索
- 数据导出/导入

**目标**：

- 提升用户个性化体验
- 增加数据管理能力

---

### 阶段三：专业功能 (2-3 周)

**功能清单**：

- 金杯萃取计算器
- 数据统计和可视化
- 记录对比功能
- 参数模拟

**目标**：

- 满足专业用户需求
- 提供科学的萃取分析

---

### 阶段四：扩展 (未来)

**功能清单**：

- 社区方案分享
- 云同步
- 蓝牙硬件连接（智能秤）
- AI 方案推荐

---

## 6. 设计规范

### 6.1 色彩系统

```scss
// 咖啡色系主题
$colors: (
  primary: #6f4e37,
  // 咖啡棕
  secondary: #a0826d,
  // 浅咖啡
  accent: #d4a574,
  // 奶泡色
  success: #4caf50,
  // 绿色（金杯范围）
  warning: #ff9800,
  // 橙色（接近金杯）
  danger: #f44336,
  // 红色（萃取不足/过度）
  background: #fff8e7,
  // 米白色背景
  surface: #ffffff,
  // 卡片背景
  text-primary: #2c1810,
  // 深棕色文字
  text-secondary: #6f4e37 // 咖啡色文字
);
```

### 6.2 字体规范

```scss
// 字体大小
$font-sizes: (
  xs: 12px,
  sm: 14px,
  base: 16px,
  lg: 18px,
  xl: 20px,
  2xl: 24px,
  3xl: 32px,
  4xl: 48px,
  timer: 64px // 计时器
);

// 自定义字体（数字显示）
@font-face {
  font-family: 'wyxqn';
  src: url('/fonts/wyxqn.ttf') format('opentype');
  font-weight: 700;
}
```

### 6.3 间距规范

```scss
// Tailwind 默认间距 + 自定义
spacing: {
  '0': '0',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
}
```

---

## 7. 验收标准

### MVP 验收清单

**功能完整性**：

- [ ] 预设方案库至少包含 3 个方案（V60、Chemex、爱乐压）
- [ ] 计时器精度误差 < 0.1s
- [ ] 每个步骤结束时播放提示音
- [ ] 风味轮包含至少 9 大类、30 种细分风味
- [ ] 历史记录正确保存并可查看
- [ ] 快速重复冲煮功能正常

**用户体验**：

- [ ] 应用启动速度 < 2s
- [ ] 所有触摸区域 ≥ 44x44px
- [ ] 支持竖屏使用，横屏有提示
- [ ] 色彩对比度符合 WCAG AA 标准
- [ ] 无明显卡顿或延迟

**数据完整性**：

- [ ] 冲煮记录正确关联方案
- [ ] 刷新页面后数据不丢失
- [ ] 风味标签正确保存
- [ ] 评分数据正确保存

**兼容性**：

- [ ] iOS Safari 测试通过
- [ ] Android Chrome 测试通过
- [ ] 响应式适配至少 3 种屏幕尺寸

---

## 8. 风险与应对

| 风险               | 影响                    | 应对方案                           | 优先级 |
| :----------------- | :---------------------- | :--------------------------------- | :----- |
| **计时器后台冻结** | iOS/Android 后台冻结 JS | 使用 Web Worker 或提示用户保持前台 | P0     |
| **数据丢失**       | 用户体验极差            | 每步完成立即持久化 + 自动保存      | P0     |
| **风味轮性能**     | SVG 渲染复杂度高        | 优化 SVG 结构，使用 CSS transform  | P1     |
| **图片存储**       | 照片占用大量空间        | 压缩 + 数量限制 + 云存储方案       | P1     |
| **离线使用**       | 无网络无法使用          | PWA + Service Worker               | P1     |
| **浏览器兼容性**   | 部分 API 不支持         | polyfill + 优雅降级                | P2     |

---

## 9. 参考资料

- [SCA 咖啡风味轮](https://sca.coffee/research/coffee-tasters-flavor-wheel)
- [金杯萃取标准](https://sca.coffee/research/protocols-best-practices)
- [Vue 3 文档](https://vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Tailwind CSS v4 文档](https://tailwindcss.com/)
- [WCAG 可访问性标准](https://www.w3.org/WAI/WCAG21/quickref/)

---

**文档状态**: 待评审
**下一步**: 评审通过后开始 MVP 开发

_本文档将根据项目进展迭代更新。_
