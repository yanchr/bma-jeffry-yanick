import * as THREE from 'three'


export class DetectObjects{
    positionOfScreens = new Map()
    needDistanceToScreen = 20
  
    constructor(){
       this.positionOfScreens.set("1", new THREE.Vector3(20, 0, -336))
       this.positionOfScreens.set("2", new THREE.Vector3(20, 0, -230))
       this.positionOfScreens.set("3", new THREE.Vector3(20, 0, -144))
       this.positionOfScreens.set("4", new THREE.Vector3(20, 0, -50))
       this.positionOfScreens.set("5", new THREE.Vector3(20, 0, 43))
       this.positionOfScreens.set("6", new THREE.Vector3(5, 0, 136))
    }

    detectScreenInReach(positionOfMen){
        for(let screen of this.positionOfScreens.entries()){

            // Calculate Vector from Charakter to each Screen
            const vectorToMen = new THREE.Vector3(screen[1].x - positionOfMen.x, screen[1].y - positionOfMen.y, screen[1].z - positionOfMen.z)

            // Calculate length of Vector
            const distanceToMen = Math.sqrt(Math.pow(vectorToMen.x, 2) + Math.pow(vectorToMen.y, 2) + Math.pow(vectorToMen.z, 2))
            
            if(distanceToMen < this.needDistanceToScreen) return screen[0]
        }
    }
}