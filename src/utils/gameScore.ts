import type { ChoiceRecord, ChoiceTone, EndingLevel } from '../data/gameTypes'

export const INITIAL_TRUST = 50
export const INITIAL_ENERGY = 100

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, value))
}

export function formatDelta(value: number) {
  if (value > 0) return `+${value}`
  return `${value}`
}

export function getEndingLevel(trust: number, energy: number): EndingLevel {
  if (trust >= 90 && energy >= 60) return 'excellent'
  if (trust >= 70 && trust < 90 && energy >= 60) return 'warm'
  if (trust >= 50 && trust <= 69 && energy < 60) return 'hard'
  return 'misunderstood'
}

export function countTone(records: ChoiceRecord[], tone: ChoiceTone) {
  return records.filter((record) => record.tone === tone).length
}
