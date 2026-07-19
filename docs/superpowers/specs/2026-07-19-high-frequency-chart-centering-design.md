# 高频词图表内容居中设计

## 根因

“访谈内容高频词词云”使用跨域 Dycharts iframe。外层卡片已经与其他图表保持一致，但 Dycharts 的固定画布宽度贴在 iframe 左侧，桌面端因此在卡片右侧留下明显空白。

## 方案

仅为 `.inline-data-chart--standalone` 的 iframe 设置 `width: min(100%, 920px)`，并使用 `left: 50%` 与 `translateX(-50%)` 在 viewport 内水平居中。卡片尺寸、图表高度、标题和数据内容保持不变；当 viewport 小于 920px 时 iframe 自动使用 100% 宽度，因此移动端不会出现横向溢出。

## 验证

- `npm run verify:update` 检查专用选择器包含居中定位、最大宽度和 100% 回退。
- Playwright 在桌面端和移动端测量 standalone figure、viewport、iframe 的中心点，确认 iframe 与 viewport 中心点误差不超过 1px，且卡片尺寸保持原有值。
- 运行 TypeScript、lint、构建和 `git diff --check`。
