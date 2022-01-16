import * as THREE from "three";
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { MathUtils, Object3D } from "three";
import { PostProcess } from "./engine/post-process";
import { cubedSphereFragment, cubedSphereVertex } from "./engine/shaders";

const scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector("#glCanvas")!;
const renderer = new THREE.WebGLRenderer( {canvas: canvas});
renderer.autoClear = false;
renderer.autoClearColor = false;
renderer.autoClearDepth = false;
renderer.autoClearStencil = false;
renderer.setSize(window.innerWidth, window.innerHeight);

const shadowBuffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
const lightCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const geometry = new THREE.BoxGeometry(4, 4, 4);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const post = new PostProcess(cubedSphereVertex(), cubedSphereFragment());


window.onresize = onResize;


camera.position.set(0, 0, 2);
// camera.lookAt(0, 0, 0);
camera.updateMatrix();
camera.updateMatrixWorld();
post.material.uniforms = {
    camView:  {value: camera.matrixWorldInverse},
    camPos: {value: camera.position},
    camProjection: {value: camera.projectionMatrixInverse},
    cubeSize: {value: 0.1},
    resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
    shadows: {value: shadowBuffer.texture}
}
post.material.transparent = true;
post.material.depthWrite = false;
post.material.uniformsNeedUpdate = true;

var controls = new FlyControls( camera, renderer.domElement );
controls.movementSpeed = 2;
controls.rollSpeed = Math.PI / 2;
controls.autoForward = false;
controls.dragToLook = true;

function onResize(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    post.material.uniforms = {
        camView:  {value: camera.matrixWorldInverse},
        camPos: {value: camera.position},
        camProjection: {value: camera.projectionMatrixInverse},
        cubeSize: {value: 0.1},
        resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)}
    }
    post.material.uniformsNeedUpdate = true;

}
var iteration = 0;
function animate() {
    renderer.clear(true, true, true);

    post.material.uniforms.cubeSize.value = MathUtils.lerp(0.5, 0.00001, ((iteration++)%10000)/10000);

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);

    renderer.render(post.scene, post.camera);
    controls.update(0.01);

    post.material.uniforms.camView.value = new THREE.Matrix4().makeTranslation(camera.position.x, camera.position.y, camera.position.z)
    .multiply(new THREE.Matrix4().makeRotationFromQuaternion(camera.quaternion.clone().invert())).invert();
    post.material.uniformsNeedUpdate = true;
    requestAnimationFrame(animate);
};

animate();