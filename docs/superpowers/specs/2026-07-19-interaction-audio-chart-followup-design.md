# 互动、图表与默认音乐跟进设计

## 目标

在现有故事网站的视觉语言和内容顺序上，完成本轮反馈：首屏保留荧光棒但移除“轻点继续”文案；首个选择区使用更清晰、朝向选项的手指提示；数据黑板 03 的图表保持与其他图表统一尺寸；在照片墙后加入访谈高频词图表；结语段落进入视口时逐段淡入并轻微上移；背景音乐保持默认开启，并在浏览器拦截自动播放时于首次用户手势重试。

## 设计

- `DialogBox` 只保留 `.game-click-hint i` 图形，不再渲染提示文字。
- `ChoiceList` 的引导图形改成向下指向的手指，提示位于选项列表正常文档流中，预留空间且不覆盖按钮；减少动效时停用动画。
- `DataBlackboardSection` 继续复用统一 `InlineDataChart`，不为 03 额外设置尺寸；高频词图表作为照片墙之后、声音墙之前的独立图表卡片插入。
- `ClosingReflectionSection` 为标题和段落添加 IntersectionObserver 驱动的 reveal 类，首次进入视口后保持可见，并响应 `prefers-reduced-motion`。
- `AmbientSoundController` 仍由现有开关控制 Howl 生命周期。开启状态创建音乐并尝试播放；在 `pointerdown`、`keydown`、`touchstart` 等首次用户手势中检查播放状态并重试，关闭时清理监听和淡出计时器。

## 验证

源代码验证器检查提示文案已移除、向下手指标记、统一图表尺寸、高频词 URL 和正确插入顺序、结语 reveal 标记，以及音乐首次手势重试逻辑。随后运行 TypeScript、lint、生产构建和 Playwright 桌面/移动端检查。
