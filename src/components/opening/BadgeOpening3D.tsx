import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import scenePreview from '../../assets/game/scenes/scene-01.png'
import { openingBadgeAssets } from '../../data/assetMap'
import { useBadgeDrag } from './useBadgeDrag'

type BadgeOpening3DProps = {
  onEnter: () => void
}

type PointerState = {
  active: boolean
  lastMoveTime: number
  world: THREE.Vector3
}

type BadgePhysicsState = {
  position: THREE.Vector3
  velocity: THREE.Vector3
  rotation: THREE.Vector3
  rotationVelocity: THREE.Vector3
}

const CARD_WIDTH = 1.42
const CARD_HEIGHT = 2.48
const CARD_DEPTH = 0.07
const CARD_FACE_Z = 0.064
const CARD_RADIUS = 0.15
const BASE_BADGE_Y = -0.42
const POINTER_REPEL_RADIUS = 1.36

function createRoundedRectShape(width: number, height: number, radius: number) {
  const x = -width / 2
  const y = -height / 2
  const shape = new THREE.Shape()

  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)

  return shape
}

function makeBadgeBodyGeometry() {
  const geometry = new THREE.ExtrudeGeometry(createRoundedRectShape(CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS), {
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.024,
    bevelThickness: 0.024,
    depth: CARD_DEPTH,
    steps: 1,
  })
  geometry.translate(0, 0, -CARD_DEPTH / 2)
  return geometry
}

function makeRopeGeometry(points: THREE.Vector3[]) {
  const curve = new THREE.CatmullRomCurve3(points)
  return new THREE.TubeGeometry(curve, 28, 0.018, 8, false)
}

function updateRopeGeometry(mesh: THREE.Mesh<THREE.TubeGeometry, THREE.MeshStandardMaterial>, points: THREE.Vector3[]) {
  const nextGeometry = makeRopeGeometry(points)
  mesh.geometry.dispose()
  mesh.geometry = nextGeometry
}

function createRopePoints({
  anchor,
  end,
  side,
  elapsed,
  proximity,
  pullProgress,
  physics,
}: {
  anchor: THREE.Vector3
  end: THREE.Vector3
  side: -1 | 1
  elapsed: number
  proximity: number
  pullProgress: number
  physics: BadgePhysicsState
}) {
  const midA = anchor.clone().lerp(end, 0.35)
  const midB = anchor.clone().lerp(end, 0.72)
  const slack = THREE.MathUtils.lerp(0.2, 0.06, pullProgress)
  const elasticWave =
    Math.sin(elapsed * 3.1 + side * 1.7) * 0.045 +
    Math.sin(elapsed * 7.4 + side * 2.8) * 0.022 +
    physics.velocity.x * 0.045
  const repelWave = proximity * (Math.sin(elapsed * 11.2 + side * 0.9) * 0.09 + side * 0.035)
  const zWave = physics.position.z * 0.35 + proximity * Math.sin(elapsed * 9.6 + side * 2.2) * 0.1

  midA.x += side * 0.06 + elasticWave * 0.55 + repelWave * 0.35
  midA.y -= slack * 0.34
  midA.z += zWave * 0.35

  midB.x += elasticWave + repelWave
  midB.y -= slack
  midB.z += zWave

  return [anchor.clone(), midA, midB, end.clone()]
}

function getPointerWorld(event: PointerEvent, mount: HTMLDivElement, camera: THREE.PerspectiveCamera) {
  const rect = mount.getBoundingClientRect()
  const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const normalizedY = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
  const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
  const halfWidth = halfHeight * camera.aspect

  return new THREE.Vector3(normalizedX * halfWidth, camera.position.y + normalizedY * halfHeight, 0)
}

