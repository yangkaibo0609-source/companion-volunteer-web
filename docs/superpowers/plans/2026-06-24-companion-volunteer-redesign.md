# Companion Volunteer Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有《成为一天陪护志愿者》互动网页重设计为“3D 陪护证开场 + galgame 剧情选择 + 信任值/精力值结算”的完整前端体验。

**Architecture:** 保留现有 Vite + React + TypeScript + Zustand 架构，重写乱码剧情数据和主要界面组件。开场使用 Three.js 渲染可拖拽的 3D 陪护证，进入游戏后使用素材包中的场景图和人物图构建 galgame 主界面。

**Tech Stack:** React 19、TypeScript、Vite、Tailwind v4、Zustand、Howler、GSAP、Three.js、Pillow 素材预处理脚本。

---

## 1. 设计结论

### 1.1 整体风格

采用“晴川浅夏”配色作为全站视觉基调：

| 角色 | 色值 | 用途 |
| --- | --- | --- |
| 主绿 | `#a5ca8b` | 主按钮、进度、信任正反馈、陪护证主体 |
| 嫩芽绿 | `#d0dd97` | 选项 hover、HUD 辅助底色、柔和高光 |
| 溪水白 | `#f8fae4` | 页面背景、卡片底色、对话框浅色按钮 |
| 麦穗黄 | `#f9de79` | 开始盖章、奖励提示、重要数值强调 |
| 深叶绿 | `#2f4d38` | 主文字、深色对话框、阴影色 |
| 挂绳青绿 | `#0d8f8f` | 陪护证挂绳、开场 3D 织带 |

视觉原则：

- 开场偏温暖、明亮、公益感。
- 游戏主界面偏 galgame，背景占满屏，对话框清晰稳定。
- 所有 UI 避免旧项目的米色偏重观感，统一转向浅绿、嫩黄、白绿组合。
- 不使用过重黑色遮罩，深色只用于对话框和可读性区域。

### 1.2 核心交互

第一屏不是普通按钮，而是 Three.js 3D 陪护证开场动画：

1. 活动室背景虚化，中央悬挂“陪护志愿者临时证”。
2. 陪护证轻微摆动，挂绳随鼠标/触摸有轻微张力。
3. 用户按住陪护证向下拉。
4. 拉动距离达到阈值后，陪护证翻面并出现麦穗黄“开始陪护任务”盖章。
5. 画面被吊牌向下拉开，进入第一幕 galgame 游戏界面。

游戏中主交互：

1. 每幕展示场景背景、人物立绘、对话文本。
2. 文本逐字出现，用户点击继续。
3. 出现选项后，用户选择行为。
4. 选项影响 `trustDelta` 和 `energyDelta`。
5. 显示短反馈、数值变化和一条陪护提示。
6. 五幕结束进入结算页。

---

## 2. 素材来源与映射

### 2.1 用户提供的新素材

| 文件 | 用途 |
| --- | --- |
| `C:/Users/Cxs07/Documents/xwechat_files/wxid_pxceedchm9il22_ce06/temp/RWTemp/2026-06/28df77d8f487a769c507c8e520783d9d/c01d841f630ef629540c2343e303312d.jpg` | 配色参考，“晴川浅夏”色板 |
| `C:/Users/Cxs07/AppData/Local/Temp/codex-clipboard-a1c98aae-ba4a-41f2-928a-14c496e83901.png` | 开场 3D 陪护证纹理参考 |

### 2.2 工作区素材包

素材包位置：

```text
C:/Users/Cxs07/Desktop/网页设计大赛/交互游戏图片(1)/交互游戏图片
```

素材映射：

| 源文件 | 目标文件名 | 用途 |
| --- | --- | --- |
| `场景一.png` | `src/assets/game/scenes/scene-01.png` | 第一幕：第一次见面 |
| `场景二.png` | `src/assets/game/scenes/scene-02.png` | 第二幕：无法融入的课堂/活动选择 |
| `场景三.png` | `src/assets/game/scenes/scene-03.png` | 第三幕：午餐时间 |
| `场景四.png` | `src/assets/game/scenes/scene-04.png` | 第四幕：音乐教室 |
| `场景五.png` | `src/assets/game/scenes/scene-05.png` | 第五幕：分别时刻 |
| `小男孩.png` | `src/assets/game/raw/boy-sheet.png` | 小宇姿态表 |
| `志愿者.png` | `src/assets/game/raw/volunteer-sheet.png` | 志愿者姿态表 |
| `志愿者和小男孩.png` | `src/assets/game/raw/duo-sheet.png` | 双人互动姿态表 |
| `小男孩和志愿者原始版.png` | `src/assets/game/raw/duo-original.png` | 备用双人图 |

