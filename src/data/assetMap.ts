import boyFirstMeet from '../assets/game/characters/boy-first-meet.png'
import boyMeal from '../assets/game/characters/boy-meal.png'
import boyOverload from '../assets/game/characters/boy-overload.png'
import boyPiano from '../assets/game/characters/boy-piano.png'
import boyRefuse from '../assets/game/characters/boy-refuse.png'
import boyWalk from '../assets/game/characters/boy-walk.png'
import badgeBack from '../assets/opening/badge-back.jpg'
import badgeFront from '../assets/opening/badge-front.jpg'
import duoComfort from '../assets/game/characters/duo-comfort.png'
import duoDrawing from '../assets/game/characters/duo-drawing.png'
import volunteerHug from '../assets/game/characters/volunteer-hug.png'
import volunteerIgnore from '../assets/game/characters/volunteer-ignore.png'
import volunteerObserve from '../assets/game/characters/volunteer-observe.png'
import volunteerPrompt from '../assets/game/characters/volunteer-prompt.png'
import volunteerStrict from '../assets/game/characters/volunteer-strict.png'
import scene01 from '../assets/game/scenes/scene-01.png'
import scene02 from '../assets/game/scenes/scene-02.png'
import scene03 from '../assets/game/scenes/scene-03.png'
import scene04 from '../assets/game/scenes/scene-04.png'
import scene05 from '../assets/game/scenes/scene-05.png'
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

export const openingBadgeAssets = {
  front: badgeFront,
  back: badgeBack,
}
