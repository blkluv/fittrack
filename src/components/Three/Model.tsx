import React, { useEffect, useRef, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { LOD } from '@react-three/drei'
import * as THREE from 'three'
import { modelOptimizer } from '@/utils/modelOptimizer'

interface ModelProps {}

const Model: React.FC<ModelProps> = () => {
  const [gltf, setGltf] = useState<GLTF | null>(null)
  const [loadingError, setLoadingError] = useState<THREE.Object3D | null>(null)
  const modelRef = useRef<THREE.Group>(null!)

  useEffect(() => {
    let dracoLoader: DRACOLoader | null = null
    let gltfLoader: GLTFLoader | null = null

    const loadModel = async () => {
      try {
        gltfLoader = new GLTFLoader()
        dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')
        gltfLoader.setDRACOLoader(dracoLoader)

        const loadedModel = await new Promise<GLTF>((resolve, reject) => {
          gltfLoader!.load(
            '/models/hero-model.glb',
            (gltf) => resolve(gltf),
            undefined,
            (error) => {
              console.error('An error happened during model loading', error)
              reject(error)
            }
          )
        })

        loadedModel.scene.traverse((object: any) => {
          if (object.isMesh) {
            object.castShadow = true
            object.receiveShadow = false
          }
        })

        modelRef.current = loadedModel.scene
        setGltf(loadedModel)
      } catch (error: any) {
        console.error('Model loading failed', error)
        setLoadingError(new THREE.Mesh())
        return
      } finally {
        dracoLoader?.dispose()
        gltfLoader?.dispose()
      }
    }

    loadModel()

    return () => {
      dracoLoader?.dispose()
      gltfLoader?.dispose()
    }
  }, [])

  useEffect(() => {
    if (gltf?.scene) {
      const optimizeModel = async () => {
        try {
          const optimizedScene = await modelOptimizer(gltf.scene)
          modelRef.current = optimizedScene
        } catch (error) {
          console.error('Model optimization failed, using default model', error)
        }
      }
      optimizeModel()
    }
  }, [gltf])

  if (loadingError) {
    return <mesh>Failed to load model</mesh>
  }

  if (!gltf) {
    return <mesh>Loading model...</mesh>
  }

  return (
    <LOD distances={[5, 15, 30]}>
      <primitive object={gltf.scene} scale={1} position={[0, 0, 0]} />
    </LOD>
  )
}

export default Model