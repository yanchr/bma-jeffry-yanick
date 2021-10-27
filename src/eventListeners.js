import { stopRunning } from './script'
import { keyManager } from './keymanager';
import * as THREE from 'three'


export function listenOnEvents(runningFunctions) {

    let keys = {
        w: false,
        a: false,
        s: false,
        d: false,
        shift: false
      };

    addEventListener('click', e =>
    {
        console.log('Click')
    })   

    addEventListener("keypress", (e) =>
    {
        keyManager(e.key, runningFunctions)
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
        if (e.key.toLowerCase() === "w" || e.key == "ArrowUp")  {keys.w = false; setTimeout(function () { stopRunning() }, 1000);}
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
    if(keys.w) keyManager('w', runningFunctions)
    if(keys.a) keyManager('a', runningFunctions)
    if(keys.d) keyManager('d', runningFunctions)
    if(keys.s) keyManager('s', runningFunctions)  
    if(keys.shift) keyManager('shift', runningFunctions)  
    if(!keys.shift) keyManager('notshift', runningFunctions)  
    window.requestAnimationFrame(tick)
    }
    
    tick()




    //document.addEventListener('keyup', e => {
    //    setTimeout(function () { stopRunning() }, 1000);
    //});
}

