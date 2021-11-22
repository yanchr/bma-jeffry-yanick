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
import { Milestones } from './milestones'
import { MyCamera } from './camera'
import { RunningSolider } from './runningSoldier'
import { DetectObjects } from './detectObjects'



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
// const runningMan = new RunningMan(gltfLoader, runningFunctions)
const runningMan = new RunningSolider(gltfLoader, runningFunctions)
const milestones = new Milestones(gltfLoader)
const camera = new MyCamera(sizes, runningFunctions, runningMan)
const detectObjects = new DetectObjects();
listenOnEvents(runningFunctions, runningMan, camera)

/**
 * Textures
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
/**
* Environment map
* set Background
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
scene.add(milestones.getGroup())

// Raycaster
scene.add(myRaycaster.getRayCasterObject())

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
    if (milestones.mixer) milestones.mixer.update(deltaTime)
    myRaycaster.detectRaycast(milestones.getAll())
    myRaycaster.updateCarRaycast(runningMan.getGroup().position.clone(), runningFunctions.calculateForwards(runningMan.getGroup().position.clone(), 100), runningMan.getGroup().rotation.y)

    // Render
    renderer.render(scene, camera.get())

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

setInterval(() => {
    const nearScreenName = detectObjects.detectScreenInReach(runningMan.getGroup().position)
    if (nearScreenName) {
        displayVideo(nearScreenName)
    } else {
       hideVideo()
    }
}, 500);


/**
 * Functions
 */
const videoDiv = document.createElement('div')
const videoText = document.createElement('div')
const videoFilm = document.createElement('iframe')
const videoFilmDiv = document.createElement('div')
const body = document.querySelector('body')
let displayedVideo = false
let videoContent = ''
fetch('./videoContent.json')
    .then(results => results.json())
    .then(data => videoContent = data)


createVideoDiv()

function displayVideo(nearScreenName) {
    if(videoContent[nearScreenName] && !displayedVideo){
        displayedVideo = true
        videoDiv.classList.add("show")
        videoText.innerText =  videoContent[nearScreenName].text
        videoFilm.src = videoContent[nearScreenName].url
        console.log("display")
        setTimeout(() => body.append(videoDiv),300)
    }


}

function hideVideo() {
    if (body.querySelector("#video-element")) {
        videoDiv.classList.remove("show")
        setTimeout(() => body.removeChild(videoDiv), 300)
        displayedVideo = false

    }

}

function createVideoDiv() {
    videoDiv.append(videoFilmDiv, videoFilm, videoText)
    videoDiv.id = "video-element"
    videoText.id = "video-text"
    videoFilmDiv.id = "video-filmer"
    videoFilm.id = "video-film"
    videoFilm.width = "600"
    videoFilm.height = "350"
    videoFilm.title = "youtube video Player"
    //videoFilm.src = "./videos/party.mp4"
    videoFilm.frameborder="0"
    videoFilm.allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    videoFilm.allowfullscreen
}       

export function resize() {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.get().aspect = sizes.width / sizes.height
    camera.get().updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

export function changeOrbitControls() {
    utils.orbitControls = !utils.orbitControls
}
