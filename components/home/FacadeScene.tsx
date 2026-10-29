'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'

interface FacadeSceneProps {
  className?: string
}

export function FacadeScene({ className = '' }: FacadeSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    const sceneHost = host as HTMLDivElement

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40)
    const facade = new THREE.Group()
    const geometry: THREE.BufferGeometry[] = []
    const materials: THREE.Material[] = []

    camera.position.set(5.3, 3.1, 7.5)
    camera.lookAt(0, 0.05, 0)
    facade.rotation.set(-0.06, -0.18, 0)
    scene.add(facade)

    const metal = new THREE.MeshStandardMaterial({
      color: 0x263344,
      metalness: 0.72,
      roughness: 0.3,
    })
    const darkMetal = new THREE.MeshStandardMaterial({
      color: 0x111b28,
      metalness: 0.65,
      roughness: 0.35,
    })
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x76aeca,
      metalness: 0.28,
      roughness: 0.16,
      transparent: true,
      opacity: 0.76,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
    })
    const gold = new THREE.MeshStandardMaterial({
      color: 0xc9a227,
      emissive: 0x8b6512,
      emissiveIntensity: 0.65,
      metalness: 0.62,
      roughness: 0.24,
    })
    materials.push(metal, darkMetal, glass, gold)

    function addBox(
      width: number,
      height: number,
      depth: number,
      x: number,
      y: number,
      z: number,
      material: THREE.Material,
    ) {
      const boxGeometry = new THREE.BoxGeometry(width, height, depth)
      geometry.push(boxGeometry)
      const mesh = new THREE.Mesh(boxGeometry, material)
      mesh.position.set(x, y, z)
      facade.add(mesh)
      return mesh
    }

    addBox(4.25, 3.2, 0.38, 0, 0, -0.1, metal)

    const windowColumns = [-1.55, -0.52, 0.52, 1.55]
    const windowRows = [-0.88, 0, 0.88]
    for (const x of windowColumns) {
      for (const y of windowRows) {
        addBox(0.84, 0.72, 0.035, x, y, 0.12, glass)
      }
    }

    for (const x of [-2.08, -1.03, 0, 1.03, 2.08]) {
      addBox(0.065, 2.55, 0.09, x, 0, 0.17, darkMetal)
    }
    for (const y of [-1.27, -0.44, 0.44, 1.27]) {
      addBox(4.2, 0.065, 0.09, 0, y, 0.17, darkMetal)
    }

    addBox(4.55, 0.085, 0.19, 0, 1.68, 0.18, gold)
    addBox(4.55, 0.07, 0.16, 0, -1.65, 0.16, gold)
    addBox(0.09, 3.35, 0.2, 2.18, 0, 0.15, gold)
    addBox(4.9, 0.22, 1.45, 0, -1.82, -0.05, darkMetal)
    addBox(4.7, 0.08, 0.95, 0, 1.82, -0.04, metal)

    const ambientLight = new THREE.HemisphereLight(0xdcecff, 0x202a38, 2.1)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2)
    const goldLight = new THREE.PointLight(0xffc64a, 18, 8)
    keyLight.position.set(-4, 6, 6)
    goldLight.position.set(2.4, 1.3, 2.2)
    scene.add(ambientLight, keyLight, goldLight)

    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    function resize() {
      const { width, height } = sceneHost.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }

    let targetRotationX = facade.rotation.x
    let targetRotationY = facade.rotation.y
    let animationFrame = 0
    const animate = () => {
      facade.rotation.x += (targetRotationX - facade.rotation.x) * 0.035
      facade.rotation.y += (targetRotationY - facade.rotation.y) * 0.035
      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(animate)
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      const bounds = sceneHost.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      targetRotationY = -0.18 + x * 0.18
      targetRotationX = -0.06 - y * 0.08
    }

    function resetRotation() {
      targetRotationX = -0.06
      targetRotationY = -0.18
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(sceneHost)
    sceneHost.addEventListener('pointermove', handlePointerMove)
    sceneHost.addEventListener('pointerleave', resetRotation)

    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (isDesktop && !prefersReducedMotion) animate()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      sceneHost.removeEventListener('pointermove', handlePointerMove)
      sceneHost.removeEventListener('pointerleave', resetRotation)
      geometry.forEach((item) => item.dispose())
      materials.forEach((item) => item.dispose())
      renderer.dispose()
    }
  }, [prefersReducedMotion])

  return (
    <div ref={hostRef} aria-hidden="true" className={className}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}