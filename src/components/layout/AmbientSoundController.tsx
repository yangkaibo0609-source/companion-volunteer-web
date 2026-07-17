import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'

type ManagedAudio = {
  context: AudioContext
  masterGain: GainNode
  padGain: GainNode
  melodyGain: GainNode
  oscillators: OscillatorNode[]
  filter: BiquadFilterNode
}

function getAudioContextCtor() {
  return window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
}

function startPad(): ManagedAudio | null {
  const AudioContextCtor = getAudioContextCtor()
  if (!AudioContextCtor) return null

  const context = new AudioContextCtor()
  const masterGain = context.createGain()
  const padGain = context.createGain()
  const melodyGain = context.createGain()
  const filter = context.createBiquadFilter()
  const oscillators: OscillatorNode[] = []

  masterGain.gain.setValueAtTime(0.0001, context.currentTime)
  masterGain.gain.exponentialRampToValueAtTime(0.34, context.currentTime + 1.2)
  padGain.gain.setValueAtTime(0.0001, context.currentTime)
  padGain.gain.exponentialRampToValueAtTime(0.072, context.currentTime + 1.8)
  melodyGain.gain.setValueAtTime(0.0001, context.currentTime)
  melodyGain.gain.exponentialRampToValueAtTime(0.42, context.currentTime + 1)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(920, context.currentTime)
  filter.Q.setValueAtTime(0.48, context.currentTime)

  const lfo = context.createOscillator()
  const lfoGain = context.createGain()
  lfo.frequency.setValueAtTime(0.045, context.currentTime)
  lfoGain.gain.setValueAtTime(120, context.currentTime)
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()
  oscillators.push(lfo)

  const frequencies = [174.61, 220, 261.63, 329.63, 392]
  frequencies.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = index % 2 === 0 ? 'sine' : 'triangle'
    oscillator.frequency.setValueAtTime(frequency, context.currentTime)
    oscillator.detune.setValueAtTime((index - 1.5) * 4, context.currentTime)
    gain.gain.setValueAtTime(0.16 / frequencies.length, context.currentTime)
    oscillator.connect(gain)
    gain.connect(filter)
    oscillator.start()
    oscillators.push(oscillator)
  })

  filter.connect(padGain)
  padGain.connect(masterGain)
  melodyGain.connect(masterGain)
  masterGain.connect(context.destination)

  void context.resume()

  return { context, masterGain, padGain, melodyGain, oscillators, filter }
}

function stopPad(audio: ManagedAudio | null) {
  if (!audio) return
  const { context, masterGain, oscillators } = audio
  const now = context.currentTime
  masterGain.gain.cancelScheduledValues(now)
  masterGain.gain.setTargetAtTime(0.0001, now, 0.28)
  window.setTimeout(() => {
    oscillators.forEach((oscillator) => {
      try {
        oscillator.stop()
      } catch {
        // oscillator may already be stopped
      }
    })
    void context.close()
  }, 760)
}

function playBell(audio: ManagedAudio | null, frequency: number, startsAt: number, duration = 2.3, peak = 0.08) {
  if (!audio) return
  const { context, melodyGain } = audio
  const output = context.createGain()
  const filter = context.createBiquadFilter()
  const oscillator = context.createOscillator()
  const overtone = context.createOscillator()
  const overtoneGain = context.createGain()

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(2600, startsAt)
  filter.Q.setValueAtTime(0.7, startsAt)

  output.gain.setValueAtTime(0.0001, startsAt)
  output.gain.exponentialRampToValueAtTime(peak, startsAt + 0.06)
  output.gain.setTargetAtTime(0.0001, startsAt + 0.28, duration / 4)

  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(frequency, startsAt)
  overtone.type = 'sine'
  overtone.frequency.setValueAtTime(frequency * 2.01, startsAt)
  overtoneGain.gain.setValueAtTime(0.22, startsAt)

  oscillator.connect(output)
  overtone.connect(overtoneGain)
  overtoneGain.connect(output)
  output.connect(filter)
  filter.connect(melodyGain)

  oscillator.start(startsAt)
  overtone.start(startsAt)
  oscillator.stop(startsAt + duration)
  overtone.stop(startsAt + duration)
}

