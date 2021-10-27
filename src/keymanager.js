import * as script from './script'
import { RunningFunctions } from './runningFunctions'

let speed = 0.3
const rotationStrength = 32
export function keyManager(key, runningFunctions) {
    switch (key) {
        case 'w':
            // Run Forwards
            script.gaspRunningManToPosition(runningFunctions.calculateForwards(runningFunctions.position, speed))
            break
        case 'a':
            // Turn to left
            runningFunctions.addRotation(Math.PI / rotationStrength)
            script.rotateRunningMan(Math.PI / rotationStrength)
            break
        case 'd':
            // Turn to Right
            runningFunctions.addRotation(Math.PI / rotationStrength * (rotationStrength * 2 - 1))
            script.rotateRunningMan(Math.PI / rotationStrength * (rotationStrength * 2 - 1))
            break
        case 's':
            // Run Backwards
            script.gaspRunningManToPosition(runningFunctions.calculateForwards(runningFunctions.position, -speed))
            break
        case 'o':
            // Change Camera to Orbit Controls
            script.changeOrbitControls()
            break
        case 'shift':
            // Run Faster
            speed = 1
            break
        case 'notshift':
            // Run normal speed
            speed = 0.3
            break
        case ' ':
            // jump
            script.jump(runningFunctions.calculateForwards(runningFunctions.position, speed))
            break
        case 'c':
            // Change camera position
            script.changeCameraPosition()

        default:
            break
    }
}