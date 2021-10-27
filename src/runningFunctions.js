import gsap from 'gsap'
import * as THREE from 'three'

export class RunningFunctions {

    animations = []
    position = {}
    rotation = 0
    mixer = new THREE.AnimationMixer()
    object = new THREE.Group()
    //rotation = this.object.rotation.y
    
    addRotation(rotation){
        this.rotation += rotation
    }

    calculateForwards(currentPosition, runningLength) {
        return this.runForwards(currentPosition, this.calculateCurrentDirection(), runningLength)
    }

    calculateCurrentDirection() {
        return parseFloat((this.rotation / Math.PI / 2).toFixed(2).toString().split('.')[1]) / 100
    }

    runForwards(currentPosition, currentDirection, runningLength) {
        if (currentDirection <= 0.25) {
            currentDirection = currentDirection * 4
            currentPosition.x += this.shortWay(currentDirection, runningLength)
            currentPosition.z += this.longWay(currentDirection, runningLength)
        } else if (currentDirection <= 0.50) {
            currentDirection = (currentDirection - 0.25) * 4
            currentPosition.x += this.longWay(currentDirection, runningLength)
            currentPosition.z -= this.shortWay(currentDirection, runningLength)
        } else if (currentDirection <= 0.75) {
            currentDirection = (currentDirection - 0.50) * 4
            currentPosition.x -= this.shortWay(currentDirection, runningLength)
            currentPosition.z -= this.longWay(currentDirection, runningLength)
        } else {
            currentDirection = (currentDirection - 0.75) * 4
            currentPosition.x -= this.longWay(currentDirection, runningLength)
            currentPosition.z += this.shortWay(currentDirection, runningLength)
        }

        return currentPosition
    }

    shortWay(currentDirection, runningLength){
        return currentDirection * runningLength
    }

    longWay(currentDirection, runningLength){
        return (1 - currentDirection) * runningLength
    }
}
