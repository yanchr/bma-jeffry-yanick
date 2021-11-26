import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'

export class RunningSolider{
    mixer = null
    action = null
    group = new THREE.Group()
    gltfLoader = new GLTFLoader()
    //position = { x: -20, y: 2, z: 150 }
    position = { x: -10, y: 2, z: -350 }
    animations = []
    rotation = Math.PI
    runningFunctions = null
    fastRunning = false
    walkingForwards = true

    constructor(gltfLoader, runningFunctions) {
        this.gltfLoader = gltfLoader
        this.runningFunctions = runningFunctions

        this.loadRunningMan()
        this.placeAtStartingPosition()
    }

    loadRunningMan() {
        this.gltfLoader.load(
            '/running-man/Soldier.glb',
            (gltf) => {
                this.group.add(gltf.scene)
                gltf.scene.scale.set(7, 7, 7)
                this.runningFunctions.position = this.position
                this.runningFunctions.rotation = this.rotation
                this.group.rotateY(this.rotation)
                this.rotateRunningMan(Math.PI)
                this.runningFunctions.addRotation(Math.PI)
                this.mixer = new THREE.AnimationMixer(gltf.scene)
                this.animations = gltf.animations
                this.runningFunctions.animations = gltf.animations
                this.action = this.mixer.clipAction(this.animations[0])
                this.action.play()

               // console.log(gltf.animations)
            }
        )
    }

    getGroup() {
        return this.group
    }

    startAnimationRun() {
        if (this.action._clip.name != 'Walk') {
            this.startAnimation(3)
        }
    }

    startRunning() {
        if (this.action._clip.name != 'Run') {
            this.startAnimation(1)
        }
    }

    startAnimation(animationNr) {
        this.action.stop()
        this.action = this.mixer.clipAction(this.animations[animationNr])
        this.action.play()
    }

    placeAtStartingPosition()
    { 
    gsap.to(this.group.position, { duration: 1, x: this.position.x, y: this.position.y, z: this.position.z })
    this.group.rotation.y = this.rotation
    }

    gaspRunningManToPosition(position) {
        gsap.to(this.group.position, { duration: 1, x: position.x, y: position.y, z: position.z })
        if(this.fastRunning){
            this.startRunning()
        } else {
            this.startAnimationRun()
        }
    }
    
    rotateRunningMan(rotation) {
        this.group.rotation.y += rotation
    }
    
    stopRunning() {
        this.startAnimation(0)
    }

    jump() {
       console.log('this person can not jump')
    }

    setFastRunning(runningFast) {
        this.fastRunning = runningFast
    }

    isWalkingForwards() {
        return this.walkingForwards
    }
}