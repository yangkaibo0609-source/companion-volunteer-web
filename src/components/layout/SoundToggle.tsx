import { useGameStore } from '../../store/gameStore'

export function SoundToggle() {
  const soundEnabled = useGameStore((state) => state.soundEnabled)
  const setSoundEnabled = useGameStore((state) => state.setSoundEnabled)

  return (
    <button
      className={`sound-toggle${soundEnabled ? ' is-on' : ''}`}
      type="button"
      aria-pressed={soundEnabled}
      aria-label={soundEnabled ? '关闭背景音乐与文字提示音' : '开启背景音乐与文字提示音'}
      onClick={() => setSoundEnabled(!soundEnabled)}
    >
      <span className="sound-toggle__icon" aria-hidden="true">
        {soundEnabled ? '♪' : '静'}
      </span>
      <span className="sound-toggle__label">{soundEnabled ? '氛围乐' : '开声音'}</span>
    </button>
  )
}
