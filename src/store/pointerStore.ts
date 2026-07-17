import { create } from 'zustand'

type PointerStore = {
  x: number
  y: number
  speed: number
  isIdle: boolean
  idleMs: number
  hoveredHotspotId: string | null
  proximityToXiaoYu: number
  pressureLevel: number
  setPointer: (value: Partial<Omit<PointerStore, 'setPointer' | 'setHoveredHotspot'>>) => void
  setHoveredHotspot: (hotspotId: string | null) => void
}

export const usePointerStore = create<PointerStore>((set) => ({
  x: 0,
  y: 0,
  speed: 0,
  isIdle: true,
  idleMs: 0,
  hoveredHotspotId: null,
  proximityToXiaoYu: 0,
  pressureLevel: 0,
  setPointer: (value) => set(value),
  setHoveredHotspot: (hoveredHotspotId) => set({ hoveredHotspotId }),
}))
