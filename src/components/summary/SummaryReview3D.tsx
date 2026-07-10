import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { characterAssets, sceneAssets } from '../../data/assetMap'
import { gameScenes } from '../../data/gameScript'
import type { ChoiceRecord, ChoiceTone, GameSceneConfig } from '../../data/gameTypes'
import { formatDelta } from '../../utils/gameScore'

type SummaryReview3DProps = {
  records: ChoiceRecord[]
  reducedMotion: boolean
  onContinue: () => void
}

type ReviewVisualKind = 'scene' | 'characters'

type ReviewCardData = {
  scene: GameSceneConfig
  record?: ChoiceRecord
  imageKind: ReviewVisualKind
  imageSources: string[]
  title: string
  subtitle: string
  actionLine: string
  scoreLine: string
}

type ReviewCardRig = {
  group: THREE.Group
  front: THREE.Mesh
  back: THREE.Mesh
  side: THREE.Mesh
  baseRotationZ: number
}

type Box = {
  x: number
  y: number
  width: number
  height: number
}

const CARD_WIDTH = 1.56
const CARD_HEIGHT = 2.18
const CARD_RADIUS = 0.18
const CARD_THICKNESS = 0.1
const LAUNCH_DURATION = 1120
const CARD_SURFACE = '#a5ca8b'

const introCopy = {
  kicker: '五幕抽卡回顾',
  title: '抽一张，看看你在那一幕做了什么',
  body: '点击下方任意一张 3D 卡片，它会旋转弹射到中央，展示这一幕留下的选择。',
}

const toneLabels: Record<ChoiceTone, string> = {
  forceful: '直接介入',
  gentle: '温和引导',
  observing: '观察陪伴',
  avoidant: '暂时回避',
}

const imageCache = new Map<string, Promise<HTMLImageElement>>()

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
  shape.closePath()

  return shape
}

function drawRoundRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.lineTo(x + width - radius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + radius)
  context.lineTo(x + width, y + height - radius)
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  context.lineTo(x + radius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - radius)
  context.lineTo(x, y + radius)
  context.quadraticCurveTo(x, y, x + radius, y)
  context.closePath()
}

