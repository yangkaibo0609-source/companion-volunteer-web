import { useGameStore } from '../../store/gameStore'

export function SoundToggle() {
  const soundEnabled = useGameStore((state) => state.soundEnabled)
  const setSoundEnabled = useGameStore((state) => state.setSoundEnabled)

  return (
    <button
      className="sound-toggle"
      type="button"
      aria-pressed={soundEnabled}
      aria-label={soundEnabled ? '关闭声音' : '开启声音'}
      onClick={() => setSoundEnabled(!soundEnabled)}
    >
      <span aria-hidden="true">{soundEnabled ? '声' : '静'}</span>
    </button>
  )
}
