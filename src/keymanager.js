import * as script from './script'
import { RunningFunctions } from './runningFunctions'

const fastSpeed = 2 
const slowSpeed = 0.5
let speed = slowSpeed
const rotationStrength = 128
export function keyManager(key, runningFunctions, runningMan, camera) {
    switch (key) {
        case 'w':
            // Run Forwards
            runningMan.gaspRunningManToPosition(runningFunctions.calculateForwards(runningFunctions.position, speed))
            break
        case 'a':
            // Turn to left
            runningFunctions.addRotation(Math.PI / rotationStrength)
            runningMan.rotateRunningMan(Math.PI / rotationStrength)
            break
        case 'd':
            // Turn to Right
            runningFunctions.addRotation(Math.PI / rotationStrength * (rotationStrength * 2 - 1))
            runningMan.rotateRunningMan(Math.PI / rotationStrength * (rotationStrength * 2 - 1))
            break
        case 's':
            // Run Backwards
            runningMan.gaspRunningManToPosition(runningFunctions.calculateForwards(runningFunctions.position, -speed))
            break
        case 'o':
            // Change Camera to Orbit Controls
            script.changeOrbitControls()
            break
        case 'shift':
            // Run Faster
            speed = fastSpeed
            runningMan.setFastRunning(true)
            break
        case 'notshift':
            // Run normal speed
            speed = slowSpeed
            runningMan.setFastRunning(false)
            break
        case ' ':
            // jump
            runningMan.jump(runningFunctions.calculateForwards(runningFunctions.position, speed))
            break
        case 'c':
            // Change camera position
            camera.changeCameraPosition()
            break
        default:
            break
    }
}