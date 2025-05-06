import React, { useState, useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three'
import { OrbitControls } from '@react-three/drei'
import { useGSAP } from 'gsap/dist/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Button } from '@/components/UI/Button'
import { GoalOrb } from '@/components/Three/GoalOrb'
import { GLTF, GLTFLoaderPlugin } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

interface HeroProps {}

gsap.registerPlugin(ScrollTrigger)

interface GoalData {
  id: number
  name: string
  value: number
}

const Hero: React.FC<HeroProps> = () => {
  const [modelLoaded, setModelLoaded] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [goalOrbData, setGoalOrbData] = useState<GoalData[]>([
    { id: 1, name: 'Steps Today', value: 5000 },
    { id: 2, name: 'Weight Lost', value: 2 },
    { id: 3, name: 'Water Drank', value: 8 },
  ])
  const modelRef = useRef<THREE.Group>(null!)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!)
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  useEffect(() => {
    const imagePreloader = new Image()
    imagePreloader.src = '/textures/background.jpg'
    imagePreloader.onload = () => {
      console.log('Background texture preloaded')
    }
  }, [])

  const loadingManager = new THREE.LoadingManager(
    () => {
      setModelLoaded(true)
      console.log('Loading complete!')
    },
    (itemUrl, itemsLoaded, itemsTotal) => {
      setProgress((itemsLoaded / itemsTotal) * 100)
      console.log(
        `Loading Model: ${((itemsLoaded / itemsTotal) * 100).toFixed()}%`
      )
    },
    (url) => {
      console.warn(`There was an error loading ${url}`)
    }
  )

  useGSAP(
    () => {
      if (modelLoaded && modelRef.current && cameraRef.current) {
        gsap.to(modelRef.current.rotation, {
          y: Math.PI * 2,
          duration: 3,
          repeat: -1,
          ease: 'linear',
        })

        gsap.fromTo(
          cameraRef.current.position,
          { z: 7 },
          {
            z: 3,
            scrollTrigger: {
              trigger: '.app-container',
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              onUpdate: (self) => {
                const scrollProgress = self.progress
                modelRef.current.position.y = scrollProgress * 2
              },
            },
          }
        )
      }
    },
    { scope: canvasRef, dependencies: [modelLoaded] }
  )

  function Model() {
    const gltf = useLoader(
      GLTFLoader,
      '/models/hero-model.glb',
      (loader) => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')
        loader.setDRACOLoader(dracoLoader)
      },
      loadingManager
    )

    useEffect(() => {
      if (gltf.scene) {
        gltf.scene.traverse((object: any) => {
          if (object.isMesh) {
            object.castShadow = true
            object.receiveShadow = false
          }
        })
        modelRef.current = gltf.scene
      }
    }, [gltf])

    if (!gltf) {
      return <mesh>Failed to load model</mesh>
    }

    return (
      <primitive
        object={gltf.scene}
        scale={1}
        position={[0, 0, 0]}
        dispose={null}
      />
    )
  }

  function Lights() {
    return (
      <>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.7} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} />
      </>
    )
  }

  function Background() {
    const { scene } = useThree()
    const loader = new THREE.TextureLoader(loadingManager)
    const texture = loader.load('/textures/background.jpg')

    useEffect(() => {
      scene.background = texture
    }, [texture, scene])
    return null
  }

  return (
    <section className="relative h-screen w-full">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
        <h1
          className="text-4xl font-bold text-gray-900 mb-4"
          aria-label="Track Your Fitness Goals in 3D"
        >
          Track Your Fitness Goals in 3D
        </h1>
        <p className="text-lg text-gray-700 mb-8" aria-label="Visualize your progress and achieve your fitness goals with our innovative 3D fitness tracker.">
          Visualize your progress and achieve your fitness goals with our
          innovative 3D fitness tracker.
        </p>
        <Button href="/signup">Get Started</Button>
      </div>

      {!modelLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/75">
          <p className="text-lg text-gray-700 mb-4">Loading: {progress.toFixed(0)}%</p>
          <div className="w-64 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 0, 5] }}
        dpr={[1, 2]}
        className="!absolute inset-0 z-0"
        aria-label="3D Fitness Tracker Scene"
      >
        <Suspense fallback={null}>
          <Background />
          <Model />
          <Lights />
          {goalOrbData.map((goal) => (
            <GoalOrb key={goal.id} {...goal} />
          ))}
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
        </Suspense>
      </Canvas>
    </section>
  )
}

export { Hero }