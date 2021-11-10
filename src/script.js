import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import { listenOnEvents } from './eventListeners'
import { RunningFunctions } from './runningFunctions'
import { MyRaycaster } from './myRaycaster'
import { LoadingElements } from './loadingElements'
import { RunningMan } from './runningMan'
import { Milestones } from './mileStones'
import { MyCamera } from './camera'



/**
 * Base
 */
const runningFunctions = new RunningFunctions()
const myRaycaster = new MyRaycaster()
const loadingElements = new LoadingElements()

const utils = {}
utils.orbitControls = true
utils.runningMan = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Loading Screen
scene.add(loadingElements.createOverlay())

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingElements.createLoadingManager())
gltfLoader.setDRACOLoader(dracoLoader)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const runningMan = new RunningMan(gltfLoader, runningFunctions)
// const milestones = new Milestones(gltfLoader)
const camera = new MyCamera(sizes, runningFunctions, runningMan)
listenOnEvents(runningFunctions, runningMan, camera)

/**
 * Textures
 */
 const cubeTextureLoader = new THREE.CubeTextureLoader()
 /**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/backgrounds/0/px.png',
    '/backgrounds/0/nx.png',
    '/backgrounds/0/py.png',
    '/backgrounds/0/ny.png',
    '/backgrounds/0/pz.png',
    '/backgrounds/0/nz.png'
])

scene.background = environmentMap
/**
 * Bodys
 */
scene.add(runningMan.getGroup())
//scene.add(milestones.getGroup())

// Raycaster
const pointsRaycaster = new THREE.Raycaster()
scene.add(myRaycaster.getRayCasterObject())


const points = [
    {
        position: new THREE.Vector3(1.55, 10, - 0.6),
        element: document.querySelector('.point-0')
    }
]

/**
 * Camera
 */
// Controls
const controls = new OrbitControls(camera.get(), canvas)
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
    //if(utils.orbitControls) {controls.update()}
    if (!utils.orbitControls) camera.updateCamera(runningMan.getGroup().position)
    if (runningMan.mixer) runningMan.mixer.update(deltaTime)
    //if (milestones.mixer) milestones.mixer.update(deltaTime)
    if (loadingElements.sceneReady) loadPoints()

    //myRaycaster.detectRaycast(milestones.getAll())
    myRaycaster.updateCarRaycast(runningMan.getGroup().position.clone(), runningFunctions.calculateForwards(runningMan.getGroup().position.clone(), 100), runningMan.getGroup().rotation.y)

    // Render
    renderer.render(scene, camera.get())

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


/**
 * Functions
 */
export function resize() {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.get().aspect = sizes.width / sizes.height
    camera.get().updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

export function poswitionPoints() {
    for (const object of milestones.getAll()) {
        if (object.name.split('_')[1] == 'Bildschirm') {
            if (object.name.split('_')[0] == "5") {
                points.forEach(point => point.position = new THREE.Vector3(
                    object.position.x - 70,
                    object.position.y,
                    object.position.z,
                ))
            }
        }
    }
}

function loadPoints() {
    for (const point of points) {
        const screenPosition = point.position.clone()
        screenPosition.project(camera.get())

        pointsRaycaster.setFromCamera(screenPosition, camera.get())
        const intersects = pointsRaycaster.intersectObjects(scene.children, true)

        if (intersects.length === 0) {
            point.element.classList.add('visible')
        }
        else {
            const intersectionDistance = intersects[0].distance
            const pointDistance = point.position.distanceTo(camera.get().position)

            if (intersectionDistance < pointDistance) {
                point.element.classList.remove('visible')
            }
            else {
                point.element.classList.add('visible')
            }
        }


        const translateX = screenPosition.x * sizes.width * 0.5
        const translateY = - screenPosition.y * sizes.height * 0.5
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
    }
}

export function changeOrbitControls() {
    utils.orbitControls = !utils.orbitControls
}
