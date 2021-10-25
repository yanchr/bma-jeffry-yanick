import gsap from 'gsap'
import { gaspRunningManToPosition } from './script'
import { rotateRunningMan } from './script'
import * as THREE from 'three'

export class RunningFunctions {

    animations = []
    position = {}
    mixer = new THREE.AnimationMixer()
    object = new THREE.Group()
    rotation = this.object.rotation.y
    
    runningManManager(e) {
        const rotationStrength = 8

        switch (e.key) {
            case 'w':
            case 'ArrowUp':
                break
            case 'a':
            case 'ArrowLeft':
                this.rotation += Math.PI / rotationStrength
                rotateRunningMan(Math.PI / rotationStrength)
                break
            case 'd':
            case 'ArrowRight':
                this.rotation += Math.PI / rotationStrength * (rotationStrength * 2 - 1)
                rotateRunningMan(Math.PI / rotationStrength * (rotationStrength * 2 - 1))
                break
            default:
        }
        gaspRunningManToPosition(this.calculateForwards(this.position))
    }

    calculateForwards(currentPosition) {
        return this.runForwards(currentPosition, this.calculateCurrentDirection())
    }

    calculateCurrentDirection() {
        return parseFloat((this.rotation / Math.PI / 2).toFixed(2).toString().split('.')[1]) / 100
    }

    runForwards(currentPosition, currentDirection) {
        if (currentDirection <= 0.25) {
            currentDirection = currentDirection * 4
            currentPosition.x += currentDirection
            currentPosition.z += 1 - currentDirection
        } else if (currentDirection <= 0.50) {
            currentDirection = (currentDirection - 0.25) * 4
            currentPosition.x += 1 - currentDirection
            currentPosition.z -= currentDirection
        } else if (currentDirection <= 0.75) {
            currentDirection = (currentDirection - 0.50) * 4
            currentPosition.x -= currentDirection
            currentPosition.z -= 1 - currentDirection
        } else {
            currentDirection = (currentDirection - 0.75) * 4
            currentPosition.x -= 1 - currentDirection
            currentPosition.z += currentDirection
        }

        return currentPosition
    }
}
