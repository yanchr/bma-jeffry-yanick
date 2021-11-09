import { keyManager } from './keymanager';
import * as script from './script'
import * as THREE from 'three'


export function listenOnEvents(runningFunctions, runningMan, camera) {

    let keys = {
        w: false,
        a: false,
        s: false,
        d: false,
        shift: false
      };

    addEventListener('click', e =>
    {
        //console.log('Click')
    })  
    
    window.addEventListener('resize', () => {
        script.resize()
    })

    addEventListener("keypress", (e) =>
    {
        goToKeyManager(e.key)
    })
  
    addEventListener("keydown", (e) =>
    {
         if (e.key.toLowerCase() === "w" || e.key == "ArrowUp") keys.w = true
         if (e.key.toLowerCase() === "a" || e.key == "ArrowLeft") keys.a = true
         if (e.key.toLowerCase() === "s" || e.key == "ArrowDown") keys.s = true
         if (e.key.toLowerCase() === "d" || e.key == "ArrowRight") keys.d = true 
         if (e.key === "Shift") keys.shift = true
    });
  
    addEventListener("keyup", (e) =>
    {
        if (e.key.toLowerCase() === "w" || e.key == "ArrowUp")  {keys.w = false; setTimeout(function () { runningMan.stopRunning() }, 1000);}
        if (e.key.toLowerCase() === "a" || e.key == "ArrowLeft")  keys.a = false
        if (e.key.toLowerCase() === "s" || e.key == "ArrowDown")  keys.s = false
        if (e.key.toLowerCase() === "d" || e.key == "ArrowRight")  keys.d = false
        if (e.key === "Shift") keys.shift = false
    });

    const clock = new THREE.Clock()
    let previousTime = 0

    const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    if(keys.w) goToKeyManager('w')
    if(keys.a) goToKeyManager('a')
    if(keys.d) goToKeyManager('d')
    if(keys.s) goToKeyManager('s')
    if(keys.shift) goToKeyManager('shift')
    if(!keys.shift) goToKeyManager('notshift')  
    window.requestAnimationFrame(tick)
    }
    
    tick()

    function goToKeyManager(key)
    {
        keyManager(key, runningFunctions, runningMan, camera)
    }




    //document.addEventListener('keyup', e => {
    //    setTimeout(function () { stopRunning() }, 1000);
    //});
}

