// import * as THREE from "three";
// import { MathUtils } from "three";
// import { V3dRaycaster } from "../collision-detection/v3draycaster";
// import {Input} from "../utils/input";

// const ROTATION_SCALAR = -0.2;
// const SCROLL_SCALAR = 2;
// const ORBIT_BALL_SIZE_RATIO = 1;
// const ORBIT_BALL_MAX_SIZE = 10;
// export class OrbitControls {
//     camera: THREE.PerspectiveCamera;
//     raycaster: V3dRaycaster;

//     orbitStartLocation: THREE.Vector3;
//     orbitting: boolean;
//     panStartLocation: THREE.Vector3;
//     panning: boolean;

//     zoomDist: number;
//     zoomStartLocation: THREE.Vector3;
//     zoomingAmt: number;

//     orbitPoint: THREE.Mesh;

//     lastMouseCoords = new THREE.Vector2(0, 0);

//     framesToRender: number;

//     constructor(camera: THREE.PerspectiveCamera, raycaster: V3dRaycaster, orbitPoint: THREE.Mesh, myCanvas: any) {
//         this.camera = camera;
//         this.raycaster = raycaster;
//         this.orbitStartLocation = new THREE.Vector3();
//         this.panStartLocation = new THREE.Vector3();
//         this.zoomStartLocation = new THREE.Vector3();
//         this.zoomDist = 0;
//         this.orbitting = false;
//         this.panning = false;
//         this.zoomingAmt = 0;
//         this.orbitPoint = orbitPoint;
//         this.framesToRender = 1;

       
//         myCanvas.addEventListener('contextmenu', function (event: MouseEvent) {
//             event.preventDefault();
//         }, false);
//         window.addEventListener('contextmenu', (e) => {
//             if(this.orbitting || this.panning)
//                 e.preventDefault()
//             this.orbitting = false;
//             this.panning = false;
//             this.orbitPoint.visible = false;
//         });
//     }

//     isMoving(){
//         return this.framesToRender > 0;
//     }

//     rotateCameraAroundPoint(point: THREE.Vector3, axis: THREE.Vector3, theta: number) {
//         this.camera.parent?.localToWorld(this.camera.position);
//         this.camera.position.sub(point);
//         this.camera.position.applyAxisAngle(axis, theta);
//         this.camera.position.add(point);
//         this.camera.parent?.worldToLocal(this.camera.position);
//         this.camera.rotateOnWorldAxis(axis, theta);
//     }

//     checkInputs(){
//         const scrollAmt = Input.getMouseScroll();
//         if(scrollAmt != 0){
//             if (this.raycaster.raycastHitList.length > 0) {
//                 const firstRay = this.raycaster.raycastHitList[0]!;
//                 this.zoomingAmt += scrollAmt;
//                 this.zoomStartLocation = firstRay.hit;
//                 this.zoomDist = firstRay.distance;
//             }
//         }

//         if(Input.getMouseDown(0)){
//             this.orbitting = true;
//             this.lastMouseCoords = Input.mouseCoords;
//             if (this.raycaster.raycastHitList.length > 0) {
//                 const firstRay = this.raycaster.raycastHitList[0]!;
//                 this.orbitStartLocation = firstRay.hit;
//                 this.orbitPoint.position.set(this.orbitStartLocation.x, this.orbitStartLocation.y, this.orbitStartLocation.z);

//                 const size = MathUtils.clamp(firstRay.distance * ORBIT_BALL_SIZE_RATIO, 0, ORBIT_BALL_MAX_SIZE) 
//                 this.orbitPoint.scale.set(size, size, size);
//                 this.orbitPoint.updateMatrix();
//                 this.orbitPoint.updateMatrixWorld();
//                 this.orbitPoint.visible = true;
//             }
//         }
                   
//         if(Input.getMouseDown(2)){
//             this.panning = true;
//             this.lastMouseCoords = Input.mouseCoords;
//             if (this.raycaster.raycastHitList.length > 0) {
//                 const firstRay = this.raycaster.raycastHitList[0]!;
//                 this.panStartLocation = firstRay.hit.clone().project(this.camera);;
//                 this.orbitPoint.position.set(firstRay.hit.x, firstRay.hit.y, firstRay.hit.z);

//                 const size = MathUtils.clamp(firstRay.distance * ORBIT_BALL_SIZE_RATIO, 0, ORBIT_BALL_MAX_SIZE) 
//                 this.orbitPoint.scale.set(size, size, size);
//                 this.orbitPoint.updateMatrix();
//                 this.orbitPoint.updateMatrixWorld()
//                 this.orbitPoint.visible = true;
//             }
//         }

