import { usePointerVelocity } from '../../hooks/usePointerVelocity'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function PointerTracker() {
  usePointerVelocity()
  useReducedMotion()
  return null
}
