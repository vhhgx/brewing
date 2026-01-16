# P2 阶段：专业分析功能 - 开发清单

| 文档版本 | 阶段 | 预计工作量 | 优先级 | 状态 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | P2-Advanced | 2-3 周 | ⚪ 中 | 未计划 |

---

## 🎯 开发目标

为进阶用户提供专业工具和数据分析：
1. 金杯萃取计算器（科学评估）
2. 数据统计和可视化（使用习惯分析）
3. 记录对比功能（参数优化）
4. 数据导出/导入（备份与迁移）
5. PWA 离线支持（随时随地使用）

**前置条件**: P1 阶段完成并通过验收
**交付标准**: 通过 P2 总验收标准（见文档末尾）

---

## 📋 任务概览

| 模块 | 任务数 | 预计天数 | 状态 |
| :--- | :--- | :--- | :--- |
| 1. 金杯萃取计算器 | 1 | 4天 | 🔴 未开始 |
| 2. 数据统计和可视化 | 1 | 5天 | 🔴 未开始 |
| 3. 记录对比功能 | 1 | 4天 | 🔴 未开始 |
| 4. 数据导出/导入 | 1 | 3天 | 🔴 未开始 |
| 5. PWA 离线支持 | 1 | 2天 | 🔴 未开始 |
| **总计** | **5** | **~18天** | - |

---

## 1. 金杯萃取计算器

**任务清单**:
- [ ] 创建 `GoldenCupCalculator.vue`
- [ ] 输入参数：咖啡粉重、咖啡液重、TDS 值
- [ ] 计算萃取率和浓度
- [ ] 在金杯图表上标记当前结果
- [ ] 提供参数优化建议

**验收标准**:
- [ ] 计算结果准确（公式验证）
- [ ] 金杯图表清晰易读
- [ ] 标记点位置准确
- [ ] 建议文案专业且有用

**时间**: 4 天

**文件位置**:
```
src/views/GoldenCupCalculatorView.vue
src/utils/calculations.js
```

**计算公式**:
```javascript
// utils/calculations.js

/**
 * 计算萃取率
 * @param {number} coffeeWeight - 咖啡粉重（克）
 * @param {number} brewedCoffeeWeight - 咖啡液重（克）
 * @param {number} tds - 总溶解固体（%）
 * @returns {number} 萃取率（%）
 */
export function calculateExtractionYield(coffeeWeight, brewedCoffeeWeight, tds) {
  return (brewedCoffeeWeight * tds) / coffeeWeight;
}

/**
 * 计算浓度
 * @param {number} tds - 总溶解固体（%）
 * @returns {number} 浓度（%）
 */
export function calculateConcentration(tds) {
  return tds;
}

/**
 * 判断是否在金杯范围
 * @param {number} extractionYield - 萃取率（%）
 * @param {number} concentration - 浓度（%）
 * @returns {object} { isGolden, zone, suggestion }
 */
export function evaluateGoldenCup(extractionYield, concentration) {
  // 金杯标准：萃取率 18-22%，浓度 1.15-1.35%
  const isInExtractionRange = extractionYield >= 18 && extractionYield <= 22;
  const isInConcentrationRange = concentration >= 1.15 && concentration <= 1.35;

  if (isInExtractionRange && isInConcentrationRange) {
    return {
      isGolden: true,
      zone: 'golden',
      suggestion: '完美！您的冲煮参数在金杯范围内。'
    };
  }

  // 判断区域并给出建议
  if (extractionYield < 18) {
    return {
      isGolden: false,
      zone: 'under-extracted',
      suggestion: '萃取不足。建议：延长冲煮时间、提高水温、或使用更细的研磨。'
    };
  }

  if (extractionYield > 22) {
    return {
      isGolden: false,
      zone: 'over-extracted',
      suggestion: '过度萃取。建议：缩短冲煮时间、降低水温、或使用更粗的研磨。'
    };
  }

  if (concentration < 1.15) {
    return {
      isGolden: false,
      zone: 'weak',
      suggestion: '浓度偏低。建议：增加粉量或减少水量。'
    };
  }

  if (concentration > 1.35) {
    return {
      isGolden: false,
      zone: 'strong',
      suggestion: '浓度偏高。建议：减少粉量或增加水量。'
    };
  }
}
```

