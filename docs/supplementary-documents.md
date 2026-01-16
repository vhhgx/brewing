# 补充文档


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



参照线路图文件，阅读p文档，生成（ - [ ] xxx）这种格式的单独的进度todo文件，详细描述每个需求功能点和技术细节