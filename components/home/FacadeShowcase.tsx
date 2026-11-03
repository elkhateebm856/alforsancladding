'use client'

import { useEffect, useRef, useState } from 'react'
import type * as ThreeTypes from 'three'

const facadeViews = [
  { label: 'الواجهة الأمامية', src: '/facade-front.png' },
  { label: 'الجانب الأيمن', src: '/facade-right.png' },
  { label: 'الواجهة الخلفية', src: '/facade-back.png' },
  { label: 'الجانب الأيسر', src: '/facade-left.png' },
]

const buildingWidth = 9
const buildingHeight = 5.3
const buildingDepth = 8.6
const turnSpeed = 0.19

export function FacadeShowcase() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [visibleView, setVisibleView] = useState(facadeViews[0].label)
  const [isGlassOpaque, setIsGlassOpaque] = useState(false)
  const [isNight, setIsNight] = useState(true)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let disposed = false
    let cleanupScene: (() => void) | undefined

    void import('three').then((THREE) => {
    if (disposed) return
    const sceneHost: HTMLDivElement = host
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80)
    camera.position.set(11.4, 2.2, 11.4)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    sceneHost.appendChild(renderer.domElement)

    const building = new THREE.Group()
    scene.add(building)

    const geometries: ThreeTypes.BufferGeometry[] = []
    const materials: ThreeTypes.Material[] = []
    const textures: ThreeTypes.Texture[] = []
    const nightTextures: (ThreeTypes.CanvasTexture | null)[] = facadeViews.map(
      () => null,
    )
    const facadeMaterials: ThreeTypes.MeshStandardMaterial[] = []
    const daylightTextures: (ThreeTypes.CanvasTexture | null)[] = facadeViews.map(
      () => null,
    )
    let currentNight = true

    facadeViews.forEach((view, index) => {
      const texture = new THREE.TextureLoader().load(
        view.src,
        (loadedTexture) => {
          const image = loadedTexture.image
          const scale = Math.min(1, 1280 / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height))
          const textureWidth = Math.max(1, Math.round((image.naturalWidth || image.width) * scale))
          const textureHeight = Math.max(1, Math.round((image.naturalHeight || image.height) * scale))
          const nightCanvas = document.createElement('canvas')
          nightCanvas.width = textureWidth
          nightCanvas.height = textureHeight
          const nightContext = nightCanvas.getContext('2d')
          if (!nightContext) {
            console.error(`Unable to create the night image for ${view.label}.`)
            return
          }
          nightContext.drawImage(image, 0, 0, textureWidth, textureHeight)

          const nightTexture = new THREE.CanvasTexture(nightCanvas)
          nightTexture.colorSpace = THREE.SRGBColorSpace
          nightTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
          nightTextures[index] = nightTexture
          textures.push(nightTexture)

          const dayCanvas = document.createElement('canvas')
          dayCanvas.width = textureWidth
          dayCanvas.height = textureHeight
          const context = dayCanvas.getContext('2d')
          if (!context) {
            console.error(`Unable to create the daylight image for ${view.label}.`)
            return
          }
          context.filter = 'brightness(1.62) saturate(0.78) sepia(0.16) contrast(0.92)'
          context.drawImage(image, 0, 0, textureWidth, textureHeight)
          const daylightTint = context.createLinearGradient(0, 0, 0, dayCanvas.height)
          daylightTint.addColorStop(0, 'rgba(177, 210, 230, 0.25)')
          daylightTint.addColorStop(0.62, 'rgba(238, 224, 194, 0.08)')
          daylightTint.addColorStop(1, 'rgba(255, 242, 216, 0.02)')
          context.fillStyle = daylightTint
          context.fillRect(0, 0, dayCanvas.width, dayCanvas.height)

          const daylightTexture = new THREE.CanvasTexture(dayCanvas)
          daylightTexture.colorSpace = THREE.SRGBColorSpace
          daylightTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
          daylightTextures[index] = daylightTexture
          textures.push(daylightTexture)
          facadeMaterials[index].map = currentNight ? nightTexture : daylightTexture
          loadedTexture.dispose()
        },
        undefined,
        (error) => console.error(`Unable to load ${view.label} image.`, error),
      )
      texture.colorSpace = THREE.SRGBColorSpace
      textures.push(texture)

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.55,
        metalness: 0.08,
        side: THREE.DoubleSide,
      })
      facadeMaterials.push(material)
      materials.push(material)
    })

    const invisibleRoofMaterial = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: false,
      transparent: true,
      opacity: 0,
    })
    const undersideMaterial = new THREE.MeshStandardMaterial({
      color: 0x313a40,
      metalness: 0.3,
      roughness: 0.66,
    })
    materials.push(invisibleRoofMaterial, undersideMaterial)

    const buildingGeometry = new THREE.BoxGeometry(
      buildingWidth,
      buildingHeight,
      buildingDepth,
    )
    geometries.push(buildingGeometry)
    const buildingShell = new THREE.Mesh(buildingGeometry, [
      facadeMaterials[1],
      facadeMaterials[3],
      invisibleRoofMaterial,
      undersideMaterial,
      facadeMaterials[0],
      facadeMaterials[2],
    ])
    building.add(buildingShell)

    const smartGlassGeometry = new THREE.PlaneGeometry(1.5, 1.7)
    geometries.push(smartGlassGeometry)
    const smartGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x80b5c9,
      emissive: 0x1c4656,
      emissiveIntensity: 0.08,
      metalness: 0.2,
      roughness: 0.18,
      transparent: true,
      opacity: 0.12,
      clearcoat: 1,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    materials.push(smartGlassMaterial)
    const smartGlassPane = new THREE.Mesh(smartGlassGeometry, smartGlassMaterial)
    smartGlassPane.position.set(0, -0.65, buildingDepth / 2 + 0.025)
    smartGlassPane.renderOrder = 2
    building.add(smartGlassPane)

    const ledMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc777,
      emissive: 0xffa43c,
      emissiveIntensity: 0.03,
      metalness: 0.22,
      roughness: 0.3,
    })
    materials.push(ledMaterial)
    const ledFaces = [
      { width: buildingWidth, depth: buildingDepth, x: 0, z: buildingDepth / 2 + 0.07, rotation: 0 },
      { width: buildingDepth, depth: buildingWidth, x: buildingWidth / 2 + 0.07, z: 0, rotation: Math.PI / 2 },
      { width: buildingWidth, depth: buildingDepth, x: 0, z: -buildingDepth / 2 - 0.07, rotation: Math.PI },
      { width: buildingDepth, depth: buildingWidth, x: -buildingWidth / 2 - 0.07, z: 0, rotation: -Math.PI / 2 },
    ] as const
    ledFaces.forEach(({ width, x, z, rotation }) => {
      const ledFrame = new THREE.Group()
      ledFrame.position.set(x, 0, z)
      ledFrame.rotation.y = rotation
      building.add(ledFrame)

      const ledBars = [
        { width: width * 0.86, height: 0.028, x: 0, y: 1.96 },
        { width: 0.028, height: 3.75, x: -width * 0.43, y: -0.05 },
        { width: 0.028, height: 3.75, x: width * 0.43, y: -0.05 },
      ]
      ledBars.forEach(({ width: barWidth, height, x: barX, y }) => {
        const geometry = new THREE.BoxGeometry(barWidth, height, 0.018)
        geometries.push(geometry)
        const led = new THREE.Mesh(geometry, ledMaterial)
        led.position.set(barX, y, 0)
        ledFrame.add(led)
      })
    })

    const ambientLight = new THREE.HemisphereLight(0xdce9f5, 0x40414a, 2)
    const keyLight = new THREE.DirectionalLight(0xffe6bd, 3)
    keyLight.position.set(-6, 7, 8)
    const rimLight = new THREE.DirectionalLight(0x83aacc, 0.5)
    rimLight.position.set(6, 5, -7)
    const facadeNightLights = [
      [0, 0, buildingDepth / 2 + 0.8],
      [buildingWidth / 2 + 0.8, 0, 0],
      [0, 0, -buildingDepth / 2 - 0.8],
      [-buildingWidth / 2 - 0.8, 0, 0],
    ].map(([x, y, z]) => {
      const light = new THREE.PointLight(0xffc777, 0, 11, 2)
      light.position.set(x, y, z)
      building.add(light)
      return light
    })
    scene.add(ambientLight, keyLight, rimLight)

    const startedAt = performance.now()
    let animationFrame = 0
    let lastViewIndex = -1
    let previousOpaque = false
    let isInViewport = false
    let isPageVisible = !document.hidden

    function updateAnimationState() {
      const shouldAnimate = isInViewport && isPageVisible
      if (shouldAnimate && animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(animate)
      } else if (!shouldAnimate && animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame)
        animationFrame = 0
      }
    }

    function handleVisibilityChange() {
      isPageVisible = !document.hidden
      updateAnimationState()
    }

    function resize() {
      const { width, height } = sceneHost.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    function animate() {
      animationFrame = 0
      const elapsed = (performance.now() - startedAt) / 1000
      building.rotation.y = elapsed * turnSpeed

      const night = Math.floor(elapsed) % 2 === 0
      const daylight = night ? 0 : 1
      ambientLight.intensity = 0.55 + daylight * 1.15
      keyLight.intensity = 0.3 + daylight * 1.65
      rimLight.intensity = 0.3 + (1 - daylight) * 1.2
      const nightLevel = 1 - daylight
      facadeNightLights.forEach((light, index) => {
        const lightPulse = 0.82 + Math.max(0, Math.sin(elapsed * 2.4 + index * 1.6)) * 0.18
        light.intensity = nightLevel * 12 * lightPulse
      })
      ledMaterial.emissiveIntensity =
        0.03 + nightLevel * (2.3 + Math.max(0, Math.sin(elapsed * 3.2)) * 0.7)

      const viewIndex =
        Math.floor(
          ((((building.rotation.y % (Math.PI * 2)) + Math.PI * 2) %
            (Math.PI * 2)) /
            (Math.PI / 2)) +
            0.5,
        ) % 4
      if (viewIndex !== lastViewIndex) {
        lastViewIndex = viewIndex
        setVisibleView(facadeViews[viewIndex].label)
      }

      const opaque = Math.floor(elapsed / 5) % 2 === 1
      smartGlassMaterial.color.set(opaque ? 0xe4edf0 : 0x80b5c9)
      smartGlassMaterial.emissiveIntensity = opaque ? 0.07 : 0.08
      smartGlassMaterial.opacity = opaque ? 0.97 : 0.12
      smartGlassMaterial.roughness = opaque ? 0.78 : 0.18
      if (opaque !== previousOpaque) {
        previousOpaque = opaque
        setIsGlassOpaque(opaque)
      }
      if (night !== currentNight) {
        currentNight = night
        facadeMaterials.forEach((material, index) => {
          material.map = night
            ? nightTextures[index] ?? material.map
            : daylightTextures[index] ?? material.map
        })
        setIsNight(night)
      }

      renderer.render(scene, camera)
      if (isInViewport && isPageVisible) {
        animationFrame = window.requestAnimationFrame(animate)
      }
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(sceneHost)
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting
        updateAnimationState()
      },
      { rootMargin: '100px' },
    )
    intersectionObserver.observe(sceneHost)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    cleanupScene = () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      textures.forEach((texture) => texture.dispose())
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
    }).catch((error: unknown) => {
      console.error('Unable to load the 3D facade renderer.', error)
    })

    return () => {
      disposed = true
      cleanupScene?.()
    }
  }, [])

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={`مبنى رباعي الواجهات يدور نهارًا وليلًا؛ ${visibleView}، والزجاج الذكي ${
        isGlassOpaque ? 'معتم' : 'شفاف'
      }`}
      className={`relative aspect-[5/4] w-full overflow-hidden rounded-xl transition-colors duration-500 md:aspect-[4/3] md:rounded-2xl ${
        isNight
          ? 'bg-[radial-gradient(ellipse_at_50%_48%,_#263c59_0%,_#111c2c_58%,_#070b13_100%)]'
          : 'bg-[radial-gradient(ellipse_at_50%_48%,_#b8cbd7_0%,_#607888_58%,_#263540_100%)]'
      }`}
    >
    </div>
  )
}
