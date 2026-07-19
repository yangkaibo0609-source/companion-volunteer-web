# 高频词图表内容居中 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将访谈高频词图表 iframe 的固定画布水平居中到现有卡片中，同时保持卡片尺寸和其他图表不变。

**Architecture:** 复用现有 `.inline-data-chart--standalone` 标记，在 CSS 层只作用于该卡片的 viewport iframe。iframe 在宽屏上限制为 Dycharts 的实际画布宽度并以 50% 定位，窄屏上由 `min(100%, 920px)` 自动降为容器宽度。

**Tech Stack:** React 19, TypeScript, CSS, Node assertion script, Playwright CLI.

---

### Task 1: Add the regression assertion

**Files:**
- Modify: `scripts/verify-requested-update.mjs`

- [x] **Step 1: Write the failing assertion**

```js
assert.match(css, /\.inline-data-chart--standalone \.inline-data-chart__viewport iframe\s*\{[^}]*left:\s*50%;[^}]*transform:\s*translateX\(-50%\);[^}]*width:\s*min\(100%,\s*920px\)/s)
```

- [x] **Step 2: Run the verifier and confirm it fails for the missing CSS rule**

Run: `npm run verify:update`

Expected: FAIL at the new regular expression assertion because the current stylesheet has no standalone iframe centering rule.

### Task 2: Center only the high-frequency chart iframe

**Files:**
- Modify: `src/index.css` near the existing `.inline-data-chart--standalone` rules

- [ ] **Step 1: Add the minimal CSS rule**

```css
.inline-data-chart--standalone .inline-data-chart__viewport iframe {
  left: 50%;
  transform: translateX(-50%);
  width: min(100%, 920px);
}
```

- [ ] **Step 2: Run the verifier and confirm it passes**

Run: `npm run verify:update`

Expected: `Requested update assertions passed`.

### Task 3: Browser verification and repository checks

**Files:**
- No additional source files

- [ ] **Step 1: Open the summary flow in Playwright and capture desktop measurements**

Navigate to `http://127.0.0.1:4173/?qa=summary`, reach the data section, then evaluate the standalone figure, viewport, and iframe rectangles. Confirm the iframe center is within 1px of the viewport center and capture `output/playwright/highfreq-centered-desktop.png`.

- [ ] **Step 2: Repeat at a mobile viewport**

Use a 390px-wide viewport. Confirm the iframe width equals the viewport width, no horizontal overflow is introduced, and capture `output/playwright/highfreq-centered-mobile.png`.

- [ ] **Step 3: Run the full checks**

Run `npx tsc -b --pretty false`, `npm run lint`, `npm run build`, and `git diff --check`. Remove temporary `output/` artifacts after inspection.
