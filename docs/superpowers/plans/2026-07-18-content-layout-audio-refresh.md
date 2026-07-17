# Content, Layout, and Audio Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the requested content, layout, photo-wall, choice-guidance, and background-music updates without changing the site's established watercolor visual language.

**Architecture:** Keep the existing React/Vite component graph and add data-driven extensions at its current boundaries. `dataNewsContent.ts` owns the time-scene postscript, `DataBlackboardSection.tsx` renders it through the existing lazy chart path, `investigationData.ts` owns anonymous message identities and photo metadata, `ChoiceList.tsx` owns the first-choice affordance, and `AmbientSoundController.tsx` replaces only the synthesized pad with the supplied MP3.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Zustand, Howler, CSS, Node assertions, Playwright CLI.

---

### Task 1: Add a request-specific regression verifier

**Files:**
- Create: `scripts/verify-requested-update.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing verifier**

Create `scripts/verify-requested-update.mjs` with source and asset assertions:

```js
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const read = (path) => readFileSync(resolve(root, path), 'utf8')

const investigation = read('src/data/investigationData.ts')
const dataNews = read('src/data/dataNewsContent.ts')
const blackboard = read('src/components/summary/DataBlackboardSection.tsx')
const choices = read('src/components/game/ChoiceList.tsx')
const audio = read('src/components/layout/AmbientSoundController.tsx')
const css = read('src/index.css')

for (let index = 1; index <= 8; index += 1) {
  assert.match(investigation, new RegExp(`受访者${String(index).padStart(2, '0')}`))
}
for (let index = 11; index <= 13; index += 1) {
  assert.ok(existsSync(resolve(root, `src/assets/investigation/photos/photo-${index}.webp`)))
}
assert.ok(existsSync(resolve(root, 'src/assets/audio/warm-window-light.mp3')))
assert.match(dataNews, /c_2700ea033515c3a86b03a0f2916eb03e/)
assert.match(dataNews, /这些时间从何而来？/)
assert.match(dataNews, /它也需要有人为它添一点灯油。/)
assert.match(blackboard, /inline-data-chart__viewport/)
assert.match(choices, /choice-hand-guide/)
assert.match(audio, /warm-window-light\.mp3/)
assert.match(css, /requested stacked blackboard layout/)

console.log('Requested update assertions passed')
```

Add the script entry:

```json
"verify:update": "node scripts/verify-requested-update.mjs"
```

- [ ] **Step 2: Run the verifier and confirm the red state**

Run: `npm run verify:update`

Expected: FAIL on the first missing `受访者01` assertion or `photo-11.webp`.

- [ ] **Step 3: Commit the verifier**

```powershell
git add package.json scripts/verify-requested-update.mjs
git commit -m "test: codify requested story site updates"
```

### Task 2: Prepare the supplied media and anonymize the message wall

**Files:**
- Create: `src/assets/audio/warm-window-light.mp3`
- Create: `src/assets/investigation/photos/photo-11.webp`
- Create: `src/assets/investigation/photos/photo-12.webp`
- Create: `src/assets/investigation/photos/photo-13.webp`
- Modify: `src/data/investigationData.ts`
- Modify: `src/components/summary/VolunteerPhotoWall.tsx`

- [ ] **Step 1: Copy the MP3 and convert the three supplied JPEGs**

Run these PowerShell commands, using Pillow because ImageMagick is not installed:

```powershell
New-Item -ItemType Directory -Force src/assets/audio | Out-Null
Copy-Item -LiteralPath 'C:\Users\Cxs07\Documents\xwechat_files\wxid_pxceedchm9il22_ce06\msg\file\2026-07\暖光窗边 (1).mp3' -Destination src/assets/audio/warm-window-light.mp3
python -c "from PIL import Image,ImageOps; from pathlib import Path; sources=[r'C:\Users\Cxs07\Documents\xwechat_files\wxid_pxceedchm9il22_ce06\temp\RWTemp\2026-07\28df77d8f487a769c507c8e520783d9d\a7f402f509131872aedee7930a1c193f.jpg',r'C:\Users\Cxs07\Documents\xwechat_files\wxid_pxceedchm9il22_ce06\temp\RWTemp\2026-07\28df77d8f487a769c507c8e520783d9d\964ac3ee35a91e307c3e8259db22e122.jpg',r'C:\Users\Cxs07\Documents\xwechat_files\wxid_pxceedchm9il22_ce06\temp\RWTemp\2026-07\28df77d8f487a769c507c8e520783d9d\f585a14ed68a0758f8a3b81e144b2004.jpg']; out=Path('src/assets/investigation/photos'); [(lambda im,i: (im.thumbnail((1800,1800),Image.Resampling.LANCZOS),im.save(out/f'photo-{i}.webp','WEBP',quality=86,method=6)))(ImageOps.exif_transpose(Image.open(path)).convert('RGB'),i) for i,path in enumerate(sources,11)]"
```

- [ ] **Step 2: Change photo data to metadata objects and anonymize identities**

In `investigationData.ts`, import `photo-11.webp` through `photo-13.webp`, replace the string array with:

```ts
export type InvestigationPhoto = { src: string; alt: string }

