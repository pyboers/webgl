import * as THREE from 'three';
import { DoubleSide, MathUtils, Matrix4, Object3D, ShaderMaterial, Vector3, Vector4 } from 'three';
import { Shader } from '../shaders';

export class CubedSphere extends THREE.Mesh{
    iteration: number;
    light: Object3D;
    constructor(light: Object3D){
        super(new THREE.BoxBufferGeometry(2, 2, 2), new THREE.ShaderMaterial({
            uniforms: {
                camView:  {value: new Matrix4()},
                camPos: {value: new Vector3()},
                lightPos: {value: new Vector3()},
                spherePos: {value: new Vector3()},
                sphereRadius: {value: 1},
                camProjection: {value: new Matrix4()},
                cubeSize: {value: 0.1},
                resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)}
            },
            vertexShader: Shader.cubedSphereVertex(),
            fragmentShader: Shader.cubedSphereFragment(),
            glslVersion: THREE.GLSL3,
            side: THREE.DoubleSide
        }));

        this.light = light;
        this.iteration = 100000;
        this.onBeforeRender = this.preRender;
    }

    preRender(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, geometry: THREE.BufferGeometry, material: THREE.Material, group: THREE.Group) {
        const shaderMat = this.material as ShaderMaterial;

        let step = this.iteration++/1000;
        shaderMat.uniforms.cubeSize.value = MathUtils.lerp(0.5, 0.001, (step/(step+2)));

        const viewPort = new Vector4();
        renderer.getViewport(viewPort);
        shaderMat.uniforms.resolution.value = new THREE.Vector2(viewPort.z - viewPort.x, viewPort.w - viewPort.y);

        shaderMat.uniforms.lightPos.value = this.light.position;
        shaderMat.uniforms.spherePos.value = this.position;
        shaderMat.uniforms.sphereRadius.value = Math.min(this.scale.x, this.scale.y, this.scale.z);
        shaderMat.uniforms.camPos.value = camera.position;

        shaderMat.uniforms.camView.value = camera.matrixWorld.clone();
        shaderMat.uniforms.camProjection.value = camera.projectionMatrixInverse.clone();
        // shaderMat.uniforms.camView.value = new THREE.Matrix4().makeTranslation(camera.position.x, camera.position.y, camera.position.z)
        // .multiply(new THREE.Matrix4().makeRotationFromQuaternion(camera.quaternion.clone().invert())).invert();
        shaderMat.uniformsNeedUpdate = true;
    }
}