# P1 阶段：重要增强功能 - 开发清单

| 文档版本 | 阶段 | 预计工作量 | 优先级 | 状态 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | P1-Enhanced | 2-3 周 | 🟡 高 | 待开始 |

---

## 🎯 开发目标

增强用户体验，提供个性化功能：
1. 创建和管理自定义冲煮方案
2. 建立咖啡豆库，关联冲煮记录
3. 支持照片上传（豆子、成品）
4. 提供方案筛选和搜索功能

**前置条件**: P0 阶段完成并通过验收
**交付标准**: 通过 P1 总验收标准（见文档末尾）

---

## 📋 任务概览

| 模块 | 任务数 | 预计天数 | 状态 |
| :--- | :--- | :--- | :--- |
| 1. 自定义冲煮方案 | 2 | 6天 | 🔴 未开始 |
| 2. 咖啡豆库 | 3 | 7天 | 🔴 未开始 |
| 3. 照片上传 | 1 | 3天 | 🔴 未开始 |
| 4. 方案筛选和搜索 | 1 | 2天 | 🔴 未开始 |
| **总计** | **7** | **~18天** | - |

---

## 1. 自定义冲煮方案

### 1.1 方案编辑器（RecipeEditor）

**任务清单**:
- [ ] 创建 `RecipeEditor.vue` 组件
- [ ] 基本信息表单（方案名称、器具选择、难度）
- [ ] 参数输入（粉量、水量、水温、研磨度）
- [ ] 分段步骤编辑器：
  - [ ] 添加步骤
  - [ ] 删除步骤
  - [ ] 拖拽排序
  - [ ] 编辑步骤（名称、水量、时长、说明）
- [ ] 粉水比自动计算
- [ ] 保存为自定义方案

**验收标准**:
- [ ] 表单验证（必填项、数值范围）
- [ ] 步骤时间自动累加
- [ ] 粉水比自动计算并更新
- [ ] 拖拽排序流畅
- [ ] 保存后出现在方案列表

**时间**: 4 天

**文件位置**:
```
src/components/recipes/RecipeEditor.vue
```

**关键功能**:
- 使用 VueUse 的 `useSortable` 实现步骤拖拽排序
- 实时计算粉水比：`ratio = (totalWater / coffeeWeight).toFixed(1)`
- 自动累加步骤时间：`startTime = 前一步骤的 endTime`
- 表单验证：
  - 粉量范围：10-30g
  - 水量范围：150-500ml
  - 水温范围：85-96℃
  - 每步水量总和 = 总水量

---

### 1.2 方案编辑/删除

**任务清单**:
- [ ] 方案详情页添加"编辑"按钮（仅自定义方案）
- [ ] 编辑时预填充现有数据
- [ ] 保存覆盖原方案
- [ ] 方案详情页添加"删除"按钮
- [ ] 删除需二次确认

**验收标准**:
- [ ] 预设方案不显示编辑/删除按钮
- [ ] 编辑时数据正确预填充
- [ ] 删除后方案从列表消失
- [ ] 删除后相关历史记录保留但标记方案已删除

**时间**: 2 天

**关键逻辑**:
```javascript
// 判断是否可编辑
const canEdit = computed(() => {
  return recipe.value && !recipe.value.isPreset;
});

// 删除确认
const confirmDelete = async () => {
  const confirmed = await Modal.confirm({
    title: '删除方案',
    message: '删除后无法恢复，相关历史记录将保留但标记为"方案已删除"',
    confirmText: '确认删除',
    cancelText: '取消'
  });

  if (confirmed) {
    await recipeStore.deleteRecipe(recipe.value.recipeId);
    router.push('/');
  }
};
```

---

## 2. 咖啡豆库（Coffee Bean Library）

### 2.1 豆子档案管理（beanStore）

**任务清单**:
- [ ] 创建 `beanStore.js`
- [ ] 定义 CoffeeBean 数据结构（见 PRD 2.4）
- [ ] 实现 Actions：
  - [ ] `createBean(data)` - 创建豆子档案
  - [ ] `updateBean(id, data)` - 更新档案
  - [ ] `deleteBean(id)` - 删除档案
  - [ ] `getAllBeans()` - 获取所有豆子
- [ ] 配置 localStorage 持久化

**验收标准**:
- [ ] 豆子档案包含完整信息（产地、处理法、烘焙度等）
- [ ] 数据持久化到 localStorage
- [ ] 支持关联冲煮记录

**时间**: 2 天

**文件位置**:
```
src/stores/beanStore.js
```

**数据结构**:
```javascript
{
  beanId: String,              // 唯一ID
  name: String,                // "埃塞俄比亚 耶加雪菲"
  origin: String,              // "埃塞俄比亚"
  region: String,              // "耶加雪菲"
  variety: String,             // "原生种"
  process: String,             // "水洗"/"日晒"/"蜜处理"
  roastLevel: String,          // "浅烘焙"/"中烘焙"/"深烘焙"
  roastDate: Date,             // 烘焙日期
  purchaseDate: Date,          // 购买日期
  weight: Number,              // 剩余重量（克）
  notes: String,               // 备注
  imageUrl: String,            // 照片
  brewRecords: String[],       // 关联的冲煮记录ID
  createdAt: Date,
}
```

