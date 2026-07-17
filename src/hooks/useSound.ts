import { useCallback, useMemo } from 'react'
import { Howl } from 'howler'
import { useGameStore } from '../store/gameStore'

const pianoFrequencies = {
  c: 261.63,
  e: 329.63,
  g: 392,
}

function playTone(frequency: number, duration = 0.38) {
  const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextCtor) return
  const context = new AudioContextCtor()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.frequency.value = frequency
  oscillator.type = 'sine'
  gain.gain.setValueAtTime(0.001, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + duration + 0.02)
}

export function useSound() {
  const soundEnabled = useGameStore((state) => state.soundEnabled)

  const roomTone = useMemo(
    () =>
      new Howl({
        src: [],
        volume: 0,
      }),
    [],
  )

  const playPianoNote = useCallback(
    (note: keyof typeof pianoFrequencies) => {
      if (!soundEnabled) return
      playTone(pianoFrequencies[note])
    },
    [soundEnabled],
  )

  return { roomTone, playPianoNote, soundEnabled }
}