export function BadgeOpening3D({ onEnter }: BadgeOpening3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const { dragY, progress, isDragging, isTriggered, dragHandlers } = useBadgeDrag(onEnter)
  const dragYRef = useRef(dragY)
  const progressRef = useRef(progress)

  useEffect(() => {
    dragYRef.current = dragY
    progressRef.current = progress
  }, [dragY, progress])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const mountElement = mount

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, mountElement.clientWidth / mountElement.clientHeight, 0.1, 100)
    camera.position.set(0, 0.2, 7)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight)
    mountElement.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 1.82)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xf9de79, 2.15)
    key.position.set(2, 3, 4)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xa5ca8b, 1.2)
    fill.position.set(-3, 1.5, 2)
    scene.add(fill)

    const textureLoader = new THREE.TextureLoader()
    const frontTexture = textureLoader.load(openingBadgeAssets.front)
    const backTexture = textureLoader.load(openingBadgeAssets.back)
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
    ;[frontTexture, backTexture].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = maxAnisotropy
    })

    const badgeBodyGeometry = makeBadgeBodyGeometry()
    const cardFaceGeometry = new THREE.PlaneGeometry(CARD_WIDTH * 0.955, CARD_HEIGHT * 0.955, 1, 1)
    const clipGeometry = new THREE.TorusGeometry(0.145, 0.018, 12, 34)
    const metalConnectorGeometry = new THREE.CylinderGeometry(0.018, 0.018, 0.24, 14)

    const cardMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#9fbc70'),
      metalness: 0.04,
      roughness: 0.5,
    })
    const cardSideMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7ea85f'),
      metalness: 0.08,
      roughness: 0.48,
    })
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      metalness: 0.02,
      roughness: 0.44,
    })
    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      metalness: 0.02,
      roughness: 0.46,
    })
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d7dcd0'),
      metalness: 0.72,
      roughness: 0.22,
    })
    const ropeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0d8f8f'),
      metalness: 0.04,
      roughness: 0.52,
    })
    const repelMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#f9de79'),
      opacity: 0,
      transparent: true,
      depthWrite: false,
    })

    const badgeGroup = new THREE.Group()
    const badge = new THREE.Mesh(badgeBodyGeometry, [cardSideMaterial, cardSideMaterial, cardMaterial])
    badgeGroup.add(badge)

    const frontFace = new THREE.Mesh(cardFaceGeometry, frontMaterial)
    frontFace.position.z = CARD_FACE_Z
    badgeGroup.add(frontFace)

    const backFace = new THREE.Mesh(cardFaceGeometry, backMaterial)
    backFace.position.z = -CARD_FACE_Z
    backFace.rotation.y = Math.PI
    badgeGroup.add(backFace)

    const clip = new THREE.Mesh(clipGeometry, metalMaterial)
    clip.position.y = CARD_HEIGHT / 2 + 0.12
    clip.position.z = 0.038
    badgeGroup.add(clip)

    const connector = new THREE.Mesh(metalConnectorGeometry, metalMaterial)
    connector.position.y = CARD_HEIGHT / 2 + 0.035
    connector.position.z = 0.037
    connector.rotation.z = 0.08
    badgeGroup.add(connector)

    badgeGroup.position.set(0, BASE_BADGE_Y, 0)
    scene.add(badgeGroup)

    const leftAnchor = new THREE.Vector3(-0.48, 3.08, -0.04)
    const rightAnchor = new THREE.Vector3(0.48, 3.08, -0.04)
    const initialLeftEnd = new THREE.Vector3(-0.17, CARD_HEIGHT / 2 + BASE_BADGE_Y + 0.1, 0.02)
    const initialRightEnd = new THREE.Vector3(0.17, CARD_HEIGHT / 2 + BASE_BADGE_Y + 0.1, 0.02)
    const leftRope = new THREE.Mesh(makeRopeGeometry([leftAnchor, initialLeftEnd]), ropeMaterial)
    const rightRope = new THREE.Mesh(makeRopeGeometry([rightAnchor, initialRightEnd]), ropeMaterial)
    scene.add(leftRope, rightRope)

    const repelField = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.36, 42), repelMaterial)
    repelField.position.z = 0.04
    scene.add(repelField)

    const pointerState: PointerState = {
      active: false,
      lastMoveTime: 0,
      world: new THREE.Vector3(20, 20, 0),
    }
    const physics: BadgePhysicsState = {
      position: new THREE.Vector3(0, BASE_BADGE_Y, 0),
      velocity: new THREE.Vector3(),
      rotation: new THREE.Vector3(0.06, 0.06, 0),
      rotationVelocity: new THREE.Vector3(),
    }

    function handlePointerMove(event: PointerEvent) {
      pointerState.active = true
      pointerState.lastMoveTime = performance.now()
      pointerState.world.copy(getPointerWorld(event, mountElement, camera))
    }

    function handlePointerLeave() {
      pointerState.active = false
    }

    const startTime = performance.now()
    let lastFrameTime = startTime
    let frame = 0

    function render(now = performance.now()) {
      const elapsed = (now - startTime) / 1000
      const dt = Math.min(0.033, Math.max(0.001, (now - lastFrameTime) / 1000))
      lastFrameTime = now
      const pullProgress = progressRef.current
      const pullDistance = dragYRef.current / 175
      const idleSwing = Math.sin(elapsed * 1.22) * 0.04
      const baseTarget = new THREE.Vector3(
        Math.sin(elapsed * 1.45) * 0.025,
        BASE_BADGE_Y - pullDistance + Math.sin(elapsed * 1.7) * 0.018,
        Math.sin(elapsed * 1.1) * 0.015,
      )

      const isPointerFresh = pointerState.active && now - pointerState.lastMoveTime < 900
      const toBadge = physics.position.clone().sub(pointerState.world)
      const pointerDistance = Math.max(0.001, Math.hypot(toBadge.x, toBadge.y))
      const proximity = isPointerFresh
        ? Math.max(0, 1 - pointerDistance / POINTER_REPEL_RADIUS) * (1 - pullProgress * 0.25)
        : 0

      const springForce = baseTarget.sub(physics.position).multiplyScalar(20)
      physics.velocity.addScaledVector(springForce, dt)

      if (proximity > 0) {
        const awayX = toBadge.x / pointerDistance
        const awayY = toBadge.y / pointerDistance
        const randomX = Math.sin(elapsed * 9.8 + 1.7) * 1.1 + Math.sin(elapsed * 17.1) * 0.42
        const randomY = Math.cos(elapsed * 11.6 + 0.9) * 0.92 + Math.sin(elapsed * 15.2) * 0.36
        const randomZ = Math.sin(elapsed * 13.8 + 2.5) * 1.2
        physics.velocity.x += (awayX * 4.6 + randomX) * proximity * dt
        physics.velocity.y += (awayY * 3.2 + randomY) * proximity * dt
        physics.velocity.z += (0.9 + randomZ * 0.72) * proximity * dt
      }

      physics.velocity.multiplyScalar(Math.pow(0.1, dt))
      physics.position.addScaledVector(physics.velocity, dt)

      const rotationTarget = new THREE.Vector3(
        0.06 + pullProgress * 0.24 + physics.velocity.y * 0.05 + proximity * Math.sin(elapsed * 10.5) * 0.08,
        0.08 + idleSwing + pullProgress * Math.PI + physics.position.x * 0.16 + physics.velocity.x * 0.09,
        -physics.position.x * 0.24 + idleSwing * 0.7 + proximity * Math.cos(elapsed * 12.6) * 0.09,
      )
      physics.rotationVelocity.addScaledVector(rotationTarget.sub(physics.rotation).multiplyScalar(17), dt)
      physics.rotationVelocity.multiplyScalar(Math.pow(0.08, dt))
      physics.rotation.addScaledVector(physics.rotationVelocity, dt)

      badgeGroup.position.copy(physics.position)
      badgeGroup.rotation.set(physics.rotation.x, physics.rotation.y, physics.rotation.z)
      badgeGroup.scale.setScalar(1 + pullProgress * 0.08)
      badgeGroup.updateMatrixWorld(true)

      const leftAttach = badgeGroup.localToWorld(new THREE.Vector3(-0.16, CARD_HEIGHT / 2 + 0.11, 0.02))
      const rightAttach = badgeGroup.localToWorld(new THREE.Vector3(0.16, CARD_HEIGHT / 2 + 0.11, 0.02))
      updateRopeGeometry(
        leftRope,
        createRopePoints({
          anchor: leftAnchor,
          end: leftAttach,
          side: -1,
          elapsed,
          proximity,
          pullProgress,
          physics,
        }),
      )
      updateRopeGeometry(
        rightRope,
        createRopePoints({
          anchor: rightAnchor,
          end: rightAttach,
          side: 1,
          elapsed,
          proximity,
          pullProgress,
          physics,
        }),
      )

      repelField.position.x = pointerState.world.x
      repelField.position.y = pointerState.world.y
      repelField.scale.setScalar(0.85 + proximity * 0.9)
      repelMaterial.opacity = proximity * 0.18

      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(render)
    }

    function resize() {
      camera.aspect = mountElement.clientWidth / mountElement.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountElement.clientWidth, mountElement.clientHeight)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    render()

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)

      badgeBodyGeometry.dispose()
      cardFaceGeometry.dispose()
      clipGeometry.dispose()
      metalConnectorGeometry.dispose()
      leftRope.geometry.dispose()
      rightRope.geometry.dispose()
      repelField.geometry.dispose()

      frontTexture.dispose()
      backTexture.dispose()
      cardMaterial.dispose()
      cardSideMaterial.dispose()
      frontMaterial.dispose()
      backMaterial.dispose()
      metalMaterial.dispose()
      ropeMaterial.dispose()
      repelMaterial.dispose()

      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <main
      className={`badge-opening ${isDragging ? 'is-dragging' : ''} ${isTriggered ? 'is-triggered' : ''}`}
      style={{ '--pull-progress': progress } as React.CSSProperties}
    >
      <img className="badge-opening-bg" src={scenePreview} alt="温暖的活动中心教室" />
      <div className="badge-opening-wash" />
      <section className="badge-opening-copy" aria-label="游戏开场">
        <p>请慢一点。先观察，再靠近。</p>
        <h1>
          <span>成为</span>
          <span>一天陪护志愿者</span>
        </h1>
      </section>
      <div ref={mountRef} className="badge-canvas" aria-hidden="true" />
      <button className="badge-drag-target" type="button" {...dragHandlers}>
        <span>拉一下陪护证开始</span>
      </button>
      <div className="badge-opening-stamp" aria-hidden="true">
        开始陪护任务
      </div>
    </main>
  )
}
