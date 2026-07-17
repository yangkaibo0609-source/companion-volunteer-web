import type { ReactNode } from 'react'
import { PointerTracker } from '../pointer/PointerTracker'
import { AmbientSoundController } from './AmbientSoundController'
import { SoundToggle } from './SoundToggle'
import { TopStatusBar } from './TopStatusBar'

type ExperienceShellProps = {
  children: ReactNode
  mode: 'opening' | 'scene' | 'summary'
  onRestart: () => void
}

export function ExperienceShell({ children, mode, onRestart }: ExperienceShellProps) {
  return (
    <div className={`experience-shell experience-shell--${mode}`}>
      <PointerTracker />
      {mode !== 'scene' && <TopStatusBar mode={mode} onRestart={onRestart} />}
      <SoundToggle />
      <AmbientSoundController />
      {children}
    </div>
  )
}