export const investigationPhotos: InvestigationPhoto[] = [
  { src: photo01, alt: '志愿者服务现场照片 01' },
  { src: photo02, alt: '志愿者服务现场照片 02' },
  { src: photo03, alt: '志愿者服务现场照片 03' },
  { src: photo04, alt: '志愿者服务现场照片 04' },
  { src: photo05, alt: '志愿者服务现场照片 05' },
  { src: photo06, alt: '志愿者服务现场照片 06' },
  { src: photo07, alt: '志愿者服务现场照片 07' },
  { src: photo08, alt: '志愿者服务现场照片 08' },
  { src: photo09, alt: '志愿者服务现场照片 09' },
  { src: photo10, alt: '志愿者服务现场照片 10' },
  { src: photo11, alt: '志愿者在公益市集展位合影' },
  { src: photo12, alt: '公益市集展示的手工作品' },
  { src: photo13, alt: '星星雨公益圣诞集市展位' },
]
```

Set the eight `volunteerMessages[].identity` values to `受访者01` through `受访者08`, preserving every answer verbatim.

- [ ] **Step 3: Update the photo wall to consume metadata**

Use all 13 indexes in each track and read `photo.src`/`photo.alt`:

```ts
const trackOrders = [
  [0, 1, 10, 8, 2, 3, 11, 4, 9, 5, 12, 6, 7],
  [4, 11, 5, 9, 6, 12, 7, 0, 10, 8, 1, 2, 3],
  [12, 9, 7, 6, 5, 11, 8, 4, 3, 10, 2, 1, 0],
]
```

```tsx
const photo = investigationPhotos[photoIndex]
<img alt={photo.alt} loading="lazy" src={photo.src} />
```

Use `investigationPhotos[selectedIndex].src` and `.alt` in the lightbox.

- [ ] **Step 4: Run the verifier to observe the next expected failure**

Run: `npm run verify:update`

Expected: FAIL on the missing chart URL or later assertion; all identity/photo/audio assertions pass.

- [ ] **Step 5: Commit media and message updates**

```powershell
git add src/assets/audio src/assets/investigation/photos src/data/investigationData.ts src/components/summary/VolunteerPhotoWall.tsx
git commit -m "feat: add supplied investigation media"
```

### Task 3: Add the data-blackboard 03 chart and conclusion

**Files:**
- Modify: `src/data/dataNewsContent.ts`
- Modify: `src/components/summary/DataBlackboardSection.tsx`

- [ ] **Step 1: Add a typed postscript to data scenes**

Extend the data type:

```ts
export type ScenePostscript = {
  lead: SourceParagraph[]
  heading: string
  paragraphs: SourceParagraph[]
}