**金杯图表**:
- X 轴：浓度（0.8% - 1.6%）
- Y 轴：萃取率（15% - 25%）
- 金杯区域：绿色矩形（18-22% × 1.15-1.35%）
- 当前结果：红色标记点

---

## 2. 数据统计和可视化

**任务清单**:
- [ ] 创建 `StatsView.vue`（统计页面）
- [ ] 显示统计数据：
  - [ ] 本月冲煮次数
  - [ ] 最常用方案（Top 3）
  - [ ] 平均评分趋势（折线图）
  - [ ] 风味偏好分析（雷达图）
  - [ ] 器具使用分布（饼图）
- [ ] 支持时间范围选择（本周、本月、全部）

**验收标准**:
- [ ] 数据计算准确
- [ ] 图表清晰美观
- [ ] 时间范围筛选正常
- [ ] 空数据有提示

**时间**: 5 天

**文件位置**:
```
src/views/StatsView.vue
src/composables/useStatistics.js
```

**图表库推荐**: Chart.js 或 Apache ECharts

**统计指标**:

```javascript
// composables/useStatistics.js
import { computed } from 'vue';
import { useTastingStore } from '@/stores/tastingStore';
import { useRecipeStore } from '@/stores/recipeStore';

export function useStatistics(timeRange = 'month') {
  const tastingStore = useTastingStore();
  const recipeStore = useRecipeStore();

  // 过滤时间范围内的记录
  const filteredRecords = computed(() => {
    const now = Date.now();
    const ranges = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      all: Infinity
    };

    const rangeMs = ranges[timeRange] || ranges.month;

    return tastingStore.getAllRecords().filter(record =>
      now - new Date(record.timestamp).getTime() <= rangeMs
    );
  });

  // 1. 冲煮次数
  const totalBrews = computed(() => filteredRecords.value.length);

  // 2. 最常用方案 Top 3
  const topRecipes = computed(() => {
    const recipeCount = {};

    filteredRecords.value.forEach(record => {
      const recipeId = record.linkedRecipeId;
      recipeCount[recipeId] = (recipeCount[recipeId] || 0) + 1;
    });

    return Object.entries(recipeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([recipeId, count]) => ({
        recipe: recipeStore.getRecipeById(recipeId),
        count
      }));
  });

  // 3. 平均评分趋势（按天）
  const ratingTrend = computed(() => {
    const dailyRatings = {};

    filteredRecords.value.forEach(record => {
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      if (!dailyRatings[date]) {
        dailyRatings[date] = { total: 0, count: 0 };
      }
      dailyRatings[date].total += record.tastingNotes.overallScore;
      dailyRatings[date].count += 1;
    });

    return Object.entries(dailyRatings)
      .map(([date, { total, count }]) => ({
        date,
        avgRating: (total / count).toFixed(1)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  // 4. 风味偏好分析（Top 5 风味标签）
  const flavorPreferences = computed(() => {
    const flavorCount = {};

    filteredRecords.value.forEach(record => {
      record.tastingNotes.flavorTags.forEach(tag => {
        const key = tag.flavor;
        flavorCount[key] = (flavorCount[key] || 0) + 1;
      });
    });

    return Object.entries(flavorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([flavor, count]) => ({ flavor, count }));
  });

  // 5. 器具使用分布
  const deviceDistribution = computed(() => {
    const deviceCount = {};

    filteredRecords.value.forEach(record => {
      const recipe = recipeStore.getRecipeById(record.linkedRecipeId);
      if (recipe) {
        const device = recipe.device;
        deviceCount[device] = (deviceCount[device] || 0) + 1;
      }
    });

    return Object.entries(deviceCount).map(([device, count]) => ({
      device,
      count,
      percentage: ((count / totalBrews.value) * 100).toFixed(1)
    }));
  });

  return {
    totalBrews,
    topRecipes,
    ratingTrend,
    flavorPreferences,
    deviceDistribution
  };
}
```

---

## 3. 记录对比功能

**任务清单**:
- [ ] 历史记录页添加"对比"模式
- [ ] 支持选择 2-3 条记录
- [ ] 并排显示对比：
  - [ ] 参数差异（高亮不同）
  - [ ] 风味差异
  - [ ] 维度评分对比（雷达图叠加）
  - [ ] 整体评分对比
- [ ] 导出对比报告（可选）

