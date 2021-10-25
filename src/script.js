import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import { RunningFunctions } from './runningFunctions'

/**
 * Base
 */
const runningFunctions = new RunningFunctions()
const utils = {}
utils.runningMan = {}
utils.runningMan.animations = []
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */

const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
const materialTest = new THREE.MeshBasicMaterial({ color: 0x999999 })
const cube1Material = new THREE.MeshBasicMaterial({ color: 0x555599 })
const cube2Material = new THREE.MeshBasicMaterial({ color: 0x115511 })
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

/**
 * Bodys
 */


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 200),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.position.z = 90
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

/**
 * Model
 * /running-man/running_man_try_2.glb
 */
let mixer = null
let action = null
const runningManGroup = new THREE.Group()

utils.runningMan.position = { x: 0, y: 0, z: 0 }
gltfLoader.load(
    '/running-man/running_man_try_2.glb',
    (gltf) => {
        runningManGroup.add(gltf.scene)
        scene.add(runningManGroup)
        //gltf.scene.scale.set(0.05, 0.05, 0.05)
        gltf.scene.scale.set(4, 4, 4)
        utils.runningMan.position = { x: 0, y: 0, z: 0 }
        runningFunctions.position = { x: 0, y: 0, z: 0 }
        gltf.scene.children[0].position.add(utils.runningMan.position)

        mixer = new THREE.AnimationMixer(gltf.scene)
        utils.runningMan.animations = gltf.animations
        runningFunctions.animations = gltf.animations
        action = mixer.clipAction(utils.runningMan.animations[1])
        action.play()
    }
)

let clickDisabled = false;
document.addEventListener('keydown', e => {
    if (!clickDisabled) {
        runningFunctions.runningManManager(e)
        clickDisabled = true
        setTimeout(function () { clickDisabled = false }, 100);
    }
});
document.addEventListener('keyup', e => {
    setTimeout(function () { stopRunning() }, 1000);
});


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 8, 4, 8)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    if (mixer) {
        mixer.update(deltaTime)
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


/**
 * Functions
 */
export function gaspRunningManToPosition(position) {
    gsap.to(runningManGroup.position, { duration: 1, x: position.x, y: position.y, z: position.z })
    camera.position.x = position.x - (20);
    camera.position.y = position.y + 50;
    camera.position.z = position.z - (20);
    action = mixer.clipAction(utils.runningMan.animations[2])
    action.play()
}

export function rotateRunningMan(rotation) {
    runningManGroup.rotation.y += rotation
}

function stopRunning() {
    action.stop()
    action = mixer.clipAction(utils.runningMan.animations[1])
    action.play()
}