export type DataBlackboardScene = {
  id: string
  part: number
  label: string
  question: string
  sourceSection: string
  paragraphs: SourceParagraph[]
  metrics: BlackboardMetric[]
  timeline?: string[]
  closing?: SourceParagraph
  postscript?: ScenePostscript
}
```

For the `time` scene, add `postscript` after `metrics`. The lead starts with a chart-only paragraph, followed by the supplied time paragraph; the six conclusion paragraphs are copied exactly from the user request:

```ts
postscript: {
  lead: [
    paragraph([], chart('志愿者服务时间来源', 'https://dycharts.com/xshow/index.html?id=c_2700ea033515c3a86b03a0f2916eb03e')),
    paragraph([{ text: '这些时间从何而来？从周末、从夜晚、从节假日的休息中挤出来。他们不是闲人——他们是上班族、是学生、是退休老人，用本属于自己的时间，填补了公共服务与家庭需求之间的缝隙。' }]),
  ],
  heading: '结语',
  paragraphs: [
    paragraph([{ text: '他们走进“星星的孩子”的世界，走进那些被日常压得喘不过气的家庭。他们从2.4亿人中走来，带着时间、体力和一份不计回报的心意。' }]),
    paragraph([{ text: '但走出那扇门之后呢？' }]),
    paragraph([{ text: '他们回到自己的生活里——可能是一个同样需要照顾的家庭，可能是一份不敢请假的工位，也可能是一个无人问津的夜晚。' }]),
    paragraph([{ text: '照亮他人的人，也渴望被看见。不是被赞美，是被理解——理解他们的疲惫，理解他们偶尔也想放弃的瞬间，理解他们其实也怕黑。' }]),
    paragraph([{ text: '善意从来不是无限的。它需要被支持，被回应，被接住。' }]),
    paragraph([{ text: '下一次，当你看到那束光，请记得——它也需要有人为它添一点灯油。' }]),
  ],
},
```

- [ ] **Step 2: Render chart-only paragraphs and the postscript**

Make `SourceParagraph` omit an empty `<p>`, wrap the iframe, and render the new block after metrics:

```tsx
function SourceParagraph({ paragraph, index }: { paragraph: SourceParagraphData; index: number }) {
  return (
    <>
      {paragraph.segments.length > 0 && (
        <p style={{ '--line-index': index } as CSSProperties}>
          {paragraph.segments.map((segment, segmentIndex) => (
            <span className={segment.emphasis ? 'source-emphasis' : undefined} key={`${segment.text}-${segmentIndex}`}>
              {segment.text}
            </span>
          ))}
        </p>
      )}
      {paragraph.chart && <InlineDataChart chart={paragraph.chart} />}
    </>
  )
}
```

```tsx
<div className="inline-data-chart__viewport">
  <iframe
    src={chart.src}
    title={chart.title}
    loading="lazy"
    onError={() => setFailed(true)}
    onLoad={() => setLoaded(true)}
  />
</div>
```

```tsx
{scene.postscript && (
  <section className="chalk-postscript" aria-labelledby={`${scene.id}-postscript-title`}>
    <ChalkReveal paragraphs={scene.postscript.lead} visible />
    <h3 id={`${scene.id}-postscript-title`}>{scene.postscript.heading}</h3>
    <ChalkReveal paragraphs={scene.postscript.paragraphs} visible />
  </section>
)}
```

- [ ] **Step 3: Run the verifier to observe the CSS/choice failure**

Run: `npm run verify:update`

Expected: FAIL on `choice-hand-guide` or the CSS marker; chart and conclusion assertions pass.

- [ ] **Step 4: Commit the content block**

```powershell
git add src/data/dataNewsContent.ts src/components/summary/DataBlackboardSection.tsx
git commit -m "feat: extend the volunteer time narrative"
```

### Task 4: Stack every blackboard over its data and crop chart headers

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Append a scoped layout override after the current stylesheet**

Add a final section beginning with `/* requested stacked blackboard layout */`. It must:

```css
.data-blackboard-scene.is-open {
  align-items: start;
  gap: clamp(44px, 7vh, 82px);
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  max-width: min(1440px, 100%);
  padding: clamp(92px, 12vh, 144px) clamp(18px, 4vw, 64px) clamp(104px, 14vh, 168px);
}

.data-blackboard-scene.is-open .data-blackboard-scene__board {
  display: grid;
  place-items: center;
  position: relative;
  top: auto;
  width: 100%;
}

.data-blackboard-scene.is-open .data-blackboard {
  width: min(92vw, 1040px);
}

.data-blackboard-scene.is-open .data-blackboard__surface {
  align-content: center;
  justify-items: center;
  min-height: clamp(470px, 68vh, 720px);
  padding: clamp(72px, 9vh, 112px) clamp(34px, 7vw, 112px);
  text-align: center;
}

.data-blackboard-scene.is-open .data-blackboard__label,
.data-blackboard-scene.is-open .data-blackboard strong {
  justify-self: center;
  text-align: center;
}

.data-blackboard-scene.is-open .data-blackboard-scene__notes {
  margin-inline: auto;
  max-width: 1240px;
  width: 100%;
}
```

- [ ] **Step 2: Add chart viewport and postscript styles**

```css
.inline-data-chart {
  grid-template-rows: auto minmax(0, 1fr);
  place-items: stretch;
}

.inline-data-chart figcaption {
  left: auto;
  padding: 18px 22px 14px;
  position: relative;
  top: auto;
}

.inline-data-chart__viewport {
  min-height: 600px;
  overflow: hidden;
  position: relative;
}

.inline-data-chart__viewport iframe {
  height: calc(100% + 72px);
  inset: -72px 0 0;
}

.chalk-postscript {
  border-top: 1px solid rgb(90 112 75 / 0.18);
  margin-top: clamp(42px, 7vh, 76px);
  padding-top: clamp(34px, 5vh, 58px);
}