**验收标准**:
- [ ] 可选择 2-3 条记录对比
- [ ] 差异高亮明显
- [ ] 雷达图叠加清晰
- [ ] 对比结论有参考价值

**时间**: 4 天

**文件位置**:
```
src/views/CompareRecordsView.vue
src/components/tasting/RecordComparison.vue
```

**UI 布局**:
```
对比页面布局：
┌─────────────────────────────────────┐
│  【对比模式】 选择 2-3 条记录对比    │
├─────────────────────────────────────┤
│  记录 1       |  记录 2       |  记录 3  │
│  V60 四六法   |  Chemex      |  V60 四六法 │
│  2026-01-15  |  2026-01-14  |  2026-01-10│
├─────────────────────────────────────┤
│  【参数对比】                        │
│  粉量:  20g   |  22g ⚠      |  20g     │
│  水温:  92℃   |  92℃        |  90℃ ⚠   │
│  时长:  3:20  |  4:10 ⚠     |  3:15    │
├─────────────────────────────────────┤
│  【维度评分对比】（雷达图叠加）       │
│        [雷达图：3 条记录叠加]         │
├─────────────────────────────────────┤
│  【风味差异】                        │
│  记录 1: 果香-柑橘、花香-茉莉         │
│  记录 2: 果香-浆果、甜感-焦糖         │
│  记录 3: 果香-柑橘、花香-茉莉 (与1相同) │
├─────────────────────────────────────┤
│  【整体评分】                        │
│  记录 1: ⭐⭐⭐⭐⭐ (5.0)            │
│  记录 2: ⭐⭐⭐⭐☆ (4.5) ⬇         │
│  记录 3: ⭐⭐⭐⭐⭐ (5.0)            │
├─────────────────────────────────────┤
│  【对比结论】                        │
│  • 记录 2 使用更多粉量和更长时间     │
│  • 记录 3 使用较低水温但评分相同     │
│  • 建议：保持记录 1 的参数配置       │
└─────────────────────────────────────┘
```

---

## 4. 数据导出/导入

**任务清单**:
- [ ] 实现数据导出为 JSON
- [ ] 支持选择导出内容（方案、记录、豆子）
- [ ] 实现数据导入（JSON 文件）
- [ ] 导入前校验数据格式
- [ ] 冲突处理（覆盖/跳过）

**验收标准**:
- [ ] 导出的 JSON 格式正确
- [ ] 导入能还原完整数据
- [ ] 数据校验准确
- [ ] 冲突处理符合预期

**时间**: 3 天

**文件位置**:
```
src/utils/dataExport.js
src/utils/dataImport.js
src/views/SettingsView.vue
```

**导出实现**:
```javascript
// utils/dataExport.js
import { useRecipeStore } from '@/stores/recipeStore';
import { useTastingStore } from '@/stores/tastingStore';
import { useBeanStore } from '@/stores/beanStore';

export function exportData(options = {}) {
  const {
    includeRecipes = true,
    includeTastingRecords = true,
    includeBeans = true
  } = options;

  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    data: {}
  };

  if (includeRecipes) {
    data.data.recipes = useRecipeStore().getAllRecipes();
  }

  if (includeTastingRecords) {
    data.data.tastingRecords = useTastingStore().getAllRecords();
  }

  if (includeBeans) {
    data.data.beans = useBeanStore().getAllBeans();
  }

  // 转为 JSON 并下载
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `coffee-brewing-data-${Date.now()}.json`;
  a.click();

  URL.revokeObjectURL(url);
}
```

