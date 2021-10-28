import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import * as script from './script'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import { listenOnEvents } from './eventListeners'
import {RunningFunctions} from './runningFunctions'
import { MyRaycaster } from './myRaycaster'



/**
 * Base
 */
 const runningFunctions = new RunningFunctions()
 const myRaycaster = new MyRaycaster()
 
 listenOnEvents(runningFunctions)
 const utils = {}
 utils.orbitControls = true
 utils.runningMan = {}
 utils.runningMan.animations = []
 utils.currentCameraPosition = 0
 utils.allObjects = []
 utils.cameraPositions = [
    [-50, 30, -20], // Left Side
     [0, 20, 30], // Back
     [50, 30, 20], // Right Side
     [0, 20, -30] //Front
 ]
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms:
    {
        uAlpha: {value: 1}
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
            uniform float uAlpha; 

            void main()
            {
                gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
            }
        `

})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

/**
 * Loaders
 */
const loadingBarElement = document.querySelector('.loading-bar')
const loadingCircleElement = document.querySelector('.loader')
const infoElement = document.querySelector('.infos')
 const loadingManger = new THREE.LoadingManager(
    // Loaded
    () => 
    {
        gsap.delayedCall(0.5, () => {
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0})
            loadingBarElement.classList.add('ended')
            loadingCircleElement.classList.add('fadeOut')
            infoElement.classList.add('fadeOut')
            loadingBarElement.style.transform = ''
            utils.orbitControls = false
        })
    },

    // Progress
    (itemUrl, itemsLoaded, itemTotal) => 
    {   
        const progressRatio = itemsLoaded / itemTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManger)
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */

/**
 * Materials
 */

/**
 * Bodys
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

/**
 * Model
 * /running-man/running_man_try_2.glb
 */
let mixer = null
let action = null
const runningManGroup = new THREE.Group()

utils.runningMan.position = { x: -20, y: 2, z: 150 }
utils.runningMan.rotation = Math.PI
gltfLoader.load(
    '/running-man/running_man_try_3.glb',
    (gltf) => {
        runningManGroup.add(gltf.scene)
        scene.add(runningManGroup)
        gltf.scene.scale.set(7, 7, 7)
        runningFunctions.position = utils.runningMan.position
        runningFunctions.rotation = utils.runningMan.rotation

        mixer = new THREE.AnimationMixer(gltf.scene)
        utils.runningMan.animations = gltf.animations
        runningFunctions.animations = gltf.animations
        action = mixer.clipAction(utils.runningMan.animations[1])
        action.play()
    }
)
const scenes = new THREE.Group()
let sceneMixer = null
let sceneAction = null
gsap.to(runningManGroup.position, { duration: 1, x: utils.runningMan.position.x, y: utils.runningMan.position.y, z: utils.runningMan.position.z })
runningManGroup.rotation.y = utils.runningMan.rotation
//this.gaspRunningManToPosition(utils.runningMan.position)
gltfLoader.load(
    '/scenes/jeffry-scene-18.glb',
    (gltf) => {

        scene.add(gltf.scene)
        console.log(gltf.animations)
        gltf.scene.scale.set(0.5, 0.5, 0.5)
        gltf.scene.rotation.y = -Math.PI / 2
        gltf.scene.children.forEach(child => utils.allObjects.push(child))

        // Animations
        sceneMixer = new THREE.AnimationMixer(gltf.scene)        
        for (let i = 0; i < gltf.animations.length; i++){
            sceneAction = sceneMixer.clipAction(gltf.animations[i])
            sceneAction.play()
        }
    }
)
scenes.position.x += 20
scenes.position.z += 20
scenes.scale.set(0.3, 0.3, 0.3)

// Raycaster
scene.add(myRaycaster.getRayCasterObject())




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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 5000)
camera.position.set(20, 50, 20)
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
    //if(utils.orbitControls) {controls.update()}
    if(!utils.orbitControls) {updateCamera(runningManGroup.position)}

    if (mixer) {
        mixer.update(deltaTime)
    }
    if (sceneMixer) {
        sceneMixer.update(deltaTime)
    }

    myRaycaster.detectRaycast(utils.allObjects)
    myRaycaster.updateCarRaycast(runningManGroup.position.clone(), runningFunctions.calculateForwards(runningManGroup.position.clone(), 100), runningManGroup.rotation.y)

    // Render
    renderer.render(scene, camera)

    // camera
    //thirdPersonCamera.Update(elapsedTime)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


/**
 * Functions
 */
export function gaspRunningManToPosition(position)
{
    if(action._clip.name == "idle") action.stop()
    if(action._clip.name != "jump") {
    gsap.to(runningManGroup.position, { duration: 1, x: position.x, y: position.y, z: position.z })

    //Raycaster
    
    //Animation
    action = mixer.clipAction(utils.runningMan.animations[3])
    action.play()
    }
}

export function rotateRunningMan(rotation)
{

    runningManGroup.rotation.y += rotation
}

export function stopRunning() {
    action.stop()
    action = mixer.clipAction(utils.runningMan.animations[1])
    action.play()
}

export function jump()
{
    action.stop()
    console.log(utils.runningMan.animations)
    action = mixer.clipAction(utils.runningMan.animations[2])
    action.play()
    setTimeout(function () {
        stopRunning()
    }, 1666);
    
}


function updateCamera(position)
{
    camera.lookAt(runningFunctions.calculateForwards(runningManGroup.position.clone(), 1))
    utils.cameraPositions[1][2] = runningFunctions.calculateForwards(runningManGroup.position.clone(), -30).z - runningManGroup.position.clone().z
    utils.cameraPositions[1][0] = runningFunctions.calculateForwards(runningManGroup.position.clone(), -30).x - runningManGroup.position.clone().x

    utils.cameraPositions[3][2] = runningFunctions.calculateForwards(runningManGroup.position.clone(), 30).z - runningManGroup.position.clone().z
    utils.cameraPositions[3][0] = runningFunctions.calculateForwards(runningManGroup.position.clone(), 30).x - runningManGroup.position.clone().x
    cameraPositions(position)
}

function cameraPositions(position)
{
    gsap.to(camera.position, { duration: 1, x: position.x + utils.cameraPositions[utils.currentCameraPosition][0], y:  position.y + utils.cameraPositions[utils.currentCameraPosition][1], z:  position.z + utils.cameraPositions[utils.currentCameraPosition][2]})
}

export function changeCameraPosition()
{
    utils.currentCameraPosition = (utils.cameraPositions.length - 1) > utils.currentCameraPosition ? (utils.currentCameraPosition + 1): 0
}

export function changeOrbitControls()
{
    utils.orbitControls = !utils.orbitControls
}