//         if(Input.getMouseUp(0)){
//             this.orbitting = false;
//             this.orbitPoint.visible = false;
//         }
//         if(Input.getMouseUp(2)){
//             this.panning = false;
//             this.orbitPoint.visible = false;
//         }
//     }

//     update(dt: number) {
//         this.checkInputs();
//         if (this.orbitting) {
//             const mouseDelta = Input.mouseCoords.clone().sub(this.lastMouseCoords);
//             const rotx = (mouseDelta.x / (dt)) * ROTATION_SCALAR;
//             const roty = -(mouseDelta.y / (dt)) * ROTATION_SCALAR;
//             this.rotateCameraAroundPoint(this.orbitStartLocation, new THREE.Vector3(0, 1, 0), rotx);

//             const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
//             this.rotateCameraAroundPoint(this.orbitStartLocation, right, roty);
//             this.lastMouseCoords = Input.mouseCoords.clone();
//             this.framesToRender = 1;
//         }
//         else if (this.panning) {
//             this.camera.position.add(this.panStartLocation.clone().unproject(this.camera).sub(new THREE.Vector3(Input.mouseCoords.x, Input.mouseCoords.y, this.panStartLocation.z).unproject(this.camera)));
//             this.panStartLocation.x = Input.mouseCoords.x;
//             this.panStartLocation.y = Input.mouseCoords.y;
//             this.framesToRender = 1;
//         }
//         else if (this.zoomingAmt != 0) {
//             const d = MathUtils.clamp(this.zoomDist, 0.25, this.zoomDist) * 0.25 * this.zoomingAmt;
//             this.camera.position.add(this.raycaster.raycaster.ray.direction.clone().multiplyScalar(-d * SCROLL_SCALAR));
//             this.zoomingAmt = 0;
//             this.framesToRender = 7;
//         }else if(this.framesToRender > 0){
//             this.framesToRender--;
//         }

//         this.camera.updateMatrix();
//         this.camera.updateMatrixWorld();

//     }

//     FocusOn(viewBox: THREE.Box3, scale: number, forward: THREE.Vector3 | undefined = undefined)
//     {
//         const worldUp = new THREE.Vector3(0, 1, 0)
//         const worldRight = new THREE.Vector3(1, 0, 0);
//         const worldForward = new THREE.Vector3(0, 0, 1);

//         let viewBoxSize = new THREE.Vector3();
//         let viewBoxCenter = new THREE.Vector3();
//         viewBox.getSize(viewBoxSize);
//         viewBox.getCenter(viewBoxCenter);

//         let movDir: THREE.Vector3;
//         if(forward !== undefined){
//             movDir = forward
//         }else{
//             movDir = worldUp.clone().cross(viewBoxSize.x > viewBoxSize.z ? worldRight : worldForward).normalize();
//         } 

//         const newPos = (viewBoxCenter.clone().add(movDir.negate().multiplyScalar(this.computeViewDistance(viewBox, worldUp.clone().cross(movDir).normalize()) / scale)));
//         this.camera.position.set(newPos.x, newPos.y, newPos.z);
//         this.camera.updateMatrix();
//         this.camera.updateMatrixWorld();
//         this.camera.lookAt(viewBoxCenter);
        
//         this.camera.updateMatrix();
//         this.camera.updateMatrixWorld();
//     }

//     FocusOnAngled(viewBox: THREE.Box3, scale: number, rotation: number){
//         let viewBoxSize = new THREE.Vector3();
//         let viewBoxCenter = new THREE.Vector3();
//         viewBox.getSize(viewBoxSize);
//         viewBox.getCenter(viewBoxCenter);

//         const worldUp = new THREE.Vector3(0, 1, 0)
//         const worldRight = new THREE.Vector3(1, 0, 0);
//         const worldForward = new THREE.Vector3(0, 0, 1);
        
//         let movDir = worldUp.clone().cross(viewBoxSize.x > viewBoxSize.z ? worldRight : worldForward).normalize();
//         movDir.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(movDir.clone().cross(worldUp).normalize(), rotation));
//         this.FocusOn(viewBox, scale, movDir);
//     }

//     computeViewDistance(box: THREE.Box3, right: THREE.Vector3)
//     {
//         const margin = 1.0;
//         const maxExtent = Math.abs(right.dot(box.max) - right.dot(box.min));

//         return (maxExtent/2 * margin) * ((1.0 / Math.tan((Math.PI/180) * this.camera.fov / 2.0)));
//     }
// }