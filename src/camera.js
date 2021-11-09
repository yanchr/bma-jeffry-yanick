import * as THREE from 'three'
import gsap from 'gsap'

export class MyCamera {

    camera = null
    currentCameraPosition = 0
    positionBehindMen = 30
    lookAtDirection = 1
    cameraPositions = [
        [-50, 30, -20], // Left Side
        [0, 20, 30], // Back
        [50, 30, 20], // Right Side
        [0, 20, -30] //Front
    ]
    runningFunctions = null
    runningMan = null

    constructor(sizes, runningFunctions, runningMan) {
        this.camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 5000)
        this.camera.position.set(20, 50, 20)
        this.runningFunctions = runningFunctions
        this.runningMan = runningMan
    }

    get() {
        return this.camera
    }

    updateCamera(position) {
        this.camera.lookAt(this.runningFunctions.calculateForwards(this.runningMan.getGroup().position.clone(), this.lookAtDirection))
        this.cameraPositions[1][2] = this.runningFunctions.calculateForwards(this.runningMan.getGroup().position.clone(), -this.positionBehindMen).z - this.runningMan.getGroup().position.clone().z
        this.cameraPositions[1][0] = this.runningFunctions.calculateForwards(this.runningMan.getGroup().position.clone(), -this.positionBehindMen).x - this.runningMan.getGroup().position.clone().x

        this.cameraPositions[3][2] = this.runningFunctions.calculateForwards(this.runningMan.getGroup().position.clone(), this.positionBehindMen).z - this.runningMan.getGroup().position.clone().z
        this.cameraPositions[3][0] = this.runningFunctions.calculateForwards(this.runningMan.getGroup().position.clone(), this.positionBehindMen).x - this.runningMan.getGroup().position.clone().x
        this.goToPositionWithDisance(position)
    }

    goToPositionWithDisance(position) {
        gsap.to(this.camera.position, { duration: 1, x: position.x + this.cameraPositions[this.currentCameraPosition][0], y: position.y + this.cameraPositions[this.currentCameraPosition][1], z: position.z + this.cameraPositions[this.currentCameraPosition][2] })
    }

    changeCameraPosition() {
        this.currentCameraPosition = (this.cameraPositions.length - 1) > this.currentCameraPosition ? (this.currentCameraPosition + 1) : 0
    }
}