### 2.3 人物姿态切片计划

当前人物素材是白底整张姿态表，没有透明通道。实施中先用 Pillow 做裁剪和近白色透明化，生成可用于 galgame 的 PNG 立绘。

目标输出：

```text
src/assets/game/characters/boy-first-meet.png
src/assets/game/characters/boy-overload.png
src/assets/game/characters/boy-meal.png
src/assets/game/characters/boy-refuse.png
src/assets/game/characters/boy-walk.png
src/assets/game/characters/boy-piano.png
src/assets/game/characters/volunteer-observe.png
src/assets/game/characters/volunteer-strict.png
src/assets/game/characters/volunteer-ignore.png
src/assets/game/characters/volunteer-prompt.png
src/assets/game/characters/volunteer-hug.png
src/assets/game/characters/duo-drawing.png
src/assets/game/characters/duo-comfort.png
```

切片策略：

- 第一阶段使用脚本自动裁剪和白底透明化。
- 如果透明化边缘不够干净，第二阶段改为 CSS 裁剪整张图作为临时实现。
- 最终交付优先使用透明 PNG，避免白底贴片破坏 galgame 观感。

---

## 3. 文件结构

### 3.1 新增文件

```text
src/assets/game/
src/assets/game/scenes/
src/assets/game/raw/
src/assets/game/characters/
src/assets/game/opening/volunteer-pass.png
src/components/opening/BadgeOpening3D.tsx
src/components/opening/useBadgeDrag.ts
src/components/game/GameScene.tsx
src/components/game/DialogBox.tsx
src/components/game/ChoiceList.tsx
src/components/game/CharacterLayer.tsx
src/components/game/GameHud.tsx
src/components/game/SceneFeedback.tsx
src/components/summary/SummaryPage.tsx
src/components/summary/ChoiceReview.tsx
src/data/gameScript.ts
src/data/assetMap.ts
src/data/gameTypes.ts
src/utils/gameScore.ts
scripts/extract-character-assets.py
```

### 3.2 修改文件

```text
package.json
package-lock.json
src/App.tsx
src/index.css
src/store/gameStore.ts
src/hooks/useSound.ts
src/utils/assetPreload.ts
```

### 3.3 可删除或逐步替换的旧文件

这些旧文件可先保留，等新流程完成后再清理：

```text
src/components/opening/OpeningPage.tsx
src/components/scene/SceneStage.tsx
src/components/scene/ChoicePanel.tsx
src/components/scene/HotspotLayer.tsx
src/components/scene/ResultOverlay.tsx
src/components/scene/SceneBackground.tsx
src/components/scene/TrustLight.tsx
src/components/report/ReportPage.tsx
src/components/report/ChoiceTimeline.tsx
src/components/report/TrustCurve.tsx
src/components/data-story/DataScrollStory.tsx
src/data/scenes.ts
src/data/endings.ts
```

---

## 4. 数据模型

### 4.1 `src/data/gameTypes.ts`

计划定义：

