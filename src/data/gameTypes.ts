export type GamePhase = 'opening' | 'scene' | 'feedback' | 'summary'

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
  poses?: CharacterPoseKey[]
}

export type SceneChoice = {
  id: ChoiceId
  label: string
  trustDelta: number
  energyDelta: number
  result: string
  careTip: string
  tone: ChoiceTone
  resultPoses?: CharacterPoseKey[]
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
  resultPoses?: CharacterPoseKey[]
}

export type EndingLevel = 'excellent' | 'warm' | 'hard' | 'misunderstood'
