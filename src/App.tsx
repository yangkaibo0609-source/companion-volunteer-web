import { useCallback, useEffect, useMemo, useState } from 'react'
import { GameScene } from './components/game/GameScene'
import { ExperienceShell } from './components/layout/ExperienceShell'
import { BadgeOpening3D } from './components/opening/BadgeOpening3D'
import { SummaryPage } from './components/summary/SummaryPage'
import { characterAssets, openingBadgeAssets, sceneAssets } from './data/assetMap'
import { useGameStore } from './store/gameStore'
import { preloadImages } from './utils/assetPreload'

const primaryAssets = [...Object.values(sceneAssets), ...Object.values(characterAssets), ...Object.values(openingBadgeAssets)]

function App() {
  const [isReady, setIsReady] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const phase = useGameStore((state) => state.phase)
  const completeOpening = useGameStore((state) => state.completeOpening)
  const restart = useGameStore((state) => state.restart)
  const setReducedMotion = useGameStore((state) => state.setReducedMotion)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(media.matches)

    function handleChange(event: MediaQueryListEvent) {
      setReducedMotion(event.matches)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [setReducedMotion])

  useEffect(() => {
    let active = true
    preloadImages(primaryAssets)
      .then(() => {
        if (active) setIsReady(true)
      })
      .catch((error: unknown) => {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : '素材加载失败')
        setIsReady(true)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!isReady) return
    const qaMode = new URLSearchParams(window.location.search).get('qa')
    if (qaMode === 'summary') {
      restart()
    }
  }, [isReady, restart])

  const handleRestart = useCallback(() => {
    restart()
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }, [restart])

  const shellMode = useMemo(() => {
    if (phase === 'summary') return 'summary'
    if (phase === 'opening') return 'opening'
    return 'scene'
  }, [phase])

  if (!isReady) {
    return (
      <main className="loading-screen" aria-live="polite">
        <div className="paper-loader">
          <span className="loader-line" />
          <h1>正在整理活动中心</h1>
          <p>{loadError ?? '请稍等，场景与角色正在进入今天的陪护任务。'}</p>
        </div>
      </main>
    )
  }

  return (
    <ExperienceShell mode={shellMode} onRestart={handleRestart}>
      {phase === 'opening' && <BadgeOpening3D onEnter={completeOpening} />}
      {(phase === 'scene' || phase === 'feedback') && <GameScene onRestart={handleRestart} />}
      {phase === 'summary' && <SummaryPage onRestart={handleRestart} />}
    </ExperienceShell>
  )
}

export default App