.chalk-postscript h3 {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(34px, 4vw, 58px);
  letter-spacing: 0;
  margin: clamp(42px, 6vh, 72px) 0 24px;
}
```

Use these mobile constraints while retaining the same order:

```css
@media (max-width: 760px) {
  .data-blackboard-scene.is-open {
    gap: 36px;
    padding: 82px 14px 96px;
  }

  .data-blackboard-scene.is-open .data-blackboard {
    width: min(96vw, 680px);
  }

  .data-blackboard-scene.is-open .data-blackboard__surface {
    min-height: min(62svh, 520px);
    padding: 58px 26px;
  }

  .inline-data-chart__viewport {
    min-height: 420px;
  }
}
```

- [ ] **Step 3: Run the verifier**

Run: `npm run verify:update`

Expected: FAIL only on `choice-hand-guide` or audio import.

- [ ] **Step 4: Commit layout changes**

```powershell
git add src/index.css
git commit -m "style: stack data blackboards and clean chart headers"
```

### Task 5: Add a non-overlapping first-choice hand guide

**Files:**
- Modify: `src/components/game/ChoiceList.tsx`
- Modify: `src/components/game/GameScene.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Add a `showGuide` prop to `ChoiceList`**

```tsx
type ChoiceListProps = {
  choices: SceneChoice[]
  onSelect: (choiceId: ChoiceId) => void
  showGuide?: boolean
}

export function ChoiceList({ choices, onSelect, showGuide = false }: ChoiceListProps) {
  return (
    <div className={`choice-list${showGuide ? ' has-guide' : ''}`} aria-label="选择回应">
      {showGuide && (
        <div className="choice-hand-guide" aria-hidden="true">
          <span>☝</span>
          <strong>点击一项，做出你的选择</strong>
        </div>
      )}
      {choices.map((choice, index) => (
        <button
          key={choice.id}
          className={`choice-button choice-button--${choice.tone}`}
          type="button"
          onClick={() => onSelect(choice.id)}
        >
          <span className="choice-key">{index + 1}</span>
          <span className="choice-copy">{choice.label}</span>
        </button>
      ))}
    </div>
  )
}
```

In `GameScene.tsx`, pass the prop only for the first scene:

```tsx
<ChoiceList choices={scene.choices} onSelect={selectChoice} showGuide={currentSceneIndex === 0} />
```

- [ ] **Step 2: Reserve guide space and protect the enlarged options**

Append styles that keep the guide in normal grid flow, cap the options area to the viewport, and avoid the sound toggle:

```css
.choice-list.has-guide {
  position: relative;
}

.choice-hand-guide {
  align-items: center;
  color: rgb(255 250 232 / 0.94);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  min-height: 42px;
  pointer-events: none;
}

.choice-hand-guide span {
  animation: choiceHandTap 1.4s ease-in-out infinite;
  filter: sepia(0.35) saturate(0.78);
  font-size: 34px;
  line-height: 1;
}

.choice-hand-guide strong {
  font-size: 14px;
}

@keyframes choiceHandTap {
  0%, 100% { transform: translateY(0) rotate(-8deg); }
  50% { transform: translateY(7px) rotate(-4deg); }
}

@media (min-width: 1100px) {
  .game-control-layer { right: clamp(154px, 8vw, 178px); }
  .choice-list { max-height: calc(100svh - 120px); overflow-y: auto; overscroll-behavior: contain; }
}

@media (prefers-reduced-motion: reduce) {
  .choice-hand-guide span { animation: none; }
}
```

For narrow screens, use the exact scroll constraints below so all four choices remain reachable:

```css
@media (max-width: 980px) {
  .game-control-layer {
    max-height: calc(100svh - 92px);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-right: 4px;
  }

  .choice-list {
    max-height: none;
    overflow: visible;
  }
}
```

- [ ] **Step 3: Run the verifier**

Run: `npm run verify:update`

Expected: FAIL only on the missing MP3 import in `AmbientSoundController.tsx`.

- [ ] **Step 4: Commit choice guidance**

```powershell
git add src/components/game/ChoiceList.tsx src/components/game/GameScene.tsx src/index.css
git commit -m "feat: guide the first game choice without overlap"
```

### Task 6: Replace the synthesized background pad with the supplied MP3

**Files:**
- Modify: `src/components/layout/AmbientSoundController.tsx`

- [ ] **Step 1: Import Howler and the audio asset**

```ts
import { Howl } from 'howler'
import backgroundMusic from '../../assets/audio/warm-window-light.mp3'
```

- [ ] **Step 2: Retain the chime engine and replace only pad playback**

Remove `padGain`, the five pad oscillators, `playAmbientMotif`, and its interval. Replace the managed-audio type and constructors with this minimal Web Audio engine for `playTextChime`:

