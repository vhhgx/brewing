# 开发待办事项

**更新时间**: 2026-01-16 18:40
**当前进度**: 44% (7/16 完成)

---

## 🔥 优先级 1 - 立即开始（核心流程）

### 1. RecipeDetail.vue - 方案详情页
**预计时间**: 30分钟
**文件位置**: `src/components/recipes/RecipeDetail.vue`

**功能清单**:
- [ ] 显示方案名称和基本参数
- [ ] 显示分段步骤列表
- [ ] "开始冲煮" 按钮跳转
- [ ] 返回按钮

**参考代码**: 见 `development-roadmap.md` 第 2.3 节

---

### 2. BrewingView.vue - 冲煮配置页
**预计时间**: 30分钟
**文件位置**: `src/views/BrewingView.vue`

**功能清单**:
- [ ] 方案参数预览
- [ ] 准备清单（可选）
- [ ] "开始计时" 按钮
- [ ] 调用 brewingStore.startBrewing()

**参考代码**: 见 `development-roadmap.md` 第 3.3 节

---

### 3. BrewTimer.vue - 圆环计时器
**预计时间**: 1小时
**文件位置**: `src/components/brewing/BrewTimer.vue`

**功能清单**:
- [ ] SVG 圆环进度条
- [ ] MM:SS 时间显示
- [ ] 进度百分比计算
- [ ] 颜色根据进度变化

**技术要点**:
```javascript
// 圆环 strokeDashoffset 计算
const circumference = 2 * Math.PI * radius
const dashOffset = circumference - (progress / 100) * circumference
```

**参考代码**: 见 `development-roadmap.md` 第 3.5 节

---

### 4. BrewingBottomSheet.vue - 冲煮面板（简化版）
**预计时间**: 2小时
**文件位置**: `src/components/brewing/BrewingBottomSheet.vue`

**功能清单**:
- [ ] 三种状态（Hidden、Collapsed、Expanded）
- [ ] 简单的切换按钮（不需要拖动手势）
- [ ] 收起状态：显示步骤名、计时、暂停按钮
- [ ] 展开状态：显示完整计时器、水量提示、操作按钮

**简化建议**:
- 先不实现拖动手势（VueUse）
- 使用按钮切换状态即可
- 完成基本功能后再优化交互

**参考代码**: 见 `development-roadmap.md` 第 3.4 节

---

## ⭐ 优先级 2 - 本周完成（品鉴闭环）

### 5. DimensionRating.vue - 维度评分
**预计时间**: 1小时
**文件位置**: `src/components/tasting/DimensionRating.vue`

**功能清单**:
- [ ] 5个维度滑块（香气、醇厚度、酸度、甜度、余韵）
- [ ] 范围 1-5，步长 0.5
- [ ] 实时显示分数

**参考代码**: 见 `development-roadmap.md` 第 4.3 节

---

### 6. FlavorWheel.vue - 风味轮（简化版）
**预计时间**: 2小时
**文件位置**: `src/components/tasting/FlavorWheel.vue`

**功能清单**:
- [ ] 快捷标签选择（不需要完整 SVG 圆环）
- [ ] 分类列表 + 细分选择
- [ ] 已选标签显示和删除

**简化建议**:
- 先用按钮列表代替 SVG 圆环
- 完成基本功能后再实现完整风味轮

---

### 7. TastingNotesView.vue - 品鉴记录页
**预计时间**: 1.5小时
**文件位置**: `src/views/TastingNotesView.vue`

**功能清单**:
- [ ] 显示冲煮参数（只读）
- [ ] 集成 FlavorWheel 组件
- [ ] 集成 DimensionRating 组件
- [ ] 星级评分
- [ ] 自定义笔记输入
- [ ] 保存按钮

**参考代码**: 见 `development-roadmap.md` 第 4.4 节

---

### 8. HistoryView.vue - 历史记录列表
**预计时间**: 1小时
**文件位置**: `src/views/HistoryView.vue`

**功能清单**:
- [ ] 时间倒序显示记录
- [ ] 显示方案名、日期、评分、风味标签
- [ ] 点击查看详情
- [ ] "再来一次" 按钮

**参考代码**: 见 `development-roadmap.md` 第 5.1 节

---

### 9. RecordDetail.vue - 记录详情
**预计时间**: 1小时
**文件位置**: `src/components/tasting/RecordDetail.vue`

**功能清单**:
- [ ] 显示完整冲煮信息
- [ ] 显示风味标签和评分
- [ ] "再来一次" 按钮
- [ ] 删除按钮（需确认）

**参考代码**: 见 `development-roadmap.md` 第 5.2 节

---

## 📦 优先级 3 - 完善功能

### 10. ProfileView.vue - 个人中心
**预计时间**: 30分钟
**文件位置**: `src/views/ProfileView.vue`

**功能清单**:
- [ ] 基础信息展示
- [ ] 统计数据（冲煮次数、最常用方案）
- [ ] 设置选项（可选）

---

### 11. 提示音文件
**预计时间**: 10分钟
**文件位置**: `public/sounds/step-complete.mp3`

**要求**:
- 文件大小 < 50KB
- 清晰悦耳
- 可从免费音效网站下载

---

## 🎯 完成标准

每个组件完成后需要：
1. ✅ 代码无语法错误
2. ✅ 在浏览器中可正常运行
3. ✅ 符合设计规范（44x44px 触摸区域）
4. ✅ 响应式适配（至少手机端）
5. ✅ 与 Store 正确交互

---

## 🚀 快速启动

```bash
# 启动开发服务器
npm run dev

# 访问首页
http://localhost:5173/
```

---

## 📚 参考文档

- [development-roadmap.md](docs/development-roadmap.md) - 完整技术实现细节
- [PROGRESS.md](docs/PROGRESS.md) - 当前进度报告
- [v2-feature-prd.md](docs/v2-feature-prd.md) - 产品需求文档

---

**预计剩余工时**: 8-10 小时
**建议完成时间**: 本周末前完成优先级 1-2

---

## ✅ 已完成检查清单

- [x] 基础 UI 组件库（7个）
- [x] recipeStore（方案管理）
- [x] brewingStore（计时逻辑）
- [x] tastingStore（记录管理）
- [x] constants.js（预设数据）
- [x] HomeView + RecipeCard（首页）
- [x] 路由配置（7个路由）

**当前可运行**: `npm run dev` → 首页列表正常显示
