const heightOfCube = 12
const centerCube = new THREE.Mesh(
    new THREE.BoxGeometry(heightOfCube * 2, heightOfCube, heightOfCube * 2),
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    })
)
centerCube.position.y = heightOfCube / 2
centerCube.position.z = -22
scene.add(centerCube)

const room1 = new THREE.Group();
const room2 = new THREE.Group();
const room3 = new THREE.Group();
gltfLoader.load(
    'Schritt_1.glb',
    (gltf) =>
    {
        gltf.scene.children.forEach(child => {
            child.material = materialTest
            room1.add(child)
        })
        // Get each object
        const left_human = room1.children.find((child) => child.name === 'Cube')
        const house = room1.children.find((child) => child.name === 'Cube002')

        // Apply materials
        left_human.material = cube1Material
        house.material = cube2Material
    }
)
gltfLoader.load(
    'Schritt_2.glb',
    (gltf) =>
    {
        gltf.scene.children.forEach(child => {
            child.material = materialTest
            room2.add(child)
        })
        // Get each object
        const room = room2.children.find((child) => child.name === 'room')

        // Apply materials
        room.material = cube1Material
    }
)

gltfLoader.load(
    'Schritt_3.glb',
    (gltf) =>
    {
        gltf.scene.children.forEach(child => {
            child.material = materialTest
            room3.add(child)
        })
        // Get each object
        const room = room3.children.find((child) => child.name === 'room')

        // Apply materials
        room.material = cube1Material
    }
)

gltfLoader.load(
    'running_man_try_1.glb',
    (gltf) =>
    {
        gltf.scene.children[0].scale.set(10, 10, 10)
        gltf.scene.children[0].material = materialTest
        console.log(gltf.scene.children[0])
        scene.add(gltf.scene.children[0])
    }
)

room2.rotation.y = Math.PI / 2
room2.position.z -= 21.5
room2.position.x += 22

room3.rotation.y = - Math.PI / 2
room3.position.z -= 21.5
room3.position.x -= 22


sceneGroup.add(room1, room2, room3)
scene.add(sceneGroup)