```ts
export type GamePhase = 'loading' | 'opening' | 'scene' | 'feedback' | 'summary'

export type ChoiceId = 'A' | 'B' | 'C' | 'D'

export type ChoiceTone = 'forceful' | 'gentle' | 'observing' | 'avoidant'

export type CharacterPoseKey =
  | 'boy-first-meet'
  | 'boy-overload'
  | 'boy-meal'
  | 'boy-refuse'
  | 'boy-walk'
  | 'boy-piano'
  | 'volunteer-observe'
  | 'volunteer-strict'
  | 'volunteer-ignore'
  | 'volunteer-prompt'
  | 'volunteer-hug'
  | 'duo-drawing'
  | 'duo-comfort'

export type SceneAssetKey = 'scene-01' | 'scene-02' | 'scene-03' | 'scene-04' | 'scene-05'

export type SceneLine = {
  speaker: '旁白' | '工作人员' | '小宇' | '你'
  text: string
  pose?: CharacterPoseKey
}

export type SceneChoice = {
  id: ChoiceId
  label: string
  trustDelta: number
  energyDelta: number
  result: string
  careTip: string
  tone: ChoiceTone
}

export type GameSceneConfig = {
  id: string
  chapter: number
  title: string
  subtitle: string
  background: SceneAssetKey
  defaultPoses: CharacterPoseKey[]
  lines: SceneLine[]
  choices: SceneChoice[]
  recommendedChoiceId: ChoiceId
}

export type ChoiceRecord = {
  sceneId: string
  sceneTitle: string
  choiceId: ChoiceId
  choiceLabel: string
  trustDelta: number
  energyDelta: number
  result: string
  careTip: string
  tone: ChoiceTone
}

export type EndingLevel = 'excellent' | 'warm' | 'hard' | 'misunderstood'
```

### 4.2 `src/data/gameScript.ts`

用 Word 文档 `交互游戏(2).docx` 中的新版流程重写五幕剧情。注意：

- `trust` 初始值为 `50`。
- `energy` 初始值为 `100`。
- 选项中的“精力值：无变化”统一记为 `0`。
- 第四幕 C 选项文档写“好感度 +20”，实现中统一作为 `trustDelta: 20`。
- 第五幕 D 缺少结果文案，补成短反馈：“你匆忙离开，小宇刚刚伸出的手慢慢放下。”，避免空结果。

结局规则：

```ts
export function getEndingLevel(trust: number, energy: number): EndingLevel {
  if (trust >= 90 && energy >= 60) return 'excellent'
  if (trust >= 70 && trust < 90 && energy >= 60) return 'warm'
  if (trust >= 50 && trust <= 69 && energy < 60) return 'hard'
  return 'misunderstood'
}
```

---

## 5. 状态管理

### 5.1 `src/store/gameStore.ts`

Store 需要管理：

```ts
type GameStore = {
  phase: GamePhase
  currentSceneIndex: number
  currentLineIndex: number
  trust: number
  energy: number
  selectedChoices: ChoiceRecord[]
  activeFeedback: ChoiceRecord | null
  soundEnabled: boolean
  reducedMotion: boolean
  completeOpening: () => void
  continueLine: () => void
  selectChoice: (choiceId: ChoiceId) => void
  continueAfterFeedback: () => void
  restart: () => void
  setSoundEnabled: (value: boolean) => void
  setReducedMotion: (value: boolean) => void
}
```

关键行为：

- `completeOpening()`：将 `phase` 从 `opening` 切到 `scene`。
- `continueLine()`：当前幕文本未结束则递增 `currentLineIndex`。
- `selectChoice(choiceId)`：写入选择记录、更新信任值和精力值、进入 `feedback`。
- `continueAfterFeedback()`：如果不是最后一幕，进入下一幕第一句；如果是最后一幕，进入 `summary`。
- `restart()`：重置信任值、精力值、当前幕、文本行和选择记录。

---

## 6. 开场 3D 陪护证

### 6.1 依赖

新增依赖：

```powershell
npm install three
npm install -D @types/three
```

### 6.2 `src/components/opening/BadgeOpening3D.tsx`

职责：

- 创建 Three.js `Scene`、`PerspectiveCamera`、`WebGLRenderer`。
- 使用 `TextureLoader` 加载 `src/assets/game/opening/volunteer-pass.png`。
- 使用 `Shape` + `ExtrudeGeometry` 生成带圆角和厚度的陪护证卡片。
- 正面贴陪护证纹理，背面使用浅绿材质。
- 使用 `MeshStandardMaterial` 表现塑封质感。
- 使用简单 `TubeGeometry` 或 `PlaneGeometry` 组合挂绳。
- 监听 pointer drag，向下拖动时移动卡片和改变旋转。
- 达到阈值后触发 `onEnter()`。

动画时间线：

1. `0ms - 800ms`：陪护证从上方落入画面，轻微回弹。
2. 待机：吊牌以 2 到 3 度幅度慢摆。
3. 拖拽：吊牌跟随指针向下，挂绳拉直，阴影增强。
4. 触发：吊牌翻面 180 度，盖章图层出现。
5. 转场：镜头拉近，画面亮白闪过，进入第一幕。

