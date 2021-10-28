import * as THREE from 'three'

export class MyRaycaster {

    objectGroup = new THREE.Group()
    raycaster = new THREE.Raycaster()
    raycasterObject = new THREE.Mesh(
        new THREE.ConeGeometry(1, 100),
        new THREE.MeshBasicMaterial({ color: '#ff00ff' })
    )

    point = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshBasicMaterial({ color: '#ff00ff' })
    )
    currentIntersect = null

    constructor(){
        this.placeRayCasterObjectOnObject()
    }

    placeRayCasterObjectOnObject() 
    {
        this.raycasterObject.geometry.scale(0.1, 10, 0.2)
        this.raycasterObject.rotation.x = (Math.PI / 2)
        this.raycasterObject.rotation.z = Math.PI
        this.raycasterObject.position.y = 5

        

        this.objectGroup.add(this.raycasterObject, this.point)
    }

    getRayCasterObject()
    {
        return this.objectGroup
    }

    updateCarRaycast(position, directon, rotation){

        // Raycaster
        const rayOrigin = new THREE.Vector3(position.x, position.y, position.z)
        const rayDirection = new THREE.Vector3(directon.x, directon.y, directon.z)
        rayDirection.normalize()

        // Mesh
        this.raycaster.set(rayOrigin, rayDirection)
        this.raycasterObject.position.x = position.x
        this.raycasterObject.position.z = position.z
        this.raycasterObject.rotation.z = -rotation
        this.point.position.set(directon.x, directon.y, directon.z)
    }
    
    detectRaycast(objects){
        if (objects[0]) {
            const intersects = this.raycaster.intersectObjects(objects)
            this.currentIntersect = intersects
            if(this.currentIntersect.length)
            {
                console.log(this.currentIntersect[0].object.name)
                this.raycasterObject.material.color = new THREE.Color(0x00ff00)
                if (this.currentIntersect[0].distance < 6){
                    console.log('dont run')
                }else{
                    //console.log('run')
                }
            }else{
                this.raycasterObject.material.color = new THREE.Color(0xff00ff)
                //console.log('run')
            }
        }
    }
}