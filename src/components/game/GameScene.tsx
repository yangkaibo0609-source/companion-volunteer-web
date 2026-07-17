import { useEffect, useMemo, useState } from 'react'
import { sceneAssets } from '../../data/assetMap'
import { gameScenes } from '../../data/gameScript'
import { useGameStore } from '../../store/gameStore'
import { CharacterLayer } from './CharacterLayer'
import { ChoiceList } from './ChoiceList'
import { DialogBox } from './DialogBox'
import { GameHud } from './GameHud'
import { SceneFeedback } from './SceneFeedback'

type GameSceneProps = {
  onRestart: () => void
}

export function GameScene({ onRestart }: GameSceneProps) {
  const [showClickHint, setShowClickHint] = useState(true)
  const phase = useGameStore((state) => state.phase)
  const currentSceneIndex = useGameStore((state) => state.currentSceneIndex)
  const currentLineIndex = useGameStore((state) => state.currentLineIndex)
  const trust = useGameStore((state) => state.trust)
  const energy = useGameStore((state) => state.energy)
  const activeFeedback = useGameStore((state) => state.activeFeedback)
  const continueLine = useGameStore((state) => state.continueLine)
  const selectChoice = useGameStore((state) => state.selectChoice)
  const continueAfterFeedback = useGameStore((state) => state.continueAfterFeedback)
  const scene = gameScenes[currentSceneIndex]
  const line = scene.lines[currentLineIndex]
  const hasMoreLines = currentLineIndex < scene.lines.length - 1
  const activePoses = useMemo(() => {
    if (phase === 'feedback' && activeFeedback?.resultPoses?.length) return activeFeedback.resultPoses
    return line.poses?.length ? line.poses : scene.defaultPoses
  }, [activeFeedback, line.poses, phase, scene.defaultPoses])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.key === 'Enter' || event.key === ' ') && phase === 'feedback') {
        event.preventDefault()
        continueAfterFeedback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [continueAfterFeedback, phase])

  return (
    <main className="game-scene">
      <img className="game-background" src={sceneAssets[scene.background]} alt={`${scene.title}场景`} />
      <div className="game-background-tint" />
      <GameHud chapter={scene.chapter} total={gameScenes.length} trust={trust} energy={energy} onRestart={onRestart} />
      <section className="scene-title" aria-label="当前章节">
        <span>第 {scene.chapter} 幕</span>
        <h1>{scene.title}</h1>
        <p>{scene.subtitle}</p>
      </section>
      <CharacterLayer poses={activePoses} />

      <div className="game-control-layer">
        {phase === 'scene' && (
          <>
            <DialogBox
              speaker={line.speaker}
              text={line.text}
              canAdvance={hasMoreLines}
              onNext={continueLine}
              showClickHint={showClickHint}
              onInteraction={() => setShowClickHint(false)}
            />
            {!hasMoreLines && <ChoiceList choices={scene.choices} onSelect={selectChoice} />}
          </>
        )}
      </div>

      {phase === 'feedback' && activeFeedback && (
        <SceneFeedback record={activeFeedback} onContinue={continueAfterFeedback} />
      )}
    </main>
  )
}
