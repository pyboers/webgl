import * as THREE from "three";
import { Matrix4 } from "three";

export class PostProcess{
    camera: THREE.OrthographicCamera;
    scene: THREE.Scene;
    material: THREE.ShaderMaterial;
    constructor(vShader: string, fShader: string){
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1);
        this.scene = new THREE.Scene();
        this.material = new THREE.ShaderMaterial({
            uniforms: {
            },
            vertexShader: vShader,
            fragmentShader: fShader,
            glslVersion: THREE.GLSL3
        });

        const quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2,), this.material);
        quad.frustumCulled = false;
        this.scene.add(quad);
    }
}