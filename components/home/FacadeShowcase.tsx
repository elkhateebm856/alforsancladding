'use client'

import { useEffect, useRef, useState } from 'react'
import type * as ThreeTypes from 'three'

const facadeViews = [
  { label: 'الواجهة الأمامية', src: '/facade-front.png?v=2026' },
  { label: 'الجانب الأيمن', src: '/facade-right.png?v=2026' },
  { label: 'الواجهة الخلفية', src: '/facade-back.png?v=2026' },
  { label: 'الجانب الأيسر', src: '/facade-left.png?v=2026' },
]

const buildingWidth = 7.6
const buildingHeight = 6.4
const buildingDepth = 7.6
const SPIN_SPEED = 0.18

export function FacadeShowcase({ fill = false }: { fill?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [visibleView, setVisibleView] = useState(facadeViews[0].label)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let disposed = false
    let cleanupScene: (() => void) | undefined

    void import('three').then((THREE) => {
      if (disposed) return

      const sceneHost = host
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
      camera.position.set(15.2, 3.6, 15.2)
      camera.lookAt(0, -0.1, 0)

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.18
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
      renderer.domElement.style.display = 'block'
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      sceneHost.appendChild(renderer.domElement)

      const stage = new THREE.Group()
      scene.add(stage)

      const building = new THREE.Group()
      stage.add(building)

      const geometries: ThreeTypes.BufferGeometry[] = []
      const materials: ThreeTypes.Material[] = []
      const textures: ThreeTypes.Texture[] = []
      const facadeMaterials: ThreeTypes.MeshStandardMaterial[] = []

      facadeViews.forEach((view) => {
        const texture = new THREE.TextureLoader().load(
          view.src,
          (loaded) => {
            loaded.colorSpace = THREE.SRGBColorSpace
            loaded.anisotropy = renderer.capabilities.getMaxAnisotropy()
            loaded.needsUpdate = true
          },
          undefined,
          (error) => console.error(`Unable to load ${view.label}`, error),
        )
        texture.colorSpace = THREE.SRGBColorSpace
        textures.push(texture)

        const material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.38,
          metalness: 0.22,
          emissive: new THREE.Color(0xffb45a),
          emissiveIntensity: 0.12,
          emissiveMap: texture,
          side: THREE.FrontSide,
        })
        facadeMaterials.push(material)
        materials.push(material)
      })

      const roof = new THREE.MeshStandardMaterial({
        color: 0x0a1018,
        metalness: 0.62,
        roughness: 0.36,
      })
      const underside = new THREE.MeshStandardMaterial({
        color: 0x101820,
        metalness: 0.35,
        roughness: 0.8,
      })
      materials.push(roof, underside)

      const shellGeometry = new THREE.BoxGeometry(
        buildingWidth,
        buildingHeight,
        buildingDepth,
      )
      geometries.push(shellGeometry)
      building.add(
        new THREE.Mesh(shellGeometry, [
          facadeMaterials[1],
          facadeMaterials[3],
          roof,
          underside,
          facadeMaterials[0],
          facadeMaterials[2],
        ]),
      )

      const shadowGeo = new THREE.CircleGeometry(6.8, 72)
      geometries.push(shadowGeo)
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      })
      materials.push(shadowMat)
      const shadow = new THREE.Mesh(shadowGeo, shadowMat)
      shadow.rotation.x = -Math.PI / 2
      shadow.position.y = -buildingHeight / 2 - 0.03
      shadow.scale.set(1.05, 0.62, 1)
      stage.add(shadow)

      const floorGeo = new THREE.RingGeometry(3.2, 8.6, 72)
      geometries.push(floorGeo)
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x1a2433,
        metalness: 0.7,
        roughness: 0.28,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
      })
      materials.push(floorMat)
      const floor = new THREE.Mesh(floorGeo, floorMat)
      floor.rotation.x = -Math.PI / 2
      floor.position.y = -buildingHeight / 2 - 0.05
      stage.add(floor)

      const hemi = new THREE.HemisphereLight(0xb8c9e0, 0x121820, 0.95)
      const key = new THREE.DirectionalLight(0xffd9a8, 1.35)
      key.position.set(-5, 9, 7)
      const fill = new THREE.DirectionalLight(0x7aa0c4, 0.4)
      fill.position.set(7, 3, -5)
      const rim = new THREE.DirectionalLight(0xc9a227, 0.7)
      rim.position.set(4, 5, -8)
      const glow = new THREE.PointLight(0xffb45a, 5.5, 16, 2)
      glow.position.set(0, 0.8, buildingDepth / 2 + 1.8)
      const warmFill = new THREE.PointLight(0xffc777, 3.2, 14, 2)
      warmFill.position.set(-2.2, 1.4, -buildingDepth / 2 - 1.4)
      building.add(glow, warmFill)
      scene.add(hemi, key, fill, rim)

      let animationFrame = 0
      let lastView = -1
      let inView = false
      let pageVisible = !document.hidden
      let baseYaw = 0
      let userYaw = 0
      let dragging = false
      let dragOriginX = 0
      let dragOriginYaw = 0
      let paused = false
      let lastTs = performance.now()

      function syncAnimation() {
        const shouldRun = inView && pageVisible
        if (shouldRun && animationFrame === 0) {
          lastTs = performance.now()
          animationFrame = window.requestAnimationFrame(animate)
        } else if (!shouldRun && animationFrame !== 0) {
          window.cancelAnimationFrame(animationFrame)
          animationFrame = 0
        }
      }

      function resize() {
        const { width, height } = sceneHost.getBoundingClientRect()
        if (!width || !height) return
        renderer.setSize(width, height)
        const aspect = width / height
        camera.aspect = aspect
        // Tall mobile: zoom in hard so the facade dominates the frame
        if (aspect < 0.85) {
          const zoom = aspect < 0.55 ? 1.45 : 1.25
          stage.scale.setScalar(zoom)
          camera.fov = 46
          camera.position.set(8.2, 1.15, 8.2)
          camera.lookAt(0, 0.55, 0)
        } else {
          stage.scale.setScalar(1)
          camera.fov = 30
          camera.position.set(15.2, 3.6, 15.2)
          camera.lookAt(0, -0.1, 0)
        }
        camera.updateProjectionMatrix()
      }

      function animate(now: number) {
        animationFrame = 0
        const dt = Math.min(0.05, (now - lastTs) / 1000)
        lastTs = now

        if (!paused && !dragging) {
          baseYaw += dt * SPIN_SPEED
        }

        building.rotation.y = baseYaw + userYaw
        building.position.y = Math.sin(now * 0.0011) * 0.05
        shadow.rotation.z = -building.rotation.y * 0.12
        glow.intensity = 5.5 + Math.sin(now * 0.0014) * 0.7

        const viewIndex =
          Math.floor(
            ((((building.rotation.y % (Math.PI * 2)) + Math.PI * 2) %
              (Math.PI * 2)) /
              (Math.PI / 2) +
              0.5) %
              4,
          )
        if (viewIndex !== lastView) {
          lastView = viewIndex
          setVisibleView(facadeViews[viewIndex].label)
        }

        renderer.render(scene, camera)
        if (inView && pageVisible) {
          animationFrame = window.requestAnimationFrame(animate)
        }
      }

      let resumeTimer: number | undefined

      function onPointerDown(event: PointerEvent) {
        if (event.button !== 0) return
        dragging = true
        paused = true
        if (resumeTimer) window.clearTimeout(resumeTimer)
        dragOriginX = event.clientX
        dragOriginYaw = userYaw
        sceneHost.setPointerCapture(event.pointerId)
        sceneHost.style.cursor = 'grabbing'
      }

      function onPointerMove(event: PointerEvent) {
        if (!dragging) return
        const delta =
          (event.clientX - dragOriginX) / Math.max(sceneHost.clientWidth, 1)
        userYaw = dragOriginYaw + delta * Math.PI * 1.25
      }

      function onPointerUp(event: PointerEvent) {
        if (!dragging) return
        dragging = false
        sceneHost.releasePointerCapture(event.pointerId)
        sceneHost.style.cursor = 'grab'
        resumeTimer = window.setTimeout(() => {
          // Bake user offset into base so spin continues from current angle
          baseYaw += userYaw
          userYaw = 0
          paused = false
        }, 2200)
      }

      resize()
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(sceneHost)
      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting
          syncAnimation()
        },
        { rootMargin: '120px' },
      )
      intersectionObserver.observe(sceneHost)
      const onVisibility = () => {
        pageVisible = !document.hidden
        syncAnimation()
      }
      document.addEventListener('visibilitychange', onVisibility)
      sceneHost.style.cursor = 'grab'
      sceneHost.addEventListener('pointerdown', onPointerDown)
      sceneHost.addEventListener('pointermove', onPointerMove)
      sceneHost.addEventListener('pointerup', onPointerUp)
      sceneHost.addEventListener('pointercancel', onPointerUp)

      cleanupScene = () => {
        window.cancelAnimationFrame(animationFrame)
        if (resumeTimer) window.clearTimeout(resumeTimer)
        resizeObserver.disconnect()
        intersectionObserver.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
        sceneHost.removeEventListener('pointerdown', onPointerDown)
        sceneHost.removeEventListener('pointermove', onPointerMove)
        sceneHost.removeEventListener('pointerup', onPointerUp)
        sceneHost.removeEventListener('pointercancel', onPointerUp)
        textures.forEach((t) => t.dispose())
        geometries.forEach((g) => g.dispose())
        materials.forEach((m) => m.dispose())
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
      aria-label={`مبنى ثلاثي الأبعاد يدور ببطء؛ ${visibleView}`}
      className={
        fill
          ? 'relative h-full min-h-0 w-full overflow-hidden rounded-[1.15rem]'
          : 'relative aspect-[5/4] w-full overflow-hidden rounded-[1.35rem] md:aspect-[4/3]'
      }
      style={{
        background:
          'radial-gradient(ellipse at 50% 40%, #3d5a7d 0%, #152033 55%, #070b12 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(201,162,39,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/45 to-transparent" />
      <div
        className={`pointer-events-none absolute inset-x-3 z-10 flex justify-center ${
          fill ? 'bottom-2' : 'bottom-2.5 sm:bottom-3'
        }`}
      >
        <span className="max-w-full truncate rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md sm:text-xs">
          {visibleView}
        </span>
      </div>
    </div>
  )
}