---

### 2.2 豆子列表和详情页面

**任务清单**:
- [ ] 创建 `BeansView.vue`（豆子列表）
- [ ] 创建 `BeanDetail.vue`（豆子详情）
- [ ] 显示豆子卡片（名称、产地、烘焙度、剩余重量）
- [ ] 豆子详情显示完整信息
- [ ] 显示关联的冲煮记录
- [ ] "新建豆子" 按钮
- [ ] "编辑/删除" 按钮

**验收标准**:
- [ ] 豆子列表按购买日期倒序
- [ ] 剩余重量 < 50g 时标记提醒
- [ ] 烘焙日期超过 30 天时提示新鲜度
- [ ] 关联记录可点击查看

**时间**: 3 天

**文件位置**:
```
src/views/BeansView.vue
src/components/beans/BeanDetail.vue
```

**UI 提示逻辑**:
```javascript
// 新鲜度提示
const freshnessWarning = computed(() => {
  const daysSinceRoast = Math.floor(
    (Date.now() - new Date(bean.value.roastDate)) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceRoast > 60) return { level: 'danger', text: '已过最佳赏味期' };
  if (daysSinceRoast > 30) return { level: 'warning', text: '建议尽快使用' };
  return { level: 'success', text: '新鲜' };
});

// 剩余重量提示
const weightWarning = computed(() => {
  if (bean.value.weight < 50) return { level: 'warning', text: '库存不足' };
  return null;
});
```

---

### 2.3 冲煮记录关联豆子

**任务清单**:
- [ ] 品鉴记录页面添加豆子选择器
- [ ] 支持选择已有豆子或快速创建
- [ ] 记录保存时关联豆子 ID
- [ ] 豆子详情页显示使用记录

**验收标准**:
- [ ] 可从下拉列表选择豆子
- [ ] 可快速创建新豆子（简化表单）
- [ ] 关联关系正确保存
- [ ] 豆子详情正确显示使用次数

**时间**: 2 天

**UI 交互**:
```vue
<template>
  <div class="bean-selector">
    <label>选择咖啡豆</label>

    <!-- 下拉选择 -->
    <select v-model="selectedBeanId" class="bean-select">
      <option value="">不关联咖啡豆</option>
      <option
        v-for="bean in beanStore.getAllBeans()"
        :key="bean.beanId"
        :value="bean.beanId"
      >
        {{ bean.name }} (剩余 {{ bean.weight }}g)
      </option>
    </select>

    <!-- 快速创建 -->
    <button
      class="btn-quick-create"
      @click="showQuickCreateModal = true"
    >
      + 快速添加新豆子
    </button>

    <!-- 快速创建模态框（简化表单：仅名称、产地、烘焙度） -->
    <Modal v-if="showQuickCreateModal" @close="showQuickCreateModal = false">
      <QuickBeanForm @created="onBeanCreated" />
    </Modal>
  </div>
</template>
```

---

## 3. 照片上传

### 3.1 图片压缩和存储

**任务清单**:
- [ ] 集成图片压缩库（browser-image-compression）
- [ ] 实现照片上传功能：
  - [ ] 选择照片（相机/相册）
  - [ ] 压缩到 < 500KB
  - [ ] 转为 Base64 存储或使用 IndexedDB
- [ ] 豆子档案添加照片字段
- [ ] 品鉴记录添加照片字段

**验收标准**:
- [ ] 照片压缩后 < 500KB
- [ ] 压缩不明显影响画质
- [ ] 支持预览和删除
- [ ] 数据存储不超过 5MB（建议限制照片数量）

**时间**: 3 天

**文件位置**:
```
src/utils/imageCompression.js
src/components/common/ImageUploader.vue
```

**实现示例**:
```javascript
// utils/imageCompression.js
import imageCompression from 'browser-image-compression';

export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.5,              // 最大 500KB
    maxWidthOrHeight: 1920,      // 最大宽/高
    useWebWorker: true,          // 使用 Web Worker
    fileType: 'image/jpeg',      // 输出格式
    initialQuality: 0.8          // 初始质量
  };

  try {
    const compressedFile = await imageCompression(file, options);

    // 转为 Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    console.error('图片压缩失败:', error);
    throw error;
  }
}
```

**存储策略**:
- 小于 5MB：存储在 localStorage（Base64）
- 大于 5MB：建议用户删除部分照片或使用 IndexedDB
- 每个豆子档案：最多 1 张照片
- 每条冲煮记录：最多 1 张照片

---

## 4. 方案筛选和搜索

**任务清单**:
- [ ] 首页添加搜索框
- [ ] 支持按方案名称搜索
- [ ] 添加筛选器：
  - [ ] 按器具筛选（V60、Chemex、爱乐压等）
  - [ ] 按难度筛选（初级、中级、高级）
  - [ ] 按标签筛选（浅烘焙、果香调等）
- [ ] 筛选结果实时更新

