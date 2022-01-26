import { BufferGeometry, Camera, Color, DoubleSide, GLSL3, Group, Material, MathUtils, Matrix4, Mesh, Object3D, PlaneBufferGeometry, Scene, ShaderMaterial, Vector2, Vector3, Vector4, WebGLRenderer } from "three";
import { Shader } from "../shaders";

export class RaytracedCircle extends Mesh{
    shaderMat: ShaderMaterial;
    color: Color;
    constructor(color: Color){
        super(new PlaneBufferGeometry(1, 1), new ShaderMaterial({
            uniforms: {
                radius: {value: 0.5},
                color: {value: color}
            },
            vertexShader: Shader.circleVertex(),
            fragmentShader: Shader.circleFragment(),
            glslVersion: GLSL3,
            side: DoubleSide,
            transparent: true
        }));

        this.color = color;
        this.shaderMat = this.material as ShaderMaterial;

        this.setRadius(0.5);
    }

    setRadius(radius: number){
        this.scale.set(radius*2, radius*2, 1);
        this.shaderMat.uniforms.radius.value = radius;
        this.shaderMat.uniformsNeedUpdate = true;
    }

    getRadius(){
        return this.shaderMat.uniforms.radius.value;
    }
}