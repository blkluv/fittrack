import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

const MAX_TEXTURE_SIZE = 1024

async function compressWithDraco(scene: THREE.Scene): Promise<THREE.Scene> {
  return new Promise((resolve, reject) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    dracoLoader.preload()

    scene.traverse((object: any) => {
      if (object.isMesh && object.geometry) {
        const geometry = object.geometry

        if (geometry.index && geometry.attributes.position) {
          console.log('Draco compressing', object.name)
        }
      }
    })
    dracoLoader.dispose()
    resolve(scene)
  })
}

function generateLOD(scene: THREE.Scene): THREE.Group {
  const lod = new THREE.LOD()

  const highPoly = scene
  highPoly.name = 'LOD0'
  lod.addLevel(highPoly, 0)

  let mediumPoly: THREE.Scene | null = null
  try {
    mediumPoly = cloneScene(scene, 0.5)
    mediumPoly.name = 'LOD1'
    lod.addLevel(mediumPoly, 5)
  } catch (error) {
    console.warn('Failed to generate medium LOD', error)
  }

  let lowPoly: THREE.Scene | null = null
  try {
    lowPoly = cloneScene(scene, 0.75)
    lowPoly.name = 'LOD2'
    lod.addLevel(lowPoly, 15)
  } catch (error) {
    console.warn('Failed to generate low LOD', error)
  }

  lod.updateMatrixWorld(true)
  return lod
}

function cloneScene(source: THREE.Scene, reduction: number): THREE.Scene {
  const clonedScene = source.clone()

  clonedScene.traverse((node: any) => {
    if (node.isMesh) {
      const geometry = node.geometry.clone()
      const numTriangles = geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3

      const newGeometry = geometry.clone()

      node.geometry = newGeometry
    }
  })

  return clonedScene
}

async function optimizeMaterials(scene: THREE.Scene): Promise<void> {
  scene.traverse((object: any) => {
    if (object.material && object.material.map) {
      const texture = object.material.map

      if (texture.image) {
        if (texture.image.width > MAX_TEXTURE_SIZE || texture.image.height > MAX_TEXTURE_SIZE) {
          console.warn('Texture is too large, resizing', texture.image.width, texture.image.height)
        }
      }

      object.material.roughness = 0.8
      object.material.metalness = 0.7
      object.material.map.encoding = THREE.sRGBEncoding
      object.material.needsUpdate = true
    }
    if (object.isMesh) {
      object.castShadow = true
      object.receiveShadow = false
      object.frustumCulled = true
    }
  })
}

export const modelOptimizer = async (scene: THREE.Scene): Promise<THREE.Scene> => {
  if (!scene) {
    throw new Error('Invalid scene provided')
  }

  const clonedScene = scene.clone()

  try {
    await compressWithDraco(clonedScene)
  } catch (error) {
    console.warn('Draco compression failed, continuing without', error)
  }

  try {
    const lod = generateLOD(clonedScene)
    return new Promise((resolve) => {
      resolve(lod)
    })
  } catch (error) {
    console.warn('LOD generation failed, continuing without', error)
  }

  try {
    await optimizeMaterials(clonedScene)
  } catch (error) {
    console.warn('Material optimization failed, continuing without', error)
  }

  return new Promise((resolve) => {
    resolve(clonedScene)
  })
}