**验收标准**:
- [ ] 搜索支持拼音和模糊匹配
- [ ] 筛选器可多选
- [ ] 筛选条件可清除
- [ ] 无结果时显示提示

**时间**: 2 天

**实现示例**:
```vue
<template>
  <div class="recipe-filter-bar">
    <!-- 搜索框 -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="搜索方案名称..."
      class="search-input"
    />

    <!-- 筛选器 -->
    <div class="filters">
      <!-- 器具筛选 -->
      <div class="filter-group">
        <label>器具</label>
        <div class="filter-options">
          <button
            v-for="device in devices"
            :key="device"
            :class="{ active: selectedDevices.includes(device) }"
            @click="toggleDevice(device)"
          >
            {{ device }}
          </button>
        </div>
      </div>

      <!-- 难度筛选 -->
      <div class="filter-group">
        <label>难度</label>
        <div class="filter-options">
          <button
            v-for="level in ['初级', '中级', '高级']"
            :key="level"
            :class="{ active: selectedLevels.includes(level) }"
            @click="toggleLevel(level)"
          >
            {{ level }}
          </button>
        </div>
      </div>

      <!-- 清除筛选 -->
      <button
        v-if="hasActiveFilters"
        class="btn-clear-filters"
        @click="clearFilters"
      >
        清除筛选
      </button>
    </div>
  </div>

  <!-- 筛选结果 -->
  <div class="recipe-grid">
    <RecipeCard
      v-for="recipe in filteredRecipes"
      :key="recipe.recipeId"
      :recipe="recipe"
    />

    <!-- 无结果提示 -->
    <div v-if="filteredRecipes.length === 0" class="empty-state">
      <p>未找到符合条件的方案</p>
      <button @click="clearFilters">清除筛选</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRecipeStore } from '@/stores/recipeStore';

const recipeStore = useRecipeStore();

const searchQuery = ref('');
const selectedDevices = ref([]);
const selectedLevels = ref([]);

const devices = ['V60', 'Chemex', 'Kalita Wave', '爱乐压'];

// 筛选逻辑
const filteredRecipes = computed(() => {
  let recipes = recipeStore.getAllRecipes();

  // 搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    recipes = recipes.filter(r =>
      r.name.toLowerCase().includes(query)
    );
  }

  // 器具筛选
  if (selectedDevices.value.length > 0) {
    recipes = recipes.filter(r =>
      selectedDevices.value.includes(r.device)
    );
  }

  // 难度筛选
  if (selectedLevels.value.length > 0) {
    recipes = recipes.filter(r =>
      selectedLevels.value.includes(r.difficulty)
    );
  }

  return recipes;
});

const hasActiveFilters = computed(() =>
  searchQuery.value ||
  selectedDevices.value.length > 0 ||
  selectedLevels.value.length > 0
);

const toggleDevice = (device) => {
  const index = selectedDevices.value.indexOf(device);
  if (index > -1) {
    selectedDevices.value.splice(index, 1);
  } else {
    selectedDevices.value.push(device);
  }
};

const toggleLevel = (level) => {
  const index = selectedLevels.value.indexOf(level);
  if (index > -1) {
    selectedLevels.value.splice(index, 1);
  } else {
    selectedLevels.value.push(level);
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedDevices.value = [];
  selectedLevels.value = [];
};
</script>
```

---

## P1 总验收标准

### 功能完整性验收

- [ ] **自定义方案**：可创建、编辑、删除自定义方案
- [ ] **方案编辑器**：步骤拖拽排序流畅
- [ ] **咖啡豆库**：正常管理（增删改查）
- [ ] **记录关联**：冲煮记录正确关联豆子
- [ ] **照片上传**：照片上传和显示正常
- [ ] **筛选搜索**：方案搜索和筛选准确

### 用户体验验收

- [ ] **表单验证**：所有输入正确验证，错误提示清晰
- [ ] **拖拽流畅**：步骤拖拽无卡顿，实时反馈
- [ ] **照片压缩**：压缩不明显影响画质
- [ ] **搜索速度**：搜索结果实时更新，无延迟

### 数据完整性验收

- [ ] **方案持久化**：自定义方案正确保存和恢复
- [ ] **豆子关联**：豆子与记录的关联关系正确
- [ ] **照片存储**：照片正确存储和检索
- [ ] **筛选准确性**：筛选结果与条件匹配

### 性能验收

- [ ] **照片加载**：照片加载 < 1s
- [ ] **搜索性能**：100+ 方案搜索 < 500ms
- [ ] **存储限制**：照片总大小 < 5MB

---

## 📚 相关文档

- [P0 MVP 清单](./P0-MVP-Checklist.md) - 前置阶段
- [P2 专业功能清单](./P2-Advanced-Checklist.md) - 后续阶段
- [完整 PRD](./v2-feature-prd.md) - 产品需求文档
- [文档索引](./README.md) - 返回文档总览

---

## 🔄 下一步

P1 阶段完成并通过验收后：
1. 填写验收报告
2. 修复所有缺陷
3. 进入 [P2 阶段](./P2-Advanced-Checklist.md) - 专业分析功能

---

**最后更新**: 2026-01-16
**维护者**: Claude
