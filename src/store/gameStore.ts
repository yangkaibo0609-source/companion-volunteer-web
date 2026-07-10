import { create } from 'zustand'
import { gameScenes } from '../data/gameScript'
import type { ChoiceId, ChoiceRecord, GamePhase } from '../data/gameTypes'
import { clampScore, INITIAL_ENERGY, INITIAL_TRUST } from '../utils/gameScore'

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

const initialState = {
  phase: 'opening' as GamePhase,
  currentSceneIndex: 0,
  currentLineIndex: 0,
  trust: INITIAL_TRUST,
  energy: INITIAL_ENERGY,
  selectedChoices: [] as ChoiceRecord[],
  activeFeedback: null as ChoiceRecord | null,
  soundEnabled: false,
  reducedMotion: false,
}

function getQueryParam(name: string) {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get(name)
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  completeOpening: () => {
    set({ phase: 'scene', currentSceneIndex: 0, currentLineIndex: 0, activeFeedback: null })
  },
  continueLine: () => {
    const state = get()
    const scene = gameScenes[state.currentSceneIndex]
    if (!scene) return

    set({
      currentLineIndex: Math.min(state.currentLineIndex + 1, scene.lines.length - 1),
    })
  },
  selectChoice: (choiceId) => {
    const state = get()
    const scene = gameScenes[state.currentSceneIndex]
    const choice = scene?.choices.find((item) => item.id === choiceId)
    if (!scene || !choice || state.phase !== 'scene') return

    const record: ChoiceRecord = {
      sceneId: scene.id,
      sceneTitle: scene.title,
      choiceId,
      choiceLabel: choice.label,
      trustDelta: choice.trustDelta,
      energyDelta: choice.energyDelta,
      result: choice.result,
      careTip: choice.careTip,
      tone: choice.tone,
      resultPoses: choice.resultPoses,
    }

    set({
      phase: 'feedback',
      trust: clampScore(state.trust + choice.trustDelta),
      energy: clampScore(state.energy + choice.energyDelta),
      selectedChoices: [...state.selectedChoices, record],
      activeFeedback: record,
    })
  },
  continueAfterFeedback: () => {
    const state = get()
    const isLastScene = state.currentSceneIndex >= gameScenes.length - 1

    if (isLastScene) {
      set({ phase: 'summary', activeFeedback: null })
      return
    }

    set({
      phase: 'scene',
      currentSceneIndex: state.currentSceneIndex + 1,
      currentLineIndex: 0,
      activeFeedback: null,
    })
  },
  restart: () => {
    const qaMode = getQueryParam('qa')
    if (qaMode === 'summary') {
      set({
        ...initialState,
        phase: 'summary',
        trust: 92,
        energy: 78,
        selectedChoices: gameScenes.map((scene) => {
          const choice = scene.choices.find((item) => item.id === scene.recommendedChoiceId) ?? scene.choices[0]
          return {
            sceneId: scene.id,
            sceneTitle: scene.title,
            choiceId: choice.id,
            choiceLabel: choice.label,
            trustDelta: choice.trustDelta,
            energyDelta: choice.energyDelta,
            result: choice.result,
            careTip: choice.careTip,
            tone: choice.tone,
            resultPoses: choice.resultPoses,
          }
        }),
      })
      return
    }

    set({ ...initialState })
  },
  setSoundEnabled: (value) => set({ soundEnabled: value }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
}))
