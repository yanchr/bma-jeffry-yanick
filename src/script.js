import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
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
const materialTest = new THREE.MeshBasicMaterial({color: 0x999999})
const cube1Material = new THREE.MeshBasicMaterial({color: 0x555599})
const cube2Material = new THREE.MeshBasicMaterial({color: 0x115511})
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

/**
 * Bodys
 */
const sceneGroup = new THREE.Group();
const heightOfCube = 12
const centerCube = new THREE.Mesh(
    new THREE.BoxGeometry(heightOfCube * 2, heightOfCube, heightOfCube * 2),
    new THREE.MeshBasicMaterial({color: 0xffffff})
)
centerCube.position.y = heightOfCube / 2
centerCube.position.z = -22
sceneGroup.add(centerCube)

/**
 * Model
 */
const room1 = new THREE.Group();
const room2 = new THREE.Group();
const room3 = new THREE.Group();
gltfLoader.load(
    'Schritt_1.glb',
    (gltf) =>
    {
        gltf.scene.children.forEach(child => {
            child.material = materialTest
            room1.add(child)
        })
        // Get each object
        const left_human = room1.children.find((child) => child.name === 'Cube')
        const house = room1.children.find((child) => child.name === 'Cube002')

        // Apply materials
        left_human.material = cube1Material
        house.material = cube2Material
    }
)
gltfLoader.load(
    'Schritt_2.glb',
    (gltf) =>
    {
        gltf.scene.children.forEach(child => {
            child.material = materialTest
            room2.add(child)
        })
        // Get each object
        const room = room2.children.find((child) => child.name === 'room')

        // Apply materials
        room.material = cube1Material
    }
)

gltfLoader.load(
    'Schritt_3.glb',
    (gltf) =>
    {
        gltf.scene.children.forEach(child => {
            child.material = materialTest
            room3.add(child)
        })
        // Get each object
        const room = room3.children.find((child) => child.name === 'room')

        // Apply materials
        room.material = cube1Material
    }
)

room2.rotation.y = Math.PI / 2
room2.position.z -= 21.5
room2.position.x += 22

room3.rotation.y = - Math.PI / 2
room3.position.z -= 21.5
room3.position.x -= 22


sceneGroup.add(room1, room2, room3)
scene.add(sceneGroup)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.x = 10
camera.position.y = 10
camera.position.z = 30
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

console.log(sceneGroup)

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    //rotate cube
    sceneGroup.rotation.y = - elapsedTime / 5

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()