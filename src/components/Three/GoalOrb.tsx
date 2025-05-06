import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

interface GoalOrbProps {
  name: string
  value: number
  target: number
  color: string
}

const GoalOrb: React.FC<GoalOrbProps> = ({ name, value, target, color }) => {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null!)

  const { scale, animatedColor } = useSpring({
    scale: hovered ? 1.2 : 1,
    animatedColor: hovered
      ? new THREE.Color(color).lerp(new THREE.Color('white'), 0.3).getHexString()
      : color,
    config: { mass: 0.1, tension: 170, friction: 26 },
  })

  const geometry = useMemo(() => new THREE.SphereGeometry(0.5, 32, 32), [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.5,
        emissive: color,
        emissiveIntensity: 0.3,
      }),
    [color]
  )

  useFrame(() => {
    if (!meshRef.current) return

    try {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        Math.sin(Date.now() / 1000) * 0.1,
        0.05
      )
      meshRef.current.rotation.x += 0.01
    } catch (error: any) {
      console.error('Error during frame update:', error.message)
    }
  })

  useEffect(() => {
    if (!name || typeof value !== 'number' || typeof target !== 'number' || !color) {
      console.error('Invalid goal data passed to GoalOrb component.')
    }
  }, [name, value, target, color])

  return (
    <animated.mesh
      ref={meshRef}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      geometry={geometry}
      material={material}
      position={[0, 0, 0]}
      castShadow
      receiveShadow
    >
      <animated.meshStandardMaterial color={animatedColor} roughness={0.5} metalness={0.5} emissive={animatedColor} emissiveIntensity={0.3} />
    </animated.mesh>
  )
}

export { GoalOrb }