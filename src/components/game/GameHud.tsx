type GameHudProps = {
  chapter: number
  total: number
  trust: number
  energy: number
  onRestart: () => void
}

export function GameHud({ chapter, total, trust, energy, onRestart }: GameHudProps) {
  return (
    <header className="game-hud" aria-label="游戏状态">
      <button className="hud-brand" type="button" onClick={onRestart}>
        <span className="hud-brand-mark" />
        成为一天陪护志愿者
      </button>
      <div className="hud-stats">
        <span>
          第 {chapter}/{total} 幕
        </span>
        <span>信任 {trust}</span>
        <span>精力 {energy}</span>
      </div>
    </header>
  )
}