降级策略：

- 如果 WebGL 不可用，显示静态陪护证图片和普通“拉动开始”按钮。
- 如果用户开启 reduced motion，去掉摆动和翻面，只保留淡入和点击开始。

---

## 7. Galgame 主界面

### 7.1 `src/components/game/GameScene.tsx`

页面布局：

- 全屏 `main.game-scene`。
- 背景图铺满。
- 顶部 HUD 显示当前章节、信任值、精力值。
- 中下方显示人物立绘。
- 底部显示对话框。
- 文本结束后显示选项。

组件职责：

```text
GameScene
  GameHud
  CharacterLayer
  DialogBox
  ChoiceList
```

### 7.2 `DialogBox`

交互：

- 对话文本逐字出现。
- 点击对话框继续。
- 文本未打完时点击立即显示完整句子。
- 文本打完后再次点击进入下一句。

视觉：

- 深叶绿半透明背景。
- 圆角 22px。
- 名字使用麦穗黄。
- 正文使用白色。
- 对话框高度固定，避免切换文本时布局跳动。

### 7.3 `ChoiceList`

交互：

- 四个选项在文本结束后出现。
- 推荐行为不直接标答案，但通过 hover/press 反馈更温和。
- 键盘支持 `1`、`2`、`3`、`4` 选择。

视觉：

- 溪水白按钮。
- 浅绿描边。
- hover 用嫩芽绿底色。
- active 有轻微按压位移。

### 7.4 `SceneFeedback`

选择后显示：

- 当前选择结果。
- `信任 +15` 或 `信任 -10`。
- `精力 -5` 或 `精力 0`。
- 一条陪护提示。
- “继续”按钮进入下一幕。

反馈层不使用大弹窗遮满画面，采用对话框上浮卡片，保持 galgame 叙事连续。

---

## 8. 结算页

### 8.1 `src/components/summary/SummaryPage.tsx`

显示内容：

- 最终信任值。
- 最终精力值。
- 结局标题和说明。
- 五幕选择回放。
- “重新开始”按钮。

四个结局：

1. `excellent`：你走进了小宇的世界。
2. `warm`：你完成了一次温暖的陪伴。
3. `hard`：你尽力了，但陪伴远比想象中困难。
4. `misunderstood`：陪伴不是管理，而是理解。

视觉：

- 使用浅绿白背景。
- 数值用圆形仪表或柔和进度条展示。
- 选择回放用时间线，不用密集表格。

---

## 9. 实施任务

