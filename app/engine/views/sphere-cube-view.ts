import { MathUtils, Object3D, PerspectiveCamera, Renderer, Scene, Vector2, WebGLRenderer } from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { CubedSphere } from "../rendering/shapes/cubed-sphere";
import { View } from "./view";

export class SphereCubeView extends View{
    camera: THREE.PerspectiveCamera;
    controls: FlyControls;
    light: Object3D;
    scene: Scene;

    constructor(canvas: any){
        super();
        this.scene = new Scene();
        
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 2);
        this.camera.lookAt(0, 0, 0);
        this.camera.updateMatrix();
        this.camera.updateMatrixWorld();
        this.controls = new FlyControls(this.camera, canvas);
        this.controls.movementSpeed = 5;
        this.controls.rollSpeed = Math.PI / 2;
        this.controls.autoForward = false;
        this.controls.dragToLook = true;

        this.light = new Object3D();
        this.light.position.set(0.3, 0.3, 2);
    }

    start(): void {
        const dist = 50;
        for(let i =0 ; i < 1000; i++){
            const cs1 = new CubedSphere(this.light);

            cs1.position.set(MathUtils.randFloat(-dist, dist), MathUtils.randFloat(-dist, dist), MathUtils.randFloat(-dist, dist));

            this.scene.add(cs1);
        }
    }

    onResize(resolution: Vector2, offset: Vector2): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    update(dt: number): void {
        this.controls.update(dt);
    }

    render(renderer: WebGLRenderer): void {
        renderer.setRenderTarget(null);
        renderer.render(this.scene, this.camera);
    }
    
    stop(): void {
        this.scene.children = [];
    }

}