**导入实现**:
```javascript
// utils/dataImport.js
export async function importData(file, options = {}) {
  const { conflictStrategy = 'skip' } = options; // 'skip' | 'overwrite'

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // 校验格式
    if (!data.version || !data.data) {
      throw new Error('无效的数据格式');
    }

    const results = {
      recipes: { success: 0, failed: 0, skipped: 0 },
      tastingRecords: { success: 0, failed: 0, skipped: 0 },
      beans: { success: 0, failed: 0, skipped: 0 }
    };

    // 导入方案
    if (data.data.recipes) {
      const recipeStore = useRecipeStore();
      for (const recipe of data.data.recipes) {
        try {
          const existing = recipeStore.getRecipeById(recipe.recipeId);

          if (existing && conflictStrategy === 'skip') {
            results.recipes.skipped++;
            continue;
          }

          recipeStore.saveRecipe(recipe);
          results.recipes.success++;
        } catch (error) {
          console.error('导入方案失败:', recipe.recipeId, error);
          results.recipes.failed++;
        }
      }
    }

    // 导入品鉴记录
    if (data.data.tastingRecords) {
      const tastingStore = useTastingStore();
      for (const record of data.data.tastingRecords) {
        try {
          const existing = tastingStore.getRecordById(record.brewRecordId);

          if (existing && conflictStrategy === 'skip') {
            results.tastingRecords.skipped++;
            continue;
          }

          tastingStore.saveRecord(record);
          results.tastingRecords.success++;
        } catch (error) {
          console.error('导入记录失败:', record.brewRecordId, error);
          results.tastingRecords.failed++;
        }
      }
    }

    // 导入咖啡豆
    if (data.data.beans) {
      const beanStore = useBeanStore();
      for (const bean of data.data.beans) {
        try {
          const existing = beanStore.getBeanById(bean.beanId);

          if (existing && conflictStrategy === 'skip') {
            results.beans.skipped++;
            continue;
          }

          beanStore.saveBean(bean);
          results.beans.success++;
        } catch (error) {
          console.error('导入豆子失败:', bean.beanId, error);
          results.beans.failed++;
        }
      }
    }

    return results;
  } catch (error) {
    console.error('导入失败:', error);
    throw error;
  }
}
```

---

## 5. PWA 离线支持

**任务清单**:
- [ ] 配置 PWA manifest.json
- [ ] 添加 Service Worker
- [ ] 缓存核心资源（HTML、CSS、JS）
- [ ] 离线时显示提示
- [ ] 支持添加到主屏幕

**验收标准**:
- [ ] 离线可正常使用核心功能
- [ ] 缓存策略合理（Cache First）
- [ ] 添加到主屏幕正常
- [ ] 图标和启动画面正确显示

**时间**: 2 天

**文件位置**:
```
public/manifest.json
public/sw.js
public/icons/ (多种尺寸图标)
```

**manifest.json**:
```json
{
  "name": "手冲咖啡冲泡助手",
  "short_name": "Coffee Brewing",
  "description": "手冲咖啡冲泡助手，提供精准计时、风味记录和品鉴分析",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFF8E7",
  "theme_color": "#6F4E37",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker**:
```javascript
// public/sw.js
const CACHE_NAME = 'coffee-brewing-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  '/assets/sounds/step-complete.mp3'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 拦截请求，使用缓存优先策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 缓存命中，返回缓存
      if (response) {
        return response;
      }

      // 缓存未命中，从网络获取
      return fetch(event.request).then((response) => {
        // 不缓存非 GET 请求或非 http(s) 协议
        if (
          event.request.method !== 'GET' ||
          !event.request.url.startsWith('http')
        ) {
          return response;
        }

        // 克隆响应并缓存
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});
```

**注册 Service Worker**:
```javascript
// main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}
```

---

## P2 总验收标准

### 功能完整性验收

- [ ] **金杯计算器**：计算准确，建议专业
- [ ] **数据统计**：图表清晰，数据准确
- [ ] **记录对比**：对比功能正常，差异明显
- [ ] **数据导出**：导出格式正确
- [ ] **数据导入**：导入还原完整，冲突处理正常
- [ ] **PWA**：离线正常使用，添加到主屏幕正常

### 用户体验验收

- [ ] **图表美观**：所有图表清晰易读
- [ ] **对比清晰**：差异高亮明显
- [ ] **导出快速**：导出 < 2s
- [ ] **离线提示**：离线状态有明确提示

### 性能验收

- [ ] **图表渲染**：图表渲染 < 1s
- [ ] **数据计算**：统计计算 < 500ms
- [ ] **缓存效率**：离线加载 < 3s

---

## 📚 相关文档

- [P0 MVP 清单](./P0-MVP-Checklist.md) - MVP 核心功能
- [P1 增强功能清单](./P1-Enhanced-Checklist.md) - 前置阶段
- [完整 PRD](./v2-feature-prd.md) - 产品需求文档
- [文档索引](./README.md) - 返回文档总览

---

## 🎉 项目完成

P2 阶段完成并通过验收后，整个项目开发完成！

**最后步骤**:
1. 填写验收报告
2. 修复所有缺陷
3. 准备产品发布

---

**最后更新**: 2026-01-16
**维护者**: Claude