function playAmbientMotif(audio: ManagedAudio | null) {
  if (!audio) return
  const { context } = audio
  const now = context.currentTime + 0.08
  const notes = [
    { frequency: 392, offset: 0, peak: 0.07 },
    { frequency: 493.88, offset: 0.72, peak: 0.055 },
    { frequency: 523.25, offset: 1.48, peak: 0.06 },
    { frequency: 659.25, offset: 2.36, peak: 0.047 },
    { frequency: 587.33, offset: 3.34, peak: 0.052 },
  ]

  playBell(audio, 220, now, 4.4, 0.034)
  notes.forEach((note) => playBell(audio, note.frequency, now + note.offset, 2.15, note.peak))
}

function playTextChime(audio: ManagedAudio | null, tone: 'line' | 'choice' | 'summary' = 'line') {
  if (!audio) return
  const { context, masterGain } = audio
  const now = context.currentTime
  const output = context.createGain()
  const filter = context.createBiquadFilter()
  const notes = tone === 'choice' ? [523.25, 659.25] : tone === 'summary' ? [392, 523.25, 659.25] : [440, 523.25]

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(2400, now)
  output.gain.setValueAtTime(0.0001, now)
  output.gain.exponentialRampToValueAtTime(tone === 'summary' ? 0.1 : 0.07, now + 0.04)
  output.gain.exponentialRampToValueAtTime(0.0001, now + 0.82)
  output.connect(filter)
  filter.connect(masterGain)

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.055)
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.045 + index * 0.055)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.62 + index * 0.06)
    oscillator.connect(gain)
    gain.connect(output)
    oscillator.start(now + index * 0.055)
    oscillator.stop(now + 0.88 + index * 0.06)
  })
}

export function AmbientSoundController() {
  const soundEnabled = useGameStore((state) => state.soundEnabled)
  const phase = useGameStore((state) => state.phase)
  const currentSceneIndex = useGameStore((state) => state.currentSceneIndex)
  const currentLineIndex = useGameStore((state) => state.currentLineIndex)
  const activeFeedback = useGameStore((state) => state.activeFeedback)
  const audioRef = useRef<ManagedAudio | null>(null)
  const lastTextKey = useRef('')
  const motifTimerRef = useRef<number | null>(null)

  function clearMotifTimer() {
    if (motifTimerRef.current) {
      window.clearInterval(motifTimerRef.current)
      motifTimerRef.current = null
    }
  }

  useEffect(() => {
    if (soundEnabled && !audioRef.current) {
      audioRef.current = startPad()
      playTextChime(audioRef.current, 'summary')
      playAmbientMotif(audioRef.current)
      motifTimerRef.current = window.setInterval(() => {
        playAmbientMotif(audioRef.current)
      }, 7200)
    }

    if (!soundEnabled && audioRef.current) {
      clearMotifTimer()
      stopPad(audioRef.current)
      audioRef.current = null
    }

    return () => {
      clearMotifTimer()
      if (audioRef.current) {
        stopPad(audioRef.current)
        audioRef.current = null
      }
    }
  }, [soundEnabled])

  useEffect(() => {
    if (!soundEnabled) return
    const textKey = `${phase}-${currentSceneIndex}-${currentLineIndex}-${activeFeedback?.choiceId ?? 'none'}`
    if (textKey === lastTextKey.current) return
    lastTextKey.current = textKey
    playTextChime(audioRef.current, phase === 'feedback' ? 'choice' : phase === 'summary' ? 'summary' : 'line')
  }, [activeFeedback?.choiceId, currentLineIndex, currentSceneIndex, phase, soundEnabled])

  return null
}