### Task 1: 安装 Three.js 并复制素材

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/assets/game/scenes/*`
- Create: `src/assets/game/raw/*`
- Create: `src/assets/game/opening/volunteer-pass.png`

- [ ] **Step 1: 安装依赖**

```powershell
cd "C:\Users\Cxs07\Desktop\网页设计大赛\companion-volunteer-web"
npm install three
npm install -D @types/three
```

Expected:

```text
package.json contains "three"
package.json contains "@types/three"
```

- [ ] **Step 2: 创建素材目录**

```powershell
New-Item -ItemType Directory -Force `
  "src/assets/game/scenes", `
  "src/assets/game/raw", `
  "src/assets/game/characters", `
  "src/assets/game/opening"
```

- [ ] **Step 3: 复制并重命名场景素材**

```powershell
$source = "C:\Users\Cxs07\Desktop\网页设计大赛\交互游戏图片(1)\交互游戏图片"
Copy-Item -LiteralPath "$source\场景一.png" -Destination "src/assets/game/scenes/scene-01.png" -Force
Copy-Item -LiteralPath "$source\场景二.png" -Destination "src/assets/game/scenes/scene-02.png" -Force
Copy-Item -LiteralPath "$source\场景三.png" -Destination "src/assets/game/scenes/scene-03.png" -Force
Copy-Item -LiteralPath "$source\场景四.png" -Destination "src/assets/game/scenes/scene-04.png" -Force
Copy-Item -LiteralPath "$source\场景五.png" -Destination "src/assets/game/scenes/scene-05.png" -Force
Copy-Item -LiteralPath "$source\小男孩.png" -Destination "src/assets/game/raw/boy-sheet.png" -Force
Copy-Item -LiteralPath "$source\志愿者.png" -Destination "src/assets/game/raw/volunteer-sheet.png" -Force
Copy-Item -LiteralPath "$source\志愿者和小男孩.png" -Destination "src/assets/game/raw/duo-sheet.png" -Force
Copy-Item -LiteralPath "$source\小男孩和志愿者原始版.png" -Destination "src/assets/game/raw/duo-original.png" -Force
Copy-Item -LiteralPath "C:\Users\Cxs07\AppData\Local\Temp\codex-clipboard-a1c98aae-ba4a-41f2-928a-14c496e83901.png" -Destination "src/assets/game/opening/volunteer-pass.png" -Force
```

- [ ] **Step 4: 验证素材存在**

```powershell
Get-ChildItem -Recurse src/assets/game | Select-Object FullName,Length
```

Expected:

```text
scene-01.png through scene-05.png exist
boy-sheet.png exists
volunteer-sheet.png exists
duo-sheet.png exists
volunteer-pass.png exists
```

### Task 2: 生成人物透明立绘

**Files:**

- Create: `scripts/extract-character-assets.py`
- Create: `src/assets/game/characters/*.png`

- [ ] **Step 1: 创建脚本**

`scripts/extract-character-assets.py` 内容：

```python
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "src" / "assets" / "game" / "raw"
OUT = ROOT / "src" / "assets" / "game" / "characters"
OUT.mkdir(parents=True, exist_ok=True)

CROPS = {
    "boy-sheet.png": {
        "boy-overload.png": (0, 0, 512, 440),
        "boy-first-meet.png": (512, 0, 1024, 440),
        "boy-meal.png": (1024, 0, 1536, 440),
        "boy-refuse.png": (0, 512, 512, 925),
        "boy-walk.png": (512, 512, 1024, 925),
        "boy-piano.png": (1024, 512, 1536, 925),
    },
    "volunteer-sheet.png": {
        "volunteer-observe.png": (0, 0, 512, 455),
        "volunteer-strict.png": (512, 0, 1024, 455),
        "volunteer-ignore.png": (1024, 0, 1536, 455),
        "volunteer-prompt.png": (0, 512, 768, 950),
        "volunteer-hug.png": (768, 512, 1536, 950),
    },
    "duo-sheet.png": {
        "duo-drawing.png": (0, 0, 700, 460),
        "duo-comfort.png": (768, 512, 1536, 950),
    },
}

def make_white_transparent(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            if r > 244 and g > 244 and b > 244:
                pixels[x, y] = (255, 255, 255, 0)
            elif r > 235 and g > 235 and b > 235:
                pixels[x, y] = (r, g, b, 80)
    return image

def main() -> None:
    for source_name, crops in CROPS.items():
        source = Image.open(RAW / source_name)
        for output_name, box in crops.items():
            cropped = source.crop(box)
            transparent = make_white_transparent(cropped)
            transparent.save(OUT / output_name)
            print(f"created {OUT / output_name}")

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: 运行脚本**

```powershell
python scripts/extract-character-assets.py
```

Expected:

```text
created .../boy-first-meet.png
created .../volunteer-observe.png
created .../duo-comfort.png
```

- [ ] **Step 3: 目视检查输出**

```powershell
Get-ChildItem src/assets/game/characters | Select-Object Name,Length
```

检查重点：

- 人物主体没有被裁掉。
- 白底基本透明。
- 字幕标签没有进入立绘。

### Task 3: 重写类型与剧情数据

**Files:**

- Create: `src/data/gameTypes.ts`
- Create: `src/data/gameScript.ts`
- Create: `src/data/assetMap.ts`
- Create: `src/utils/gameScore.ts`

- [ ] **Step 1: 创建 `gameTypes.ts`**

按本文第 4.1 节定义类型。

- [ ] **Step 2: 创建 `assetMap.ts`**

结构：

```ts
import scene01 from '../assets/game/scenes/scene-01.png'
import scene02 from '../assets/game/scenes/scene-02.png'
import scene03 from '../assets/game/scenes/scene-03.png'
import scene04 from '../assets/game/scenes/scene-04.png'
import scene05 from '../assets/game/scenes/scene-05.png'
import boyFirstMeet from '../assets/game/characters/boy-first-meet.png'
import boyOverload from '../assets/game/characters/boy-overload.png'
import boyMeal from '../assets/game/characters/boy-meal.png'
import boyRefuse from '../assets/game/characters/boy-refuse.png'
import boyWalk from '../assets/game/characters/boy-walk.png'
import boyPiano from '../assets/game/characters/boy-piano.png'
import volunteerObserve from '../assets/game/characters/volunteer-observe.png'
import volunteerStrict from '../assets/game/characters/volunteer-strict.png'
import volunteerIgnore from '../assets/game/characters/volunteer-ignore.png'
import volunteerPrompt from '../assets/game/characters/volunteer-prompt.png'
import volunteerHug from '../assets/game/characters/volunteer-hug.png'
import duoDrawing from '../assets/game/characters/duo-drawing.png'
import duoComfort from '../assets/game/characters/duo-comfort.png'
import type { CharacterPoseKey, SceneAssetKey } from './gameTypes'

export const sceneAssets: Record<SceneAssetKey, string> = {
  'scene-01': scene01,
  'scene-02': scene02,
  'scene-03': scene03,
  'scene-04': scene04,
  'scene-05': scene05,
}

export const characterAssets: Record<CharacterPoseKey, string> = {
  'boy-first-meet': boyFirstMeet,
  'boy-overload': boyOverload,
  'boy-meal': boyMeal,
  'boy-refuse': boyRefuse,
  'boy-walk': boyWalk,
  'boy-piano': boyPiano,
  'volunteer-observe': volunteerObserve,
  'volunteer-strict': volunteerStrict,
  'volunteer-ignore': volunteerIgnore,
  'volunteer-prompt': volunteerPrompt,
  'volunteer-hug': volunteerHug,
  'duo-drawing': duoDrawing,
  'duo-comfort': duoComfort,
}
```

- [ ] **Step 3: 创建 `gameScore.ts`**

```ts
import type { EndingLevel } from '../data/gameTypes'

export const INITIAL_TRUST = 50
export const INITIAL_ENERGY = 100

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, value))
}

export function getEndingLevel(trust: number, energy: number): EndingLevel {
  if (trust >= 90 && energy >= 60) return 'excellent'
  if (trust >= 70 && trust < 90 && energy >= 60) return 'warm'
  if (trust >= 50 && trust <= 69 && energy < 60) return 'hard'
  return 'misunderstood'
}
```

- [ ] **Step 4: 创建 `gameScript.ts`**

使用 Word 文档的五幕内容逐条录入。录入完成后运行：

```powershell
npm run build
```

Expected:

```text
TypeScript build passes
页面不再出现乱码中文
```

### Task 4: 重写 Zustand 游戏状态

**Files:**

- Modify: `src/store/gameStore.ts`

- [ ] **Step 1: 用新字段替换旧状态**

关键状态：

```ts
phase: 'opening'
currentSceneIndex: 0
currentLineIndex: 0
trust: INITIAL_TRUST
energy: INITIAL_ENERGY
selectedChoices: []
activeFeedback: null
```

- [ ] **Step 2: 实现 `selectChoice`**

逻辑：

```ts
const nextTrust = clampScore(state.trust + choice.trustDelta)
const nextEnergy = clampScore(state.energy + choice.energyDelta)
```

选择后：

```ts
phase: 'feedback'
activeFeedback: record
selectedChoices: [...state.selectedChoices, record]
trust: nextTrust
energy: nextEnergy
```

- [ ] **Step 3: 实现剧情推进**

`continueLine()`：

- 如果当前文本未结束，`currentLineIndex + 1`。
- 如果当前文本已结束，不做变化，等待用户选择。

`continueAfterFeedback()`：

- 如果当前幕不是最后一幕，`currentSceneIndex + 1` 且 `currentLineIndex = 0`。
- 如果当前幕是最后一幕，`phase = 'summary'`。

### Task 5: 实现 3D 开场

**Files:**

- Create: `src/components/opening/BadgeOpening3D.tsx`
- Create: `src/components/opening/useBadgeDrag.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: 创建拖拽 hook**

`useBadgeDrag` 返回：

```ts
{
  dragY: number
  progress: number
  isDragging: boolean
  isTriggered: boolean
  bindPointerDown: (event: React.PointerEvent) => void
}
```

触发阈值：

```ts
const TRIGGER_DISTANCE = 150
```

- [ ] **Step 2: 创建 Three.js 场景**

`BadgeOpening3D` props：

```ts
type BadgeOpening3DProps = {
  onEnter: () => void
}
```

要求：

- canvas 填满首屏。
- 背景使用 CSS 层，不在 Three.js 里渲染大图。
- Three.js 只负责陪护证、挂绳和光照。
- `onEnter()` 只触发一次。
- 组件卸载时 dispose geometry、material、texture、renderer。

- [ ] **Step 3: 接入 App**

`App.tsx` 根据 `phase` 显示：

```tsx
{phase === 'opening' && <BadgeOpening3D onEnter={completeOpening} />}
{phase === 'scene' && <GameScene />}
{phase === 'feedback' && <GameScene />}
{phase === 'summary' && <SummaryPage />}
```

### Task 6: 实现 galgame 主界面

**Files:**

- Create: `src/components/game/GameScene.tsx`
- Create: `src/components/game/DialogBox.tsx`
- Create: `src/components/game/ChoiceList.tsx`
- Create: `src/components/game/CharacterLayer.tsx`
- Create: `src/components/game/GameHud.tsx`
- Create: `src/components/game/SceneFeedback.tsx`

- [ ] **Step 1: GameHud**

显示：

```text
第 N 幕 / 信任 X / 精力 Y
```

- [ ] **Step 2: CharacterLayer**

输入：

```ts
type CharacterLayerProps = {
  poses: CharacterPoseKey[]
}
```

布局：

- 一个角色时居中偏右。
- 两个角色时志愿者在左、小宇在右。
- 双人互动图居中。

- [ ] **Step 3: DialogBox**

输入：

```ts
type DialogBoxProps = {
  speaker: string
  text: string
  isComplete: boolean
  onCompleteText: () => void
  onNext: () => void
}
```

逐字速度：

```ts
const TYPE_INTERVAL_MS = 28
```

- [ ] **Step 4: ChoiceList**

输入：

```ts
type ChoiceListProps = {
  choices: SceneChoice[]
  onSelect: (choiceId: ChoiceId) => void
}
```

键盘支持：

```ts
const keyMap: Record<string, ChoiceId> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' }
```

- [ ] **Step 5: SceneFeedback**

显示结果卡片：

```text
你的选择：...
信任 +15 / 精力 -5
结果：...
陪护提示：...
```

### Task 7: 实现结算页

**Files:**

- Create: `src/components/summary/SummaryPage.tsx`
- Create: `src/components/summary/ChoiceReview.tsx`

- [ ] **Step 1: SummaryPage**

读取：

```ts
trust
energy
selectedChoices
restart
```

使用 `getEndingLevel(trust, energy)` 获取结局。

- [ ] **Step 2: ChoiceReview**

每条选择显示：

```text
第 N 幕：场景标题
选择：选项文案
影响：信任 / 精力
提示：careTip
```

### Task 8: 重写样式

**Files:**

- Modify: `src/index.css`

- [ ] **Step 1: 定义设计 tokens**

```css
:root {
  --color-grass: #a5ca8b;
  --color-sprout: #d0dd97;
  --color-paper: #f8fae4;
  --color-sun: #f9de79;
  --color-ink: #2f4d38;
  --color-teal: #0d8f8f;
  --radius-panel: 22px;
  --shadow-soft-green: 0 22px 60px rgb(47 77 56 / 0.16);
}
```

- [ ] **Step 2: 清理旧乱码相关样式**

保留基础 reset，移除不再使用的旧 `.scene-stage`、`.report-page`、`.data-story` 大段样式，换成：

```css
.badge-opening {}
.game-scene {}
.game-hud {}
.character-layer {}
.dialog-box {}
.choice-list {}
.scene-feedback {}
.summary-page {}
```

- [ ] **Step 3: 移动端适配**

移动端规则：

- 对话框固定在底部。
- 选项纵向排列。
- 人物立绘最多显示一张，避免遮挡文字。
- HUD 缩成两枚圆角胶囊。
- Three.js 开场拉动阈值从 `150px` 降为 `110px`。

### Task 9: 声音与可访问性

**Files:**

- Modify: `src/hooks/useSound.ts`
- Modify: `src/components/game/DialogBox.tsx`
- Modify: `src/components/game/ChoiceList.tsx`
- Modify: `src/components/opening/BadgeOpening3D.tsx`

- [ ] **Step 1: 声音**

保留现有 Howler：

- 开场盖章音。
- 选项点击轻音。
- 第四幕钢琴轻音。

不自动播放背景音乐，避免浏览器阻止和打扰用户。

- [ ] **Step 2: 键盘**

支持：

```text
Enter / Space：继续文本
1 / 2 / 3 / 4：选择选项
R：结算页重新开始
```

- [ ] **Step 3: reduced motion**

如果 `prefers-reduced-motion: reduce`：

- 开场不做连续摆动。
- 文本直接显示完整句。
- 转场使用淡入淡出，不使用镜头推进。

### Task 10: 验证

**Files:**

- No source changes unless failures are found.

- [ ] **Step 1: 类型检查和构建**

```powershell
cd "C:\Users\Cxs07\Desktop\网页设计大赛\companion-volunteer-web"
npm run build
```

Expected:

```text
tsc -b && vite build exits with code 0
```

- [ ] **Step 2: lint**

```powershell
npm run lint
```

Expected:

```text
oxlint exits with code 0
```

- [ ] **Step 3: 本地运行**

```powershell
npm run dev
```

手动验收：

- 开场显示 3D 陪护证。
- 鼠标/触摸向下拉能进入游戏。
- 第一幕背景来自 `场景一.png`。
- 选项能改变信任值和精力值。
- 五幕结束能进入结算页。
- 刷新页面后能重新开始。
- 移动端宽度下文字不溢出、不遮挡关键按钮。

---

## 10. 风险与处理

| 风险 | 处理 |
| --- | --- |
| 人物自动抠白底不干净 | 先用脚本输出透明 PNG，再人工调 crop box；必要时临时用白底卡片式立绘 |
| Three.js 增加首屏复杂度 | 开场只渲染陪护证和挂绳，不渲染复杂环境 |
| 中文乱码继续出现 | 所有新数据文件使用 UTF-8，旧 `scenes.ts` 不再作为数据源 |
| 场景图自带标题可能被 UI 遮挡 | 对话框固定底部，HUD 避开左上角标题 |
| 手机拖拽不易触发 | 移动端降低触发阈值，并提供“点击开始”兜底 |
| 旧组件残留造成样式冲突 | 新组件使用新的 class 命名空间，完成后再清理旧样式 |

---

## 11. 验收标准

- [ ] 开场是 3D 陪护证，不是普通按钮。
- [ ] 用户拉动陪护证后进入游戏。
- [ ] 整体配色符合 `#a5ca8b`、`#d0dd97`、`#f8fae4`、`#f9de79`。
- [ ] 游戏中的人物和场景来自工作区素材包。
- [ ] 五幕剧情文案来自 `交互游戏(2).docx`，没有乱码。
- [ ] 同时存在信任值和精力值。
- [ ] 结算页按信任值和精力值生成四档结局。
- [ ] `npm run build` 通过。
- [ ] `npm run lint` 通过。
- [ ] 桌面和移动端均可完整游玩。

---

## 12. 执行顺序建议

推荐顺序：

1. Task 1：安装依赖并复制素材。
2. Task 2：生成人物透明立绘。
3. Task 3：重写类型和剧情数据。
4. Task 4：重写 store。
5. Task 6：先实现无开场的 galgame 主界面。
6. Task 7：实现结算页。
7. Task 5：实现 Three.js 开场。
8. Task 8：统一样式。
9. Task 9：补声音、键盘和 reduced motion。
10. Task 10：最终验证。

这样做的原因是：先让剧情主链路跑通，再加入 3D 开场。Three.js 是视觉亮点，但不应该阻塞游戏核心流程。

---

## 13. 自检

- 设计覆盖：已覆盖 3D 陪护证开场、AB 结合风格、晴川浅夏配色、工作区素材包、五幕剧情、信任值/精力值、结算页。
- 文件覆盖：已列出新增、修改和逐步替换文件。
- 数据覆盖：已规定新版 UTF-8 剧情数据和结局规则。
- 风险覆盖：已列出素材切片、Three.js、乱码、移动端等风险。
- 测试覆盖：已包含 build、lint、本地运行和人工验收。
