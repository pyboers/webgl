import { AdditiveBlending, BufferGeometry, Camera, Color, DoubleSide, GLSL3, Group, InstancedMesh, Material, MathUtils, Matrix4, Mesh, Object3D, PlaneBufferGeometry, Scene, ShaderMaterial, Vector2, Vector3, Vector4, WebGLRenderer } from "three";
import { Component } from "../../internal/component";
import { GameObject } from "../../internal/game-object";
import { Shader } from "../shaders";

export class InstancedCircleComponent implements Component{
    position: Vector3;
    radius: number;

    instancer: InstancedRTCircle;
    instanceId: number;

    constructor(instanceId: number, circle: InstancedRTCircle){
        this.instanceId = instanceId;
        this.position = new Vector3();
        this.radius = 0.5;

        this.instancer = circle;
    }

    init(object: GameObject): void {
        this.position = object.position;
    }

    update(dt: number): void {
        this.instancer.setMatrixAt(this.instanceId, new Matrix4()
            .makeTranslation(this.position.x, this.position.y, this.position.z)
            .multiply(new Matrix4().makeScale(this.radius * 2, this.radius * 2, 1)));
        this.instancer.instanceMatrix.needsUpdate = true;
    }

    setColor(color: THREE.Color){
        this.instancer.setColorAt(this.instanceId, color);
        this.instancer.instanceColor!.needsUpdate = true;
    }


}

export class InstancedRTCircle extends InstancedMesh{
    shaderMat: ShaderMaterial;

    constructor(radius: number, count: number){
        super(new PlaneBufferGeometry(radius * 2, radius * 2), new ShaderMaterial({
            uniforms: {
                radius: {value: radius}
            },
            vertexShader: Shader.circleVertexInstanced(),
            fragmentShader: Shader.circleFragmentInstanced(),
            glslVersion: GLSL3,
            side: DoubleSide,
            transparent: true
        }), count);

        this.shaderMat = this.material as ShaderMaterial;
    }

    getInstance(index: number){
        return new InstancedCircleComponent(index, this);
    }
}