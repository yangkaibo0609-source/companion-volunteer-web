# 高频词图表内容居中设计

## 根因

“访谈内容高频词词云”使用跨域 Dycharts iframe。外层卡片已经与其他图表保持一致，但 Dycharts 的固定画布宽度贴在 iframe 左侧，桌面端因此在卡片右侧留下明显空白。

## 方案

仅为 `.inline-data-chart--standalone` 的 iframe 保持 `width: 100%`，清除基础 `inset: 0` 带来的 `right` 约束，并使用 `left: 8.333%`、`transform: none` 向右平移约 1/12 宽度。Dycharts 内部约按 iframe 的 5/6 宽度绘制固定画布，这个偏移会让左右空白相等，不放大、不裁切词云内容；父级继续裁切溢出，卡片尺寸、图表高度、标题和数据内容保持不变。

## 验证

- `npm run verify:update` 检查专用选择器包含居中定位、最大宽度和 100% 回退。
- Playwright 在桌面端和移动端测量 standalone figure、viewport、iframe 的中心点，确认 iframe 与 viewport 中心点误差不超过 1px，且卡片尺寸保持原有值。
- 运行 TypeScript、lint、构建和 `git diff --check`。