function loadImage(src: string) {
  const cached = imageCache.get(src)
  if (cached) return cached

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Unable to load review image: ${src}`))
    image.src = src
  })

  imageCache.set(src, promise)
  return promise
}

function drawContainImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  box: Box,
) {
  const scale = Math.min(box.width / image.width, box.height / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const drawX = box.x + (box.width - drawWidth) / 2
  const drawY = box.y + (box.height - drawHeight) / 2
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
}

function drawCharacterCluster(context: CanvasRenderingContext2D, images: HTMLImageElement[], box: Box) {
  if (images.length >= 2) {
    const slotWidth = box.width * 0.48
    const slotHeight = box.height * 0.94
    const left: Box = {
      x: box.x + box.width * 0.02,
      y: box.y + box.height * 0.03,
      width: slotWidth,
      height: slotHeight,
    }
    const right: Box = {
      x: box.x + box.width * 0.5,
      y: box.y + box.height * 0.03,
      width: slotWidth,
      height: slotHeight,
    }

    drawContainImage(context, images[0], left)
    drawContainImage(context, images[1], right)
    return
  }

  drawContainImage(context, images[0], {
    x: box.x + box.width * 0.08,
    y: box.y + box.height * 0.03,
    width: box.width * 0.84,
    height: box.height * 0.94,
  })
}

function makeCardSummary(record?: ChoiceRecord) {
  if (!record) return '点击任意卡片开始回顾'
  return `你选择了：${record.choiceLabel}`
}

function makeShortSentence(text: string) {
  const [sentence] = text.split(/[。！？.!?]/)
  return sentence || text
}

function makeResultLead(text: string) {
  const [lead] = text.split(/[，。！？,.!?]/)
  return lead || text
}

function makeReviewCards(records: ChoiceRecord[]) {
  const recordMap = new Map(records.map((record) => [record.sceneId, record]))

  return gameScenes.slice(0, 5).map<ReviewCardData>((scene) => {
    const record = recordMap.get(scene.id)
    if (scene.id === 'scene-05') {
      const poses = (record?.resultPoses?.length ? record.resultPoses : scene.defaultPoses).slice(0, 2)
      const sources = poses
        .map((pose) => characterAssets[pose])
        .filter((source): source is string => Boolean(source))

      return {
        scene,
        record,
        imageKind: 'characters',
        imageSources: sources.length > 0 ? sources : [characterAssets['duo-comfort']],
        title: scene.title,
        subtitle: scene.subtitle,
        actionLine: makeCardSummary(record),
        scoreLine: record
          ? `${toneLabels[record.tone]} · 信任 ${formatDelta(record.trustDelta)} / 精力 ${formatDelta(record.energyDelta)}`
          : '还没有留下选择',
      }
    }

    return {
      scene,
      record,
      imageKind: 'scene',
      imageSources: [sceneAssets[scene.background]],
      title: scene.title,
      subtitle: scene.subtitle,
      actionLine: makeCardSummary(record),
      scoreLine: record
        ? `${toneLabels[record.tone]} · 信任 ${formatDelta(record.trustDelta)} / 精力 ${formatDelta(record.energyDelta)}`
        : '还没有留下选择',
    }
  })
}

async function createCardTexture(data: ReviewCardData, maxAnisotropy: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 960
  canvas.height = 1320

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to create review canvas context')

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'

  context.clearRect(0, 0, canvas.width, canvas.height)
  drawRoundRectPath(context, 0, 0, canvas.width, canvas.height, 96)
  context.fillStyle = CARD_SURFACE
  context.fill()

  const imageBox: Box = {
    x: canvas.width * 0.11,
    y: canvas.height * 0.11,
    width: canvas.width * 0.78,
    height: canvas.height * 0.78,
  }

  const imageSources = await Promise.all(data.imageSources.map(async (source) => loadImage(source)))

  if (data.imageKind === 'scene') {
    drawContainImage(context, imageSources[0], imageBox)
  } else {
    drawCharacterCluster(context, imageSources, imageBox)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = maxAnisotropy
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true

  return texture
}

function getCardAriaLabel(data: ReviewCardData) {
  return `第 ${data.scene.chapter} 幕：${data.title}`
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

function easeOutBack(value: number) {
  const c1 = 1.5
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2)
}

function getTrayLayout(width: number, height: number) {
  const isMobile = width < 700
  const isShort = height < 720

  return {
    centerScale: isMobile ? 0.72 : isShort ? 0.76 : 0.8,
    centerY: isMobile ? 0.52 : isShort ? 0.36 : 0.48,
    trayGap: isMobile ? 0.84 : Math.min(1.52, width / 660),
    trayScale: isMobile ? 0.43 : isShort ? 0.48 : 0.52,
    trayY: isMobile ? -1.58 : isShort ? -1.66 : -1.72,
  }
}

export function SummaryReview3D({ records, reducedMotion, onContinue }: SummaryReview3DProps) {
  const cardData = useMemo(() => makeReviewCards(records), [records])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [hasSelection, setHasSelection] = useState(false)
  const [captionVisible, setCaptionVisible] = useState(reducedMotion)
  const [launchKey, setLaunchKey] = useState(0)
  const mountRef = useRef<HTMLDivElement | null>(null)
  const selectedIndexRef = useRef(0)
  const hasSelectionRef = useRef(false)
  const launchAtRef = useRef(performance.now())
  const captionTimerRef = useRef<number | null>(null)
  const qaPickIndex = useMemo(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const rawPick = params.get('qaPick')
    if (!rawPick) return null

    const parsed = Number.parseInt(rawPick, 10)
    if (!Number.isFinite(parsed)) return null
    const index = parsed - 1
    return index >= 0 ? index : null
  }, [])
  const qaAutoContinue = useMemo(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('qaAutoContinue') === '1'
  }, [])
  const qaHandledRef = useRef(false)

  useEffect(() => {
    selectedIndexRef.current = selectedIndex
  }, [selectedIndex])

  useEffect(() => {
    hasSelectionRef.current = hasSelection
  }, [hasSelection])

  const selectCard = useCallback(
    (index: number) => {
      if (cardData.length === 0) return

      const nextIndex = THREE.MathUtils.clamp(index, 0, cardData.length - 1)
      selectedIndexRef.current = nextIndex
      hasSelectionRef.current = true
      launchAtRef.current = performance.now()
      setSelectedIndex(nextIndex)
      setHasSelection(true)
      setCaptionVisible(reducedMotion)
      setLaunchKey((key) => key + 1)

      if (captionTimerRef.current !== null) {
        window.clearTimeout(captionTimerRef.current)
        captionTimerRef.current = null
      }

      if (!reducedMotion) {
        captionTimerRef.current = window.setTimeout(() => {
          setCaptionVisible(true)
          captionTimerRef.current = null
        }, 920)
      }
    },
    [cardData.length, reducedMotion],
  )

  useEffect(() => {
    if (qaHandledRef.current || qaPickIndex === null || cardData.length === 0) return
    if (qaPickIndex < 0 || qaPickIndex >= cardData.length) return
    qaHandledRef.current = true
    selectCard(qaPickIndex)

    if (qaAutoContinue) {
      const timeout = window.setTimeout(() => onContinue(), reducedMotion ? 360 : 1800)
      return () => window.clearTimeout(timeout)
    }
  }, [cardData.length, onContinue, qaAutoContinue, qaPickIndex, reducedMotion, selectCard])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || cardData.length === 0) return
    const mountElement = mount

    const scene = new THREE.Scene()
    const width = Math.max(mountElement.clientWidth, 1)
    const height = Math.max(mountElement.clientHeight, 1)
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100)
    camera.position.set(0, 0.08, width < 700 ? 6.85 : height < 720 ? 6.45 : 6.2)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.setAttribute('aria-label', '回顾卡片舞台')
    mountElement.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 1.24)
    const keyLight = new THREE.DirectionalLight(0xfff4c2, 2.15)
    keyLight.position.set(2.4, 3.4, 5.6)
    const fillLight = new THREE.DirectionalLight(0xd7eab6, 0.68)
    fillLight.position.set(-2.8, 1.6, 3.8)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.7)
    rimLight.position.set(-1.8, -1.6, 4.4)
    scene.add(ambient, keyLight, fillLight, rimLight)

    const roundedShape = createRoundedRectShape(CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS)
    const frontGeometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT, 1, 1)
    const backGeometry = new THREE.ShapeGeometry(roundedShape, 30)
    const sideGeometry = new THREE.ExtrudeGeometry(roundedShape, {
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.018,
      bevelThickness: 0.012,
      depth: CARD_THICKNESS,
      steps: 1,
    })
    sideGeometry.center()

    const backMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(CARD_SURFACE),
      roughness: 0.72,
      metalness: 0,
      side: THREE.FrontSide,
    })
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7fa768'),
      roughness: 0.78,
      metalness: 0,
    })

    const rigs: ReviewCardRig[] = []
    const textures: THREE.Texture[] = []
    const frontMaterials: THREE.MeshStandardMaterial[] = []
    let isDisposed = false
    let frame = 0

    cardData.forEach((_, index) => {
      const group = new THREE.Group()
      const front = new THREE.Mesh(frontGeometry)
      const back = new THREE.Mesh(backGeometry, backMaterial)
      const side = new THREE.Mesh(sideGeometry, sideMaterial)

      front.position.z = CARD_THICKNESS / 2 + 0.008
      front.userData.cardIndex = index
      back.position.z = -CARD_THICKNESS / 2 - 0.001
      back.rotation.y = Math.PI

      group.add(side, front, back)
      scene.add(group)

      rigs.push({
        group,
        front,
        back,
        side,
        baseRotationZ: (index - 2) * (width < 700 ? 0.028 : 0.042),
      })
    })

    Promise.all(cardData.map((data) => createCardTexture(data, renderer.capabilities.getMaxAnisotropy())))
      .then((loadedTextures) => {
        if (isDisposed) {
          loadedTextures.forEach((texture) => texture.dispose())
          return
        }

        loadedTextures.forEach((texture, index) => {
          textures.push(texture)
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#ffffff'),
            map: texture,
            side: THREE.FrontSide,
            transparent: true,
            alphaTest: 0.02,
            depthTest: false,
            depthWrite: false,
            roughness: 0.66,
            metalness: 0,
          })
          frontMaterials.push(material)
          rigs[index].front.material = material
        })
      })
      .catch((error) => {
        console.error(error)
      })

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    function updatePointer(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    function handlePointerDown(event: PointerEvent) {
      updatePointer(event)
      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObjects(
        rigs.map((rig) => rig.front),
        false,
      )
      const selected = intersects[0]?.object.userData.cardIndex
      if (typeof selected === 'number') {
        selectCard(selected)
      }
    }

    function handlePointerMove(event: PointerEvent) {
      updatePointer(event)
      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObjects(
        rigs.map((rig) => rig.front),
        false,
      )
      renderer.domElement.style.cursor = intersects.length ? 'pointer' : 'default'
    }

    renderer.domElement.addEventListener('pointerdown', handlePointerDown)
    renderer.domElement.addEventListener('pointermove', handlePointerMove)

    function render(now = performance.now()) {
      const selected = selectedIndexRef.current
      const hasSelectionNow = hasSelectionRef.current
      const rawProgress = hasSelectionNow
        ? Math.min(1, (now - launchAtRef.current) / (reducedMotion ? 1 : LAUNCH_DURATION))
        : 0
      const lift = reducedMotion ? rawProgress : easeOutCubic(rawProgress)
      const settle = reducedMotion ? rawProgress : easeOutBack(rawProgress)
      const layout = getTrayLayout(mountElement.clientWidth, mountElement.clientHeight)

      rigs.forEach((rig, index) => {
        const isSelected = hasSelectionNow && index === selected
        const trayX = (index - 2) * layout.trayGap
        const breathe = reducedMotion ? 0 : Math.sin(now / 780 + index * 0.8) * 0.02
        const float = reducedMotion ? 0 : Math.sin(now / 1140 + index) * 0.03
        const targetScale = isSelected
          ? THREE.MathUtils.lerp(layout.trayScale, layout.centerScale, settle)
          : layout.trayScale + breathe
        const spiralAngle = rawProgress * Math.PI * 2.25 + index * 0.58
        const spiralRadius = isSelected ? (1 - lift) * (width < 700 ? 0.42 : 0.54) : 0
        const spiralX = Math.cos(spiralAngle) * spiralRadius * 0.82
        const spiralY = Math.sin(spiralAngle) * spiralRadius * 0.34
        const targetX = isSelected ? THREE.MathUtils.lerp(trayX, 0, lift) + spiralX : trayX
        const targetY = isSelected
          ? THREE.MathUtils.lerp(layout.trayY, layout.centerY, lift) + spiralY
          : layout.trayY + float
        const targetZ = isSelected ? THREE.MathUtils.lerp(0, 2.1, lift) : -0.88 - Math.abs(index - 2) * 0.06

        rig.group.position.set(targetX, targetY, targetZ)
        rig.group.scale.setScalar(targetScale)
        rig.group.rotation.x = isSelected ? THREE.MathUtils.lerp(-0.05, 0.06, lift) : -0.14
        rig.group.rotation.y = isSelected
          ? THREE.MathUtils.lerp((index - 2) * -0.14, Math.PI * 2 + 0.08, lift)
          : (index - 2) * -0.1
        rig.group.rotation.z = isSelected
          ? THREE.MathUtils.lerp(rig.baseRotationZ, 0, settle)
          : rig.baseRotationZ

        const frontMaterial = frontMaterials[index]
        if (frontMaterial) {
          frontMaterial.opacity = isSelected ? 1 : hasSelectionNow ? 0.76 : 0.96
        }

        rig.front.renderOrder = isSelected ? 80 : 20 + index
        rig.back.renderOrder = isSelected ? 79 : 19 + index
        rig.side.renderOrder = isSelected ? 78 : 18 + index
      })

      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(render)
    }

    function resize() {
      const nextWidth = Math.max(mountElement.clientWidth, 1)
      const nextHeight = Math.max(mountElement.clientHeight, 1)
      camera.aspect = nextWidth / nextHeight
      camera.position.z = nextWidth < 700 ? 6.9 : nextHeight < 720 ? 6.5 : 6.2
      camera.updateProjectionMatrix()
      renderer.setSize(nextWidth, nextHeight)
    }

    window.addEventListener('resize', resize)
    render()

    return () => {
      isDisposed = true
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
      renderer.domElement.removeEventListener('pointermove', handlePointerMove)
      frontGeometry.dispose()
      backGeometry.dispose()
      sideGeometry.dispose()
      backMaterial.dispose()
      sideMaterial.dispose()
      textures.forEach((texture) => texture.dispose())
      frontMaterials.forEach((material) => material.dispose())
      renderer.dispose()
      renderer.domElement.remove()
      if (captionTimerRef.current !== null) {
        window.clearTimeout(captionTimerRef.current)
      }
    }
  }, [cardData, reducedMotion, selectCard])

  const selectedCard = cardData[selectedIndex] ?? cardData[0]

  if (!selectedCard) return null

  return (
    <section className={`summary-review-board${hasSelection ? ' is-selected' : ''}`} aria-label="五幕抽卡回顾">
      <div className={`summary-review-annotation summary-review-annotation--three${hasSelection ? ' is-subtitle' : ''}`}>
        {!hasSelection ? (
          <>
            <p className="summary-review-caption__kicker">{introCopy.kicker}</p>
            <h1>{introCopy.title}</h1>
            <p>{introCopy.body}</p>
          </>
        ) : (
          <p className="summary-review-top-subtitle">{introCopy.kicker}</p>
        )}
      </div>

      <div className="summary-review-stage-shell">
        <div
          ref={mountRef}
          className="summary-review-canvas"
          role="listbox"
          aria-label="选择一张回顾卡片"
          aria-activedescendant={`summary-review-card-${selectedCard.scene.id}`}
        />
      </div>

      <div className={`summary-review-detail-slot${hasSelection ? ' has-detail' : ''}`}>
        {hasSelection && (
          <article
            key={`${selectedCard.scene.id}-${launchKey}`}
            className={`summary-review-annotation summary-review-annotation--two${captionVisible ? ' is-visible' : ''}`}
            aria-live="polite"
          >
            <div className="summary-review-caption__meta">
              <span>第 {selectedCard.scene.chapter} 幕</span>
              <span>{selectedCard.scoreLine}</span>
            </div>
            <h2>{selectedCard.title}</h2>
            <p className="summary-review-caption__subtitle">{makeShortSentence(selectedCard.subtitle)}</p>
            <p className="summary-review-caption__choice">{selectedCard.actionLine}</p>
            {selectedCard.record && <p className="summary-review-caption__result">{makeResultLead(selectedCard.record.result)}</p>}
          </article>
        )}
      </div>

      <div className="summary-review-a11y-list">
        {cardData.map((card, index) => (
          <button
            key={card.scene.id}
            id={`summary-review-card-${card.scene.id}`}
            type="button"
            aria-label={getCardAriaLabel(card)}
            aria-selected={index === selectedIndex}
            onClick={() => selectCard(index)}
          >
            {card.title}
          </button>
        ))}
      </div>

      <div className="summary-review-footer">
        <button className="summary-review-continue primary-action" type="button" onClick={onContinue}>
          继续
        </button>
      </div>
    </section>
  )
}
