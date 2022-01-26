import * as THREE from "three";
import { MathUtils, Object3D, Vector2 } from "three";
import { ParticleLifeView } from "./engine/views/particle-life/particle-life-view";
import { PowderMagicView } from "./engine/views/powder-magic-view";
import { SphereCubeView } from "./engine/views/sphere-cube-view";
import { View } from "./engine/views/view";

export var timing: {
    clock: THREE.Clock;
    delta: number;
}
timing = {
    clock: new THREE.Clock(),
    delta: 0
}
timing.clock.autoStart = true;

const canvas = document.querySelector("#glCanvas")!;

const renderer = new THREE.WebGLRenderer( {canvas: canvas});
renderer.autoClear = false;
renderer.autoClearColor = false;
renderer.autoClearDepth = false;
renderer.autoClearStencil = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1);

var currentView: View;

currentView = new SphereCubeView(canvas);
currentView.start();


window.onresize = onResize;



function onResize(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentView.onResize(new Vector2(window.innerWidth, window.innerHeight), new Vector2(0, 0));
}

var iteration = 0;
function animate() {
    timing.delta = MathUtils.clamp(timing.clock.elapsedTime, 0.016, 1);


    renderer.clear(true, true, true); 

    currentView.render(renderer);


    currentView.update(timing.delta);
    requestAnimationFrame(animate);
};

animate();