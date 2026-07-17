import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function useReducedMotion() {
  const setReducedMotion = useGameStore((state) => state.setReducedMotion)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [setReducedMotion])
}
