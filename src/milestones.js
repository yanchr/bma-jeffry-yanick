import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class Milestones {

    group = new THREE.Group()
    mixer = null
    action = null
    gltfLoader = new GLTFLoader()
    animations = []
    allMilestones = []
    
    position = {}
    rotation = 0
    runningFunctions = null

    constructor(gltfLoader) {
        this.gltfLoader = gltfLoader
        this.loadMileStones()
    }

    loadMileStones() {
        this.gltfLoader.load(
            '/scenes/jeffry-scene-19.glb',
            (gltf) => {
                this.group.add(gltf.scene)
                gltf.scene.scale.set(0.5, 0.5, 0.5)
                gltf.scene.rotation.y = -Math.PI / 2
                gltf.scene.children.forEach(child => this.allMilestones.push(child))

                // Animations
                this.mixer = new THREE.AnimationMixer(gltf.scene)
                for (let i = 0; i < gltf.animations.length; i++) {
                    //console.log(gltf.animations)
                    this.action = this.mixer.clipAction(gltf.animations[i])
                    this.action.play()
                }
            }
        )
    }

    getGroup()
    {
        return this.group
    }

    getAll()
    {
        return this.allMilestones
    }




}