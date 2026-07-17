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
