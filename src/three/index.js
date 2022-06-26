import { createScene, addGlb, setupRaycaster, addBox, addPointLight, rad, disposeObject, addAmbientLight } from '@/three/scene-utils'

let scene, camera, renderer, raycast, unplacedObject, unplacedObjectSticksTo, unplacedObjectIsSpinnable

export function init(mountPoint) {

  // initial scene setup
  ({ scene, camera, renderer } = createScene(mountPoint))

  // setup raycast method
  raycast = setupRaycaster(renderer, scene, camera)

  // add base geometry
  addBox(scene, 'ground', [20, 15, 0.1], undefined, [0, 0, -2.5], [90, 0, 0])
  addBox(scene, 'wall', [20, 10, 1], undefined, [-10, 5, -5], [0, 90, 0])
  addBox(scene, 'wall', [20, 10, 1], undefined, [10, 5, -5], [0, -90, 0])
  addBox(scene, 'wall', [20, 10, 1], undefined, [0, 5, -10])
  addBox(scene, 'ceiling', [20, 15, 0.1], undefined, [0, 10, -2.5], [90, 0, 0])

  addAmbientLight(scene, undefined, 0.1)
  addPointLight(scene, 0x505050, 0.5, undefined, [0, 5, 0], false)
}

export function moveObject(pointerEvent) {
  if (!raycast || !unplacedObject) return
  const intersects = raycast(pointerEvent)
  const targetIntersect = intersects.find(i => unplacedObjectSticksTo.includes(i.object.name))
  if (!targetIntersect) return
  const point = targetIntersect.point
  unplacedObject.position.set(point.x, point.y, point.z)
  if (unplacedObjectSticksTo.includes('wall')) {
    unplacedObject.rotation.y = targetIntersect.object.rotation.y
  }
}

export async function addObject(item) {
  if (unplacedObject) return
  unplacedObject = await addGlb(
    scene,
    item.name,
    item.model,
    item.scale,
    item.rotate,
    item.position,
    item.noCastShadow,
    item.noRecieveShadow
  )
  unplacedObjectSticksTo = item.stickTo
  unplacedObjectIsSpinnable = item.isSpinnable
}

export function placeObject() {
  unplacedObject = null
}
export function keyHandler(e) {
  switch (e.key) {
  case 'ArrowDown':
    rotateObject(90)
    break
  case 'ArrowUp':
    rotateObject(-90)
    break
  case 'Escape':
    removeObject()
    break
  }
}

function rotateObject(deg) {
  if (!unplacedObject || !unplacedObjectIsSpinnable) return
  if (unplacedObjectSticksTo.includes('wall')) return
  unplacedObject.rotation.y += rad(deg)
}

function removeObject() {
  console.log('remove')
  if (!unplacedObject) return
  disposeObject(scene, unplacedObject)
  unplacedObject = null
}
