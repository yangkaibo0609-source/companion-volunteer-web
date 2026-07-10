import { gameScenes } from '../../data/gameScript'
import { useGameStore } from '../../store/gameStore'

type TopStatusBarProps = {
  mode: 'opening' | 'scene' | 'summary'
  onRestart: () => void
}

export function TopStatusBar({ mode, onRestart }: TopStatusBarProps) {
  const currentSceneIndex = useGameStore((state) => state.currentSceneIndex)
  const trust = useGameStore((state) => state.trust)
  const energy = useGameStore((state) => state.energy)
  const selectedChoices = useGameStore((state) => state.selectedChoices)
  const scene = gameScenes[currentSceneIndex]
  const statusText = mode === 'opening' ? '拉动陪护证开始' : mode === 'summary' ? '今日陪护记录' : scene.title

  return (
    <header className="top-status" aria-label="体验状态">
      <button className="brand-button" type="button" onClick={onRestart}>
        <span className="brand-mark" aria-hidden="true" />
        <span>陪护志愿者</span>
      </button>

      <div className="status-cluster">
        <span>{statusText}</span>
        {mode !== 'opening' && <span>信任 {trust}</span>}
        {mode !== 'opening' && <span>精力 {energy}</span>}
        {mode === 'summary' && <span>{selectedChoices.length} 次选择</span>}
      </div>
    </header>
  )
}
