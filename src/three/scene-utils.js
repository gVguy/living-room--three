import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function createScene(
  mountPoint,
  cameraPositionArr = [0, 5, 15],
  cameraRotationArr = [0, 0, 0],
  cameraFov = 45,
  cameraNear = 0.1,
  cameraFar = 100
) {
  const getMountPointSize = () => ({
    width: mountPoint.offsetWidth,
    height: mountPoint.offsetHeight
  })
  const { width, height } = getMountPointSize()

  console.log('creating scene (width, height, mountPoint):', width, width, mountPoint)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(cameraFov, width / height, cameraNear, cameraFar)

  // create renderer
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)

  mountPoint.append(renderer.domElement)

  // set camera position
  camera.position.set(...cameraPositionArr)
  camera.rotation.set(...cameraRotationArr.map(rad))

  renderer.shadowMap.enabled = true

  // run render loop
  function renderFrame() {
    requestAnimationFrame(renderFrame)
    renderer.render(scene, camera)
  }
  renderFrame()

  // absolute position to allow parent resize and then match its size
  mountPoint.style.position = 'relative'
  renderer.domElement.style.position = 'absolute'
  // observe window resize
  window.addEventListener('resize', () => {
    setTimeout(() => {
      const { width, height } = getMountPointSize()
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      console.log(camera, renderer)
    }, 0)
  })

  console.log('created scene', scene, camera, renderer)

  return { scene, camera, renderer }
}

export function setupRaycaster(renderer, scene, camera) {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  const updatePointer = (pointerEvent) => {
    const canvas = renderer.domElement
    const rect = canvas.getBoundingClientRect()
    const x = pointerEvent.clientX - rect.left
    const y = pointerEvent.clientY - rect.top
    pointer.x = ( x / canvas.clientWidth ) *  2 - 1
    pointer.y = ( y / canvas.clientHeight) * - 2 + 1
  }

  const raycast = (pointerEvent) => {
    updatePointer(pointerEvent)
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    return intersects
  }

  return raycast
}

export function addGlb(
  scene,
  name = '',
  glbPath,
  scaleArr = [1, 1, 1],
  rotationArr = [0, 0, 0],
  positionArr = [0, 0, 0],
  noCastShadowMeshNameArr = [],
  noRecieveShadowMeshNameArr = []
) {
  const loader = new GLTFLoader()

  return new Promise((resolve, reject) => {
    loader.load(glbPath, (gltf) => {
      // loaded
      const object = gltf.scene

      object.scale.set(...scaleArr)
      object.rotation.set(...rotationArr.map(rad))
      object.position.set(...positionArr)
      
      object.traverse(mesh => {
        if (!noCastShadowMeshNameArr.includes(mesh.name)) {
          mesh.castShadow = true
        }
        if (!noRecieveShadowMeshNameArr.includes(mesh.name)) {
          mesh.receiveShadow = true
        }
      })

      if (name) object.name = name

      scene.add(object)

      console.log('added glb', object)

      resolve(object)
    }, null, (error) => {
      // error
      console.error('failed to add glb', error)
      reject(error)
    })
  })
}

export function addBox(scene, name = '', dimensionsArr = [1, 1, 1], color = 0xcccccc, positionArr = [0, 0, 0], rotationArr = [0, 0, 0]) {
  const geometry = new THREE.BoxGeometry(...dimensionsArr)
  const material = new THREE.MeshStandardMaterial({ color })
  const box = new THREE.Mesh(geometry, material)

  box.position.set(...positionArr)
  box.rotation.set(...rotationArr.map(rad))
  box.castShadow = true
  box.receiveShadow = true

  if (name) box.name = name

  scene.add(box)

  console.log('added box', box)
  return box
}

export function addPointLight(scene, color = 0xf0f000, intensity = 0.5, distance = 20, positionArr= [0, 10, -5], castShadow = true) {
  const light = new THREE.PointLight(color, intensity, distance)
  light.position.set(...positionArr)
  light.castShadow = castShadow
  scene.add(light)

  console.log('added point light', light)
  return light
}

export function addDirectionalLight(
  scene,
  color = 0xffffff,
  intensity = 0.5,
  positionArr = [10, 50, 0],
  targetPositionArr = [-10, 0, -5],
  shadowCameraBoundaries = { top: 100, right: 100, bottom: -100 },
  lightMapSize = 2048
) {
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(...positionArr)
  light.target.position.set(...targetPositionArr)
  light.castShadow = true
  Object.assign(light.shadow.camera, shadowCameraBoundaries)
  light.shadow.mapSize.width = lightMapSize
  light.shadow.mapSize.height = lightMapSize

  scene.add(light)

  console.log('added directional light', light)
  return light
}

export function addAmbientLight(scene, color = 0xffffff, intensity = 0.5) {
  const light = new THREE.AmbientLight(color, intensity)
  scene.add(light)

  console.log('added ambient light', light)
  return light
}

export function disposeObject(scene, object) {
  console.log('removing object from scene', object)
  object.traverse(node => {
    console.log('dispose child node maretial & geometry', node, node.material, node.geometry)
    node.material?.dispose()
    node.geometry?.dispose()
  })
  scene.remove(object)
}

export const rad = (deg) => deg * Math.PI / 180
