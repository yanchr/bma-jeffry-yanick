import * as THREE from 'three'
import gsap from 'gsap'
import * as script from './script'

export class LoadingElements {

    sceneReady = false
    overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
    overlayMaterial = new THREE.ShaderMaterial({
        transparent: true,
        uniforms:
        {
            uAlpha: { value: 1 }
        },
        vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
        fragmentShader: `
            uniform float uAlpha; 

            void main()
            {
                gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
            }
        `

    })

    setAllObjects(allObjects)
    {
        this.allObjects = allObjects
    }

    createOverlay() {
        return new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)
    }

    createLoadingManager() {
        const loadingBarElement = document.querySelector('.loading-bar')
        const infoElement = document.querySelector('.infos')
        const imgElement = document.createElement('img')
        infoElement.append(imgElement)
        imgElement.src = 'legend.png'
        imgElement.classList.add('img-element')
        const loadingManager = new THREE.LoadingManager(
            // Loaded
            () => {
                  gsap.delayedCall(0.5, () => {
                      gsap.to(this.overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
                      loadingBarElement.classList.add('ended')
                      // loadingCircleElement.classList.add('fadeOut')
                      infoElement.classList.add('fadeOut')
                      loadingBarElement.style.transform = ''
                      script.changeOrbitControls()
                      //script.positionPoints()
                      this.sceneReady = true
                  })
            },

            // Progress
            (itemUrl, itemsLoaded, itemTotal) => {
                const progressRatio = itemsLoaded / itemTotal
                loadingBarElement.style.transform = `scaleX(${progressRatio})`
            }
        )
        return loadingManager
        }
}