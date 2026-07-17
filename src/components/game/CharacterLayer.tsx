import { characterAssets } from '../../data/assetMap'
import type { CharacterPoseKey } from '../../data/gameTypes'

type CharacterLayerProps = {
  poses: CharacterPoseKey[]
}

function getRoleClass(pose: CharacterPoseKey, index: number, total: number) {
  if (pose.startsWith('duo')) return 'character-sprite--duo'
  if (pose.startsWith('volunteer')) return 'character-sprite--volunteer'
  if (pose.startsWith('boy')) return 'character-sprite--boy'
  return total === 1 ? 'character-sprite--solo' : index === 0 ? 'character-sprite--left' : 'character-sprite--right'
}

export function CharacterLayer({ poses }: CharacterLayerProps) {
  return (
    <div className="character-layer" aria-hidden="true">
      {poses.map((pose, index) => (
        <img
          key={`${pose}-${index}`}
          className={`character-sprite ${getRoleClass(pose, index, poses.length)}`}
          src={characterAssets[pose]}
          alt=""
        />
      ))}
    </div>
  )
}