```ts
type ManagedAudio = {
  context: AudioContext
  masterGain: GainNode
  melodyGain: GainNode
}

function startChimeEngine(): ManagedAudio | null {
  const AudioContextCtor = getAudioContextCtor()
  if (!AudioContextCtor) return null

  const context = new AudioContextCtor()
  const masterGain = context.createGain()
  const melodyGain = context.createGain()
  masterGain.gain.setValueAtTime(0.0001, context.currentTime)
  masterGain.gain.exponentialRampToValueAtTime(0.34, context.currentTime + 0.45)
  melodyGain.gain.setValueAtTime(0.42, context.currentTime)
  melodyGain.connect(masterGain)
  masterGain.connect(context.destination)
  void context.resume()
  return { context, masterGain, melodyGain }
}

function stopChimeEngine(audio: ManagedAudio | null) {
  if (!audio) return
  const { context, masterGain } = audio
  const now = context.currentTime
  masterGain.gain.cancelScheduledValues(now)
  masterGain.gain.setTargetAtTime(0.0001, now, 0.18)
  window.setTimeout(() => void context.close(), 520)
}
```

Add `musicRef` and this lifecycle inside the component:

```ts
const musicRef = useRef<Howl | null>(null)

useEffect(() => {
  if (soundEnabled && !musicRef.current) {
    const music = new Howl({ src: [backgroundMusic], html5: true, loop: true, volume: 0 })
    musicRef.current = music
    music.once('play', () => music.fade(0, 0.28, 900))
    music.play()
    return
  }

  if (!soundEnabled && musicRef.current) {
    const music = musicRef.current
    musicRef.current = null
    music.fade(music.volume(), 0, 600)
    window.setTimeout(() => {
      music.stop()
      music.unload()
    }, 650)
  }
}, [soundEnabled])

useEffect(() => {
  return () => {
    if (!musicRef.current) return
    musicRef.current.stop()
    musicRef.current.unload()
    musicRef.current = null
  }
}, [])
```

Initialize and close the remaining chime context with the existing sound toggle:

```ts
useEffect(() => {
  if (soundEnabled && !audioRef.current) {
    audioRef.current = startChimeEngine()
    playTextChime(audioRef.current, 'summary')
  }

  if (!soundEnabled && audioRef.current) {
    const audio = audioRef.current
    audioRef.current = null
    stopChimeEngine(audio)
  }
}, [soundEnabled])

useEffect(() => {
  return () => {
    if (!audioRef.current) return
    stopChimeEngine(audioRef.current)
    audioRef.current = null
  }
}, [])
```

Preserve the existing effect that calls `playTextChime` on line, choice, and summary changes without changing its dependency list.

- [ ] **Step 3: Run the complete request verifier**

Run: `npm run verify:update`

Expected: `Requested update assertions passed`.

- [ ] **Step 4: Commit the audio replacement**

```powershell
git add src/components/layout/AmbientSoundController.tsx
git commit -m "feat: use supplied background music"
```

### Task 7: Static checks, production build, and browser acceptance

**Files:**
- Modify only files implicated by failures.
- Create screenshots under: `output/playwright/` (ignored after inspection or explicitly removed before final commit).

- [ ] **Step 1: Run verification in the required order**

Run:

```powershell
npx tsc -b --pretty false
npm run lint
npm run build
```

Expected: all commands exit 0; lint reports no errors; Vite emits the production bundle.

- [ ] **Step 2: Start the local Vite server**

Run in a persistent hidden process on the first available port at or above 4173:

```powershell
npm run dev -- --host 127.0.0.1 --port 4173
```

Keep the server running for user preview.

- [ ] **Step 3: Inspect desktop and mobile with Playwright CLI**

Open the local URL, snapshot before each interaction, and capture screenshots at `2048x1174`, `1440x900`, and `390x844`. Verify:

```text
- first-scene hand guide is visible and all four choice buttons fit without covering the dialogue or sound toggle
- every data scene places the board before the notes in DOM and visually stacks them
- board label and title are centered
- chart viewport hides the embedded duplicate title while the page figcaption remains visible
- time-scene chart, supplied paragraph, 结语, and final sentence appear in order
- photo wall contains 13 unique source images and the lightbox opens the three new images
- message identities read 受访者01 through 受访者08
```

Check `console error` output and confirm no application errors.

- [ ] **Step 4: Audit the final diff and commit fixes**

Run:

```powershell
git diff --check
git status --short
git log --oneline --decorate -10
```

Expected: no whitespace errors, no unintended files, and all requested commits present. Commit only failure-driven corrections with `fix: complete requested site refresh`.
