import * as THREE from 'three'

//Source: https://www.youtube.com/watch?v=UuNPHOJ_V5o

export class ThrirdPersonCamera{
    constructor(params) {
        this._params = params
        this._camera = params.camera

        this._currentPosition = new THREE.Vector3()
        this._currentLookat = new THREE.Vector3()
    }

    _calculateIdealOffset() {
        const idealOffset = new THREE.Vector3(-15, 20, -30)
        idealOffset.applyQuaternion(this._params.target.rotation)
        idealOffset.add(this._params.target.position)
        return idealOffset
    }

    _calculateIdealLookAt() {
        const idealLookat = new THREE.Vector3(0, 10, 50)
        idealLookat.applyQuaternion(this._params.target.rotation)
        idealLookat.add(this._params.target.position)
        return idealLookat
    }

    Update(timeElapsed){
        const idealOffset = this._calculateIdealOffset()
        const idealLookat = this._calculateIdealLookAt()
        //Fill these in

        this._currentPosition.copy(idealOffset)
        this._currentLookat.copy(idealLookat)

        this._camera.position.copy(this._currentPosition)
        this._camera.lookAt(this._currentLookat)
